#!/usr/bin/env python3
"""Check the committed source without printing credential material."""

import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path
from pathlib import PurePosixPath
import subprocess
import sys
import tarfile
import tempfile
import urllib.request


VERSION = "8.30.1"
# Reviewed digest for the exact linux_x64 release archive. Updating the scanner
# requires reviewing a new digest rather than trusting mutable release metadata.
SCANNER_ARCHIVE_SHA256 = "551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb"


def install_scanner(work):
    asset = f"gitleaks_{VERSION}_linux_x64.tar.gz"
    base = f"https://github.com/gitleaks/gitleaks/releases/download/v{VERSION}"
    archive = work / asset
    with urllib.request.urlopen(f"{base}/{asset}", timeout=45) as response:
        archive.write_bytes(response.read())
    if hashlib.sha256(archive.read_bytes()).hexdigest() != SCANNER_ARCHIVE_SHA256:
        raise RuntimeError("Scanner checksum verification failed")
    binary = work / "gitleaks"
    with tarfile.open(archive) as source:
        member = source.getmember("gitleaks")
        if not member.isfile():
            raise RuntimeError("Invalid scanner archive")
        binary.write_bytes(source.extractfile(member).read())
    binary.chmod(0o755)
    return binary


def scan(scanner, source, work, name):
    report = work / f"{name}.json"
    config = work / "scanner.toml"
    config.write_text("[extend]\nuseDefault = true\n")
    ignore = work / "empty-ignore"
    ignore.write_text("")
    result = subprocess.run([
        str(scanner), "dir", str(source), "--config", str(config),
        "--gitleaks-ignore-path", str(ignore), "--ignore-gitleaks-allow",
        "--redact=100", "--no-banner", "--log-level=error",
        "--max-decode-depth=2", "--max-archive-depth=2", "--timeout=600",
        "--report-format=json", "--report-path", str(report),
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False)
    if result.returncode not in (0, 1) or not report.is_file():
        raise RuntimeError("The source scan could not finish")
    findings = json.loads(report.read_text()) or []
    if bool(findings) != (result.returncode == 1):
        raise RuntimeError("Inconsistent scanner result")
    return findings


def self_test(scanner, work):
    fixture = work / "fixture"
    fixture.mkdir()
    (fixture / "ordinary.txt").write_text("Published program information.\n")
    if scan(scanner, fixture, work, "ordinary"):
        raise RuntimeError("Scanner rejected ordinary source")
    # This synthetic identifier has no issued credential or secret key.
    example = "AKIA" + "Q2V7N4X3" + "K3M4P6R5"
    (fixture / "example.txt").write_text(f"aws_access_key_id = {example}\n")
    (fixture / ".gitignore").write_text("example.txt\n")
    findings = scan(scanner, fixture, work, "example")
    if not any(item.get("RuleID") == "aws-access-token" for item in findings):
        raise RuntimeError("Scanner did not reject the synthetic credential fixture")
    # Exercise the same Git export as the release scan, including export-ignore.
    repository = work / "fixture-repository"
    repository.mkdir()
    subprocess.run(["git", "init", "--quiet", str(repository)], check=True)
    for name in (".gitattributes", "example.txt"):
        (repository / name).write_bytes((fixture / name).read_bytes() if name == "example.txt"
                                       else b"example.txt export-ignore\n")
    subprocess.run(["git", "add", "."], cwd=repository, check=True)
    subprocess.run(["git", "-c", "user.name=Scanner fixture", "-c", "user.email=fixture@example.invalid",
                    "commit", "--quiet", "-m", "Scanner fixture"], cwd=repository, check=True)
    exported = work / "fixture-export"
    exported.mkdir()
    export_tracked_blobs(repository, exported)
    if not any(item.get("RuleID") == "aws-access-token"
               for item in scan(scanner, exported, work, "exported-example")):
        raise RuntimeError("Committed source escaped verification")
    print("Scanner self-test passed.")


def export_tracked_blobs(repository, destination):
    inventory = subprocess.run(["git", "ls-tree", "-r", "-z", "HEAD"], cwd=repository,
                               stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True).stdout
    for entry in inventory.split(b"\0"):
        if not entry:
            continue
        metadata, raw_path = entry.split(b"\t", 1)
        mode, kind, object_id = metadata.split()
        path = PurePosixPath(raw_path.decode("utf-8"))
        if kind != b"blob" or mode not in (b"100644", b"100755", b"120000"):
            raise RuntimeError("Unsupported tracked source entry")
        if path.is_absolute() or ".." in path.parts or not path.parts:
            raise RuntimeError("Invalid tracked source path")
        target = destination.joinpath(*path.parts)
        target.parent.mkdir(parents=True, exist_ok=True)
        # Write symlink contents as ordinary files; never follow repository links.
        contents = subprocess.run(["git", "cat-file", "blob", object_id.decode("ascii")],
                                  cwd=repository, stdout=subprocess.PIPE,
                                  stderr=subprocess.PIPE, check=True).stdout
        target.write_bytes(contents)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--scanner", type=Path)
    parser.add_argument("--self-test", action="store_true")
    options = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    with tempfile.TemporaryDirectory(prefix="sozorock-source-check-") as directory:
        work = Path(directory)
        scanner = options.scanner.resolve() if options.scanner else install_scanner(work)
        if options.self_test:
            self_test(scanner, work)
        source = work / "source"
        source.mkdir()
        export_tracked_blobs(root, source)
        findings = scan(scanner, source, work, "tracked")
        counts = Counter(item.get("RuleID", "unknown") for item in findings)
        print("Tracked-source findings by rule: " + json.dumps(dict(sorted(counts.items()))))
        for item in findings[:40]:
            filename = Path(str(item.get("File", "")))
            try:
                filename = filename.relative_to(source)
            except ValueError:
                filename = Path(filename.name)
            print(json.dumps({"file": str(filename), "line": item.get("StartLine"),
                              "rule": item.get("RuleID")}))
        if len(findings) > 40:
            print("Additional locations omitted; review the private scanner report.")
        return 1 if findings else 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception:
        print("Tracked-source verification failed; credential-bearing diagnostics were withheld.", file=sys.stderr)
        sys.exit(2)
