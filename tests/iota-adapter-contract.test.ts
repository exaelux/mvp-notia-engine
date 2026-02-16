import { MockIotaAnchorAdapter } from "../src/iota/anchor.js";
import type { AnchorAdapter, AnchorStatus } from "../src/iota/types.js";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function isIsoDateString(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

async function main(): Promise<void> {
  const adapter: AnchorAdapter = new MockIotaAnchorAdapter();

  const bundle = {
    existence: true,
    meaning: {
      bundle_ref: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      aggregated_state: "valid",
      domains: {
        access: { state: "valid" },
      },
      derived_from: [],
      event: {
        event_id: "evt-contract-1",
        domain: "access",
        type: "access_attempt",
        timestamp: "2026-02-16T00:00:00Z",
        meaning: { action: "enter" },
      },
    },
    visibility_abstract: "restricted",
    timestamp: "2026-02-16T00:00:00Z",
  };

  const originalBundleJson = JSON.stringify(bundle);
  const result = await adapter.anchor(bundle);

  assert(JSON.stringify(bundle) === originalBundleJson, "Adapter must not mutate input bundle");
  assert(result.network === "IOTA-MOCK", "Mock adapter must report IOTA-MOCK network");
  assert(/^iota:tx:[a-f0-9]{64}$/.test(result.transaction_id), "transaction_id format is invalid");
  assert(isIsoDateString(result.anchored_at), "anchored_at must be a valid ISO date string");

  const validStatuses: AnchorStatus[] = ["confirmed", "pending", "failed"];
  assert(validStatuses.includes(result.status), "status must match AnchorStatus contract");
  assert(result.status === "confirmed", "Mock adapter should return confirmed status");

  const missingRefResult = await adapter.anchor({});
  assert(
    /^iota:tx:[a-f0-9]{64}$/.test(missingRefResult.transaction_id),
    "Adapter must still return a transaction_id when bundle_ref is missing",
  );

  console.log("IOTA adapter contract test passed.");
}

void main();
