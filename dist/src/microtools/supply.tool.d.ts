import type { CanonicalEvent, SemanticState } from "../core/types.js";
type SupplyResult = {
    microtool: "supply";
    state: SemanticState;
    reason?: string;
    details?: {
        missing_logs: string[];
    };
};
export declare function interpretSupply(event: CanonicalEvent): SupplyResult | null;
export {};
//# sourceMappingURL=supply.tool.d.ts.map