import { createHash } from "node:crypto";
function sortKeysDeep(value) {
    if (Array.isArray(value)) {
        return value.map((item) => sortKeysDeep(item));
    }
    if (value !== null && typeof value === "object") {
        const record = value;
        const sortedEntries = Object.keys(record)
            .sort()
            .map((key) => [key, sortKeysDeep(record[key])]);
        return Object.fromEntries(sortedEntries);
    }
    return value;
}
export function createBundle(input) {
    const timestamp = new Date().toISOString();
    const derived_from = input.previous_bundle_ref ? [input.previous_bundle_ref] : [];
    const meaningWithoutHash = {
        bundle_ref: "",
        aggregated_state: input.aggregated.aggregated_state,
        domains: input.aggregated.domains,
        derived_from,
        event: input.event,
    };
    const sortedMeaning = sortKeysDeep(meaningWithoutHash);
    const serialized = JSON.stringify(sortedMeaning);
    const bundle_ref = createHash("sha256").update(serialized).digest("hex");
    const meaning = {
        bundle_ref,
        aggregated_state: input.aggregated.aggregated_state,
        domains: input.aggregated.domains,
        derived_from,
        event: input.event,
    };
    return {
        existence: true,
        meaning,
        visibility_abstract: "restricted",
        timestamp,
    };
}
//# sourceMappingURL=bundler.js.map