import type { CanonicalEvent, SemanticState } from "../core/types.js";

type SupplyResult = {
  microtool: "supply";
  state: SemanticState;
  reason?: string;
  details?: {
    missing_logs: string[];
  };
};

type SupplyEventShape = CanonicalEvent & {
  meaning?: {
    object_ref?: unknown;
    logs?: unknown;
  };
};

const REQUIRED_LOGS: readonly string[] = [
  "cold_chain_temperature_log",
  "geo_tracking_log",
  "weight_verification_scan",
  "humidity_sensor_data",
  "seal_integrity_check",
  "xray_scan_result",
];

export function interpretSupply(event: CanonicalEvent): SupplyResult | null {
  if (event.domain !== "supply") {
    return null;
  }

  if (typeof event.type !== "string" || event.type.trim().length === 0) {
    return {
      microtool: "supply",
      state: "reject",
      reason: "missing_event_type",
    };
  }

  const meaning = (event as SupplyEventShape).meaning;

  if (
    typeof meaning?.object_ref !== "string" ||
    meaning.object_ref.trim().length === 0
  ) {
    return {
      microtool: "supply",
      state: "reject",
      reason: "missing_object_ref",
    };
  }

  if (Array.isArray(meaning.logs)) {
    const logs = new Set(
      meaning.logs.filter((entry): entry is string => typeof entry === "string"),
    );
    const hasAllRequiredLogs = REQUIRED_LOGS.every((logId) => logs.has(logId));

    if (hasAllRequiredLogs) {
      return {
        microtool: "supply",
        state: "valid",
      };
    }

    const missingLogs = REQUIRED_LOGS.filter((logId) => !logs.has(logId));
    return {
      microtool: "supply",
      state: "hold",
      reason: "missing_required_logs",
      details: {
        missing_logs: missingLogs,
      },
    };
  }

  return {
    microtool: "supply",
    state: "hold",
    reason: "incomplete_supply_event",
  };
}
