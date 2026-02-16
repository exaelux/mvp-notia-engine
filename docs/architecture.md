# NOTIA Engine Architecture

## Philosophy

- `Data ≠ Meaning`
- `Interpretation ≠ Decision`
- `Evidence ≠ Execution`

NOTIA is execution-neutral: it does not enforce policy, open gates, transfer value, or authorize actors. It interprets canonical events into deterministic semantic outputs.

## End-to-End Pipeline

```txt
Input Event(s) JSON
        ↓
Structural Validation (canonical schema)
        ↓
Deterministic Routing (domain-based)
        ↓
Isolated Microtool Interpretation
        ↓
Deterministic Aggregation
        ↓
Bundle Creation (Core Pure object)
        ↓
Core Pure Validation
        ↓
CLI Output (optional mock anchor)
```

Each layer is independently testable and decoupled.

## Structural vs Semantic Separation

Structural layer validates canonical event shape against:

- `schemas/notia-canonical-event.schema.json`

Semantic layer interprets event meaning via domain microtools.

Core Pure compliance is validated after bundling, not at canonical event ingress. This keeps the pipeline event-centric and the bundle artifact standard-centric.

## Microtools (Isolated Domain Modules)

Implemented modules:

- `access`
- `identity`
- `supply`
- `token`

Properties:

- pure function behavior
- no cross-microtool imports
- no aggregator awareness
- no IOTA awareness
- deterministic outputs (`valid | hold | reject`)

## Aggregator

Deterministic precedence:

`reject > hold > valid`

If any microtool rejects, aggregated state is `reject`; else if any hold, `hold`; otherwise `valid`.

## Bundler (Core Pure Compliance)

Output shape:

```json
{
  "existence": true,
  "meaning": {
    "bundle_ref": "...",
    "aggregated_state": "...",
    "domains": {},
    "derived_from": [],
    "event": {}
  },
  "visibility_abstract": "restricted",
  "timestamp": "..."
}
```

Deterministic hash:

- `bundle_ref = sha256(JSON.stringify(sorted(meaning_without_hash)))`
- `timestamp` is metadata and excluded from hash material.

## Pruning Policy (Deterministic)

Implemented in bundler input:

- `previous_bundle_ref?: string`
- `additional_ancestors?: string[]`
- `max_depth?: number` (default 10)

Policy:

1. Start ancestry with immediate `previous_bundle_ref` (if present).
2. Append `additional_ancestors` in received order.
3. Dedupe preserving first occurrence order.
4. Prune with deterministic slice to max depth.
5. Never drop immediate previous reference when present.

`derived_from` remains `string[]` and order is deterministic (most recent first).

## IOTA Adapter (Decoupled)

Mock anchoring is implemented as an optional adapter:

- `src/iota/anchor.ts`

Used only at CLI layer via `--anchor`, never inside engine orchestration.

It returns separate metadata:

- network (`IOTA-MOCK`)
- transaction id
- anchored timestamp
- status (`confirmed`)

Bundle object is never mutated by anchoring.

## Determinism Boundaries

Deterministic:

- routing by domain
- microtool interpretation
- aggregation precedence
- bundle hash material
- pruning order and depth

Non-deterministic metadata:

- `timestamp` (bundle metadata)
- mock anchor `anchored_at` / derived tx generation from runtime timestamp

## CLI Responsibilities

CLI orchestrates execution only:

- single event file
- batch array file with chaining
- stdin mode (`-`)
- `--verbose`
- `--previous-bundle-ref`
- `--anchor`

Exit codes:

- `0`: success
- `1`: structural failure
- `2`: core schema failure

## Test Coverage (Implemented)

- Determinism: `tests/determinism.test.ts`
- Structural fail gating: `tests/structural-fail.test.ts`
- Core fail control: `tests/core-fail.test.ts`
- Parking chain scenario: `tests/parking-chain.test.ts`
- Yokohama 15-event chain: `tests/yokohama-chain.test.ts`
- Pruning behavior: `tests/pruning.test.ts`
- CLI demo validation: `scripts/validate-cli-demo.ts`
