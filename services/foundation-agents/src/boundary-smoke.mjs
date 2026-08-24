import assert from "node:assert/strict";
import { authorizedHeader, containsForbiddenMaterial, isPlainObject, maxRequestBytes, maxRequestsPerMinute } from "./boundary.mjs";

const serviceToken = "abcdefghijklmnopqrstuvwxyz012345";
assert.equal(authorizedHeader(`Bearer ${serviceToken}`, serviceToken), true);
assert.equal(authorizedHeader(`Bearer ${serviceToken}x`, serviceToken), false);
assert.equal(authorizedHeader(undefined, serviceToken), false);
assert.equal(authorizedHeader("Bearer short", "short"), false);

assert.equal(containsForbiddenMaterial({ evidence: { note: "Approved source material only." } }), false);
assert.equal(containsForbiddenMaterial({ password: "example" }), true);
assert.equal(containsForbiddenMaterial({ nested: { apiKey: "redacted" } }), true);
assert.equal(containsForbiddenMaterial({ nested: { API_KEY: "redacted" } }), true);
assert.equal(containsForbiddenMaterial({ nested: { medical_record_number: "redacted" } }), true);
assert.equal(containsForbiddenMaterial({ note: "sk-proj-abcdefghijklmnopqrstuvwxyz0123456789" }), true);
assert.equal(containsForbiddenMaterial({ note: "AKIAABCDEFGHIJKLMNOP" }), true);
assert.equal(containsForbiddenMaterial({ note: "123-45-6789" }), true);
assert.equal(containsForbiddenMaterial({ note: "-----BEGIN PRIVATE KEY-----" }), true);

assert.equal(isPlainObject({}), true);
assert.equal(isPlainObject([]), false);
assert.equal(isPlainObject(null), false);
assert.equal(maxRequestBytes, 65_536);
assert.equal(maxRequestsPerMinute, 30);

console.log("Validated Foundation agent service boundary guards.");
