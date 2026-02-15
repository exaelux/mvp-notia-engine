import type { CanonicalEvent } from "./core/types.js";
import { createBundle } from "./bundler/bundler.js";
type RunOptions = {
    previous_bundle_ref?: string;
};
type StructuralFailResult = {
    type: "structural_fail";
    errors?: string[];
};
type SemanticBundleResult = {
    type: "semantic_bundle";
    bundle: ReturnType<typeof createBundle>;
};
type CoreSchemaFailResult = {
    type: "core_schema_fail";
    errors?: string[];
};
export declare function runNotia(event: CanonicalEvent, options?: RunOptions): StructuralFailResult | CoreSchemaFailResult | SemanticBundleResult;
export {};
//# sourceMappingURL=index.d.ts.map