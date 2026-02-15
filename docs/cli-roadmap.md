# CLI Roadmap Notes

## Pending Feature

Add optional audit mode flag:

- `--continue-on-error`

### Goal

Allow processing the full event array even if one or more items return:

- `structural_fail`
- `core_schema_fail`

### What It Solves

- Prevents early-stop blind spots in long chains (you can see all failures in one run).
- Enables full audit reports for batch imports and incident review.
- Improves debugging by showing failure distribution by index/domain.
- Avoids repeated reruns just to discover the next failing event.

### Current Behavior

The CLI currently uses fail-fast semantics (production-safe default):

- stop at first failure
- set `process.exitCode` to the corresponding error code

### Future Implementation Direction

- keep current fail-fast behavior as default
- introduce optional `--continue-on-error` mode for audit workflows
- collect per-index outcomes and emit final summary at end
