"""Exercise the scanner download trust boundary without network requests."""
import hashlib
import importlib.util
import io
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import patch

SOURCE = Path(__file__).resolve().parents[1] / "scripts/check-tracked-secrets.py"
spec = importlib.util.spec_from_file_location("source_scanner", SOURCE)
scanner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(scanner)


def fixture_archive():
    stream = io.BytesIO()
    executable = b"#!/bin/sh\nexit 0\n"
    with tarfile.open(fileobj=stream, mode="w:gz") as archive:
        member = tarfile.TarInfo("gitleaks")
        member.size = len(executable)
        archive.addfile(member, io.BytesIO(executable))
    return stream.getvalue(), executable


class ScannerInstallTests(unittest.TestCase):
    def test_release_pin_is_reviewed(self):
        self.assertEqual(scanner.VERSION, "8.30.1")
        self.assertEqual(scanner.SCANNER_ARCHIVE_SHA256,
                         "551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb")

    def test_matching_archive_installs_without_fetching_a_checksum(self):
        contents, executable = fixture_archive()
        with tempfile.TemporaryDirectory() as directory, \
             patch.object(scanner, "SCANNER_ARCHIVE_SHA256", hashlib.sha256(contents).hexdigest()), \
             patch.object(scanner.urllib.request, "urlopen", return_value=io.BytesIO(contents)) as download:
            binary = scanner.install_scanner(Path(directory))
            self.assertEqual(binary.read_bytes(), executable)
            self.assertTrue(binary.stat().st_mode & 0o100)
            download.assert_called_once_with(
                "https://github.com/gitleaks/gitleaks/releases/download/v8.30.1/gitleaks_8.30.1_linux_x64.tar.gz",
                timeout=45,
            )

    def test_changed_archive_is_rejected_before_extraction(self):
        contents, _ = fixture_archive()
        # A replacement archive is invalid even if a release checksum file could
        # be changed alongside it. The installer must never request that file.
        for replacement in (contents, contents + b"changed"):
            with self.subTest(replacement_size=len(replacement)), tempfile.TemporaryDirectory() as directory, \
                 patch.object(scanner.urllib.request, "urlopen", return_value=io.BytesIO(replacement)) as download, \
                 patch.object(scanner.tarfile, "open") as extract:
                with self.assertRaisesRegex(RuntimeError, "checksum verification failed"):
                    scanner.install_scanner(Path(directory))
                self.assertEqual(download.call_count, 1)
                extract.assert_not_called()
                self.assertFalse((Path(directory) / "gitleaks").exists())


if __name__ == "__main__":
    unittest.main()
