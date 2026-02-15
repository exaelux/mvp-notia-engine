import type { CanonicalEvent, SemanticState } from "../core/types.js";
type TokenResult = {
    microtool: "token";
    state: SemanticState;
    reason?: string;
};
export declare function interpretToken(event: CanonicalEvent): TokenResult | null;
export {};
//# sourceMappingURL=token.tool.d.ts.map