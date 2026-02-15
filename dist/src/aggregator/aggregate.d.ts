type MicrotoolState = "valid" | "hold" | "reject";
type MicrotoolAggregateInput = {
    microtool: string;
    state: MicrotoolState;
    reason?: string;
};
type AggregatedOutput = {
    aggregated_state: MicrotoolState;
    domains: Record<string, {
        state: MicrotoolState;
        reason?: string;
    }>;
};
export declare function aggregate(results: MicrotoolAggregateInput[]): AggregatedOutput;
export {};
//# sourceMappingURL=aggregate.d.ts.map