# NOTIA Engine

Deterministic Semantic Interpretation Layer  
MVP v0.x

## Overview

NOTIA Engine is a deterministic semantic interpretation layer built on top of the Noema Core Pure standard.

It validates canonical events, interprets them through isolated domain microtools, aggregates semantic state deterministically, produces Core-compliant semantic bundles, and optionally anchors them (mock IOTA layer).

NOTIA does not execute actions.  
NOTIA does not authorize operations.  
NOTIA interprets and describes state.

## Core Principles

- Data != Meaning
- Interpretation != Decision
- Evidence != Execution
- NOTIA does not execute or authorize actions.
- Determinism is mandatory: identical inputs produce identical semantic bundles.

## High-Level Architecture

```txt
Input Event (JSON)
        ↓
Structural Validation (Canonical Schema)
        ↓
Domain Routing
        ↓
Microtool Interpretation
        ↓
Aggregation (Deterministic Union)
        ↓
Bundle Creation (Core Pure Object)
        ↓
Core Validation (Noema Core Pure Schema)
        ↓
Optional Anchor (IOTA Mock)
```

Each layer is isolated and independently testable.

## Project Structure

```txt
/src
  /core
  /pipeline
  /microtools
  /aggregator
  /bundler
  /validator
  /iota
  /cli
/tests
/schemas
/events
```

All modules are decoupled.  
No circular dependencies.  
No shared mutable state.

## Canonical Event (Input Layer)

Validated against:

`schemas/notia-canonical-event.schema.json`

Required fields:

- `event_id`
- `domain`
- `type`
- `timestamp`
- optional `meaning`

Structural validation failures stop execution.

## Microtools

Each microtool:

- Is a pure function
- Accepts a `CanonicalEvent`
- Returns: `valid`, `hold`, or `reject`
- May include a reason
- Returns `null` if domain mismatch

Current domains:

- `access`
- `identity`
- `supply`
- `token`

No cross-microtool communication.

## Aggregation Rule

Deterministic union:

`reject > hold > valid`

If any microtool rejects -> `aggregated_state = reject`  
Else if any hold -> `aggregated_state = hold`  
Else -> `valid`

Order-independent and deterministic.

## Semantic Bundle (Core Pure Object)

The bundler produces:

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

`bundle_ref` is computed as:

`sha256(sorted(meaning_without_hash))`

Determinism guarantee:

Identical input -> identical `bundle_ref`.

Chain support:

`derived_from: [previous_bundle_ref]`

Currently linear chain (multi-ancestry compatible).

## Core Validation

After bundling, the engine validates:

- `existence`
- `meaning`
- `visibility_abstract`

Against:

`noema-core-pure.schema.json`

If validation fails:

`core_schema_fail`

## CLI Usage

Build:

```bash
npm run build
```

Run:

```bash
npm run notia ./events/example.json
```

Options:

- `--verbose`
- `--previous-bundle-ref=REF`
- `--anchor`
- `--help`

Supports:

- Single event JSON
- Array of events (chained)
- stdin input (use `"-"` as filePath)

Exit codes:

- `0` -> success
- `1` -> `structural_fail`
- `2` -> `core_schema_fail`

## Anchor (Mock Layer)

Optional:

`--anchor`

Produces:

```json
{
  "network": "IOTA-MOCK",
  "transaction_id": "...",
  "anchored_at": "...",
  "status": "confirmed"
}
```

Does not mutate the bundle.  
Fully replaceable with real IOTA integration.

## Implemented Scenarios

### Parking Scenario

- Access -> Token -> Identity (`pending` -> `verified`)
- HOLD propagation validated
- Deterministic chaining verified

### Yokohama Import (15-event stress test)

- 14 HOLD states
- Final VALID
- Chain continuity preserved
- Hash sensitivity confirmed
- Mutation propagation tested

## Deterministic Guarantees

- Structural gating
- Canon compliance
- Hash sensitivity
- Chain integrity
- Aggregation precedence
- Deterministic routing

## What NOTIA Is Not

NOTIA is not:

- A policy engine
- An access control system
- A transaction executor
- A smart contract replacement

It is a semantic interpretation layer.

## Current MVP Status

- Deterministic
- Canon-aligned
- Modular
- Testable
- CLI-ready
- Demo-ready
- Hackathon-ready

## Future Extensions

- Real IOTA anchoring integration
- Profile-based semantic extensions
- Multi-ancestry chaining
- Pruning policy
- Real-world integration adapters
