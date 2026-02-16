import { createHash } from "node:crypto";
import type { AnchorAdapter, AnchorResult } from "./types.js";

function extractBundleRef(bundle: unknown): string {
  if (bundle === null || typeof bundle !== "object") {
    return "";
  }

  const meaning = (bundle as { meaning?: unknown }).meaning;
  if (meaning === null || typeof meaning !== "object") {
    return "";
  }

  const bundleRef = (meaning as { bundle_ref?: unknown }).bundle_ref;
  return typeof bundleRef === "string" ? bundleRef : "";
}

export class MockIotaAnchorAdapter implements AnchorAdapter {
  async anchor(bundle: unknown): Promise<AnchorResult> {
    const anchored_at = new Date().toISOString();
    const bundleRef = extractBundleRef(bundle);

    const hash = createHash("sha256")
      .update(`${bundleRef}${anchored_at}`)
      .digest("hex");

    return {
      network: "IOTA-MOCK",
      transaction_id: `iota:tx:${hash}`,
      anchored_at,
      status: "confirmed",
    };
  }
}
