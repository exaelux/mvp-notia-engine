export type StructuralStatus = "pass" | "fail";
export type SemanticState = "valid" | "hold" | "reject";
export interface CanonicalEvent {
    event_id: string;
    domain: string;
    type: string;
    timestamp: string;
    actor_ref?: string;
    resource_ref?: string;
    context?: Record<string, unknown>;
}
export interface StructuralCheckResult {
    status: StructuralStatus;
    errors?: string[];
}
export interface MicrotoolResult {
    domain: string;
    state: SemanticState;
    reason_code?: string;
    metadata?: Record<string, unknown>;
}
export interface AggregatedResult {
    states: MicrotoolResult[];
    aggregated_state: SemanticState;
}
export interface SemanticBundle {
    bundle_id: string;
    timestamp: string;
    deterministic: true;
    aggregated_state: SemanticState;
    states: MicrotoolResult[];
    anchors: string[];
}
//# sourceMappingURL=types.d.ts.map