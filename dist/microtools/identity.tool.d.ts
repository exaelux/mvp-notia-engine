import type { CanonicalEvent, SemanticState } from "../core/types.js";
type IdentityResult = {
    microtool: "identity";
    state: SemanticState;
    reason?: string;
};
export declare function interpretIdentity(event: CanonicalEvent): IdentityResult | null;
export {};
//# sourceMappingURL=identity.tool.d.ts.map