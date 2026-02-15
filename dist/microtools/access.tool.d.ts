import type { CanonicalEvent, SemanticState } from "../core/types.js";
type AccessResult = {
    microtool: "access";
    state: SemanticState;
    reason?: string;
};
export declare function interpretAccess(event: CanonicalEvent): AccessResult | null;
export {};
//# sourceMappingURL=access.tool.d.ts.map