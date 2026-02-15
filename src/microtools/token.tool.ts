import type { CanonicalEvent, SemanticState } from "../core/types.js";

type TokenResult = {
  microtool: "token";
  state: SemanticState;
  reason?: string;
};

type TokenEventShape = CanonicalEvent & {
  meaning?: {
    token_id?: unknown;
    token_standard?: unknown;
    expired?: unknown;
  };
};

export function interpretToken(event: CanonicalEvent): TokenResult | null {
  if (event.domain !== "token") {
    return null;
  }

  if (typeof event.type !== "string" || event.type.trim().length === 0) {
    return {
      microtool: "token",
      state: "reject",
      reason: "missing_event_type",
    };
  }

  const meaning = (event as TokenEventShape).meaning;

  if (
    typeof meaning?.token_id !== "string" ||
    meaning.token_id.trim().length === 0
  ) {
    return {
      microtool: "token",
      state: "reject",
      reason: "missing_token_id",
    };
  }

  if (
    typeof meaning.token_standard !== "string" ||
    meaning.token_standard.trim().length === 0
  ) {
    return {
      microtool: "token",
      state: "hold",
      reason: "missing_token_standard",
    };
  }

  if (meaning.expired === true) {
    return {
      microtool: "token",
      state: "reject",
      reason: "token_expired",
    };
  }

  return {
    microtool: "token",
    state: "valid",
  };
}
