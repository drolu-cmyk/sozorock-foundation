import { timingSafeEqual } from "node:crypto";

export const maxRequestBytes = 65_536;
export const maxRequestsPerMinute = 30;

const forbiddenNormalizedKeys = new Set([
  "password",
  "passcode",
  "secret",
  "token",
  "apikey",
  "authorization",
  "cookie",
  "ssn",
  "socialsecuritynumber",
  "dateofbirth",
  "dob",
  "medicalrecord",
  "medicalrecordnumber",
  "diagnosis",
]);

const forbiddenValuePatterns = [
  /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/u,
  /\bAKIA[0-9A-Z]{16}\b/u,
  /\b(?:ghp_|github_pat_)[A-Za-z0-9_]{20,}\b/u,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/u,
  /\b\d{3}-\d{2}-\d{4}\b/u,
];

function constantTimeEqual(actual, expected) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(actualBuffer, expectedBuffer);
}

function normalizedKey(key) {
  return String(key).replace(/[_-]/gu, "").toLowerCase();
}

export function authorizedHeader(actualHeader, expectedToken) {
  if (typeof expectedToken !== "string" || expectedToken.length < 24) return false;
  const actual = typeof actualHeader === "string" ? actualHeader : "";
  return constantTimeEqual(actual, `Bearer ${expectedToken}`);
}

export function containsForbiddenMaterial(value) {
  if (typeof value === "string") return forbiddenValuePatterns.some((pattern) => pattern.test(value));
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(containsForbiddenMaterial);
  return Object.entries(value).some(
    ([key, child]) => forbiddenNormalizedKeys.has(normalizedKey(key)) || containsForbiddenMaterial(child)
  );
}

export function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
