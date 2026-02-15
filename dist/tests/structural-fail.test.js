import { runNotia } from "../src/index.js";
function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
// Evento inválido (sin event_id)
const invalidEvent = {
    domain: "access",
    type: "access_attempt",
    timestamp: "2026-02-14T10:00:00Z",
    meaning: {
        action: "enter",
    },
};
const result = runNotia(invalidEvent);
assert(result.type === "structural_fail", "Expected structural_fail for malformed event");
console.log("Structural fail test passed.");
//# sourceMappingURL=structural-fail.test.js.map