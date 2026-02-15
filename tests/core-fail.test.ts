import { runNotia } from "../src/index.js";
import { validateCoreBundle } from "../src/validator/core-validator.js";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

// Evento válido estructuralmente y enrutable
const event = {
  event_id: "evt-core-1",
  domain: "access",
  type: "access_attempt",
  timestamp: "2026-02-14T10:00:00Z",
  meaning: {
    action: "enter",
  },
};

const result = runNotia(event);

if (result.type !== "semantic_bundle") {
  throw new Error("Expected semantic_bundle result");
}

// Corrupción controlada del core payload para forzar FAIL del validador Core
const invalidCoreBundle = {
  ...result.bundle,
  existence: "true",
};

const coreValidation = validateCoreBundle(invalidCoreBundle);

assert(
  coreValidation.valid === false && !!coreValidation.errors?.length,
  "Expected core schema validation to fail with errors",
);

console.log("Core fail test passed.");
