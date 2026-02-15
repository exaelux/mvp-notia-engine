import { runNotia } from "../src/index.js";
function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
const REQUIRED_LOGS = [
    "cold_chain_temperature_log",
    "geo_tracking_log",
    "weight_verification_scan",
    "humidity_sensor_data",
    "seal_integrity_check",
    "xray_scan_result",
];
const baseTemplate = {
    event_id: "",
    domain: "supply",
    type: "import_scan",
    timestamp: "2026-02-14T10:00:00Z",
    meaning: {
        object_ref: "container:TCNU9876543",
        logs: [],
    },
};
const totalEvents = 15;
const bundleRefs = [];
let previous;
for (let i = 0; i < totalEvents; i++) {
    const event = {
        ...baseTemplate,
        event_id: `evt-yoko-${i}`,
        meaning: {
            object_ref: "container:TCNU9876543",
            logs: i === totalEvents - 1 ? [...REQUIRED_LOGS] : [],
        },
    };
    const result = previous
        ? runNotia(event, { previous_bundle_ref: previous })
        : runNotia(event);
    if (result.type !== "semantic_bundle") {
        throw new Error(`Expected semantic_bundle on iteration ${i}`);
    }
    const { bundle } = result;
    if (previous) {
        assert(bundle.meaning.derived_from.includes(previous), `Derived_from must include previous ref at iteration ${i}`);
    }
    bundleRefs.push(bundle.meaning.bundle_ref);
    previous = bundle.meaning.bundle_ref;
}
assert(bundleRefs.length === totalEvents, "Expected 15 bundles in original chain");
// Check that all refs are unique
const uniqueRefs = new Set(bundleRefs);
assert(uniqueRefs.size === totalEvents, "Each bundle_ref must be unique");
const originalRefs = [...bundleRefs];
// Mutation test
bundleRefs.length = 0;
previous = undefined;
for (let i = 0; i < totalEvents; i++) {
    const event = {
        ...baseTemplate,
        event_id: `evt-yoko-mut-${i}`,
        meaning: {
            object_ref: "container:TCNU9876543",
            logs: i === 7 ? [...REQUIRED_LOGS] : [],
        },
    };
    const result = previous
        ? runNotia(event, { previous_bundle_ref: previous })
        : runNotia(event);
    if (result.type !== "semantic_bundle") {
        throw new Error(`Mutation scenario: expected semantic_bundle at ${i}`);
    }
    if (previous) {
        assert(result.bundle.meaning.derived_from.includes(previous), `Mutation scenario: derived_from must include previous ref at ${i}`);
    }
    bundleRefs.push(result.bundle.meaning.bundle_ref);
    previous = result.bundle.meaning.bundle_ref;
}
assert(bundleRefs.length === totalEvents, "Expected 15 bundles in mutated chain");
// The mutated chain must diverge from the original chain at the same index
assert(originalRefs[7] !== bundleRefs[7], "Mutation should change bundle_ref at iteration 7");
let divergedFromMutationPoint = false;
for (let i = 7; i < totalEvents; i++) {
    if (originalRefs[i] !== bundleRefs[i]) {
        divergedFromMutationPoint = true;
        break;
    }
}
assert(divergedFromMutationPoint, "Mutation should affect chain continuity from iteration 7 onward");
console.log("Yokohama chain test passed.");
//# sourceMappingURL=yokohama-chain.test.js.map