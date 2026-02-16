# NOTIA Engine

## What is NOTIA?

NOTIA is a deterministic semantic interpretation layer.  
It converts heterogeneous events into canonical semantic bundles.  
It does not execute actions.  
It does not enforce policy.  
It produces portable, verifiable semantic state.  
It is execution-neutral and designed for cross-system interoperability.

## Problem

Organizations exchange data across heterogeneous systems, but not consistent meaning.  
The same evidence is interpreted differently across platforms, creating fragmented trust and duplicated logic.  
This slows integrations, increases operational friction, and weakens auditability.

## How It Works (High Level)

Canonical Event -> Structural Validation -> Domain Routing -> Microtool Interpretation -> Deterministic Aggregation -> Core Pure Bundle -> Core Validation -> Optional External Anchor

## Quick Start

```bash
npm install
npm run build
npm run notia events/parking.json
```

## Documentation

Full architecture and technical responsibilities:

- `docs/architecture.md`

Project notes:

- `docs/cli-roadmap.md`
