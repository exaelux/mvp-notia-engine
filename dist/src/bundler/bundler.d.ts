type AggregatedInput = {
    aggregated_state: "valid" | "hold" | "reject";
    domains: Record<string, {
        state: string;
        reason?: string;
    }>;
};
type CreateBundleInput = {
    event: unknown;
    aggregated: AggregatedInput;
    previous_bundle_ref?: string;
};
type CoreMeaning = {
    bundle_ref: string;
    aggregated_state: string;
    domains: Record<string, {
        state: string;
        reason?: string;
    }>;
    derived_from: string[];
    event: unknown;
};
type SemanticBundle = {
    existence: true;
    meaning: CoreMeaning;
    visibility_abstract: string;
    timestamp: string;
};
export declare function createBundle(input: CreateBundleInput): SemanticBundle;
export {};
//# sourceMappingURL=bundler.d.ts.map