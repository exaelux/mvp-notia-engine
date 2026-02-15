import { runNotia } from "../src/index.js";
function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
const event1 = {
    event_id: "evt-park-1",
    domain: "access",
    type: "access_attempt",
    timestamp: "2026-02-14T10:00:00Z",
    meaning: {
        action: "enter",
    },
};
const result1 = runNotia(event1);
if (result1.type !== "semantic_bundle") {
    throw new Error("Step 1 expected semantic_bundle");
}
assert(result1.bundle.meaning.aggregated_state === "valid", "Step 1 aggregated_state must be valid");
const event2 = {
    event_id: "evt-park-2",
    domain: "token",
    type: "token_use",
    timestamp: "2026-02-14T10:05:00Z",
    meaning: {
        token_id: "token-123",
        token_standard: "IOTA-TOKEN",
    },
};
const result2 = runNotia(event2, {
    previous_bundle_ref: result1.bundle.meaning.bundle_ref,
});
if (result2.type !== "semantic_bundle") {
    throw new Error("Step 2 expected semantic_bundle");
}
assert(result2.bundle.meaning.aggregated_state === "valid", "Step 2 aggregated_state must be valid");
assert(result2.bundle.meaning.derived_from.includes(result1.bundle.meaning.bundle_ref), "Step 2 derived_from must include previous bundle_ref");
const event3 = {
    event_id: "evt-park-3",
    domain: "identity",
    type: "identity_check",
    timestamp: "2026-02-14T10:10:00Z",
    meaning: {
        subject_ref: "did:iota:user:123",
        identity_status: "pending",
    },
};
const result3 = runNotia(event3, {
    previous_bundle_ref: result2.bundle.meaning.bundle_ref,
});
if (result3.type !== "semantic_bundle") {
    throw new Error("Step 3 expected semantic_bundle");
}
assert(result3.bundle.meaning.aggregated_state === "hold", "Step 3 aggregated_state must be hold");
assert(result3.bundle.meaning.derived_from.includes(result2.bundle.meaning.bundle_ref), "Step 3 derived_from must include previous bundle_ref");
const event4 = {
    event_id: "evt-park-4",
    domain: "identity",
    type: "identity_check",
    timestamp: "2026-02-14T10:15:00Z",
    meaning: {
        subject_ref: "did:iota:user:123",
        identity_status: "verified",
    },
};
const result4 = runNotia(event4, {
    previous_bundle_ref: result3.bundle.meaning.bundle_ref,
});
if (result4.type !== "semantic_bundle") {
    throw new Error("Step 4 expected semantic_bundle");
}
assert(result4.bundle.meaning.aggregated_state === "valid", "Step 4 aggregated_state must be valid");
assert(result4.bundle.meaning.derived_from.includes(result3.bundle.meaning.bundle_ref), "Step 4 derived_from must include previous bundle_ref");
const refs = [
    result1.bundle.meaning.bundle_ref,
    result2.bundle.meaning.bundle_ref,
    result3.bundle.meaning.bundle_ref,
    result4.bundle.meaning.bundle_ref,
];
assert(new Set(refs).size === refs.length, "All bundle_ref values must be unique");
console.log("Parking scenario chain test passed.");
//# sourceMappingURL=parking-chain.test.js.map