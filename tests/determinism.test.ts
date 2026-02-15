import { runNotia } from "../src/index.js";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

const baseEvent = {
  event_id: "evt-1",
  domain: "access",
  type: "access_attempt",
  timestamp: "2026-02-14T10:00:00Z",
  meaning: {
    action: "enter",
  },
};

// Run twice with identical input
const result1 = runNotia(baseEvent);
const result2 = runNotia(baseEvent);

if (result1.type !== "semantic_bundle" || result2.type !== "semantic_bundle") {
  throw new Error("Expected semantic_bundle result");
}

assert(
  result1.bundle.meaning.bundle_ref === result2.bundle.meaning.bundle_ref,
  "Determinism failed: identical inputs produced different bundle_ref",
);

// Modify event slightly
const modifiedEvent = {
  ...baseEvent,
  meaning: {
    action: "exit",
  },
};

const result3 = runNotia(modifiedEvent);

if (result3.type !== "semantic_bundle") {
  throw new Error("Expected semantic_bundle result");
}

assert(
  result1.bundle.meaning.bundle_ref !== result3.bundle.meaning.bundle_ref,
  "Hash sensitivity failed: modified input produced same bundle_ref",
);

console.log("Determinism test passed.");
