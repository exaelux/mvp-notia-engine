import { createHash } from "node:crypto";

type AggregatedInput = {
  aggregated_state: "valid" | "hold" | "reject";
  domains: Record<string, { state: string; reason?: string }>;
};

type CreateBundleInput = {
  event: unknown;
  aggregated: AggregatedInput;
  previous_bundle_ref?: string;
};

type CoreMeaning = {
  bundle_ref: string;
  aggregated_state: string;
  domains: Record<string, { state: string; reason?: string }>;
  derived_from: string[];
  event: unknown;
};

type SemanticBundle = {
  existence: true;
  meaning: CoreMeaning;
  visibility_abstract: string;
  timestamp: string;
};

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sortKeysDeep(item));
  }

  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const sortedEntries = Object.keys(record)
      .sort()
      .map((key) => [key, sortKeysDeep(record[key])] as const);
    return Object.fromEntries(sortedEntries);
  }

  return value;
}

export function createBundle(input: CreateBundleInput): SemanticBundle {
  const timestamp = new Date().toISOString();
  const derived_from = input.previous_bundle_ref ? [input.previous_bundle_ref] : [];

  const meaningWithoutHash = {
    bundle_ref: "",
    aggregated_state: input.aggregated.aggregated_state,
    domains: input.aggregated.domains,
    derived_from,
    event: input.event,
  };

  const sortedMeaning = sortKeysDeep(meaningWithoutHash);
  const serialized = JSON.stringify(sortedMeaning);
  const bundle_ref = createHash("sha256").update(serialized).digest("hex");

  const meaning: CoreMeaning = {
    bundle_ref,
    aggregated_state: input.aggregated.aggregated_state,
    domains: input.aggregated.domains,
    derived_from,
    event: input.event,
  };

  return {
    existence: true,
    meaning,
    visibility_abstract: "restricted",
    timestamp,
  };
}
