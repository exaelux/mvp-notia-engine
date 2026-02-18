import type { CanonicalEvent, SemanticState } from "../core/types.js";

type TokenResult = {
  microtool: "token";
  state: SemanticState;
  reason?: string;
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

  const token_id = event.attributes?.token_id;
  const token_standard = event.attributes?.token_standard;
  const expired = event.attributes?.expired;

  if (typeof token_id !== "string" || token_id.trim().length === 0) {
    return {
      microtool: "token",
      state: "reject",
      reason: "missing_token_id",
    };
  }

  if (typeof token_standard !== "string" || token_standard.trim().length === 0) {
    return {
      microtool: "token",
      state: "hold",
      reason: "missing_token_standard",
    };
  }

  if (expired === true) {
    return {
      microtool: "token",
      state: "reject",
      reason: "token_expired",
    };
  }

  return { microtool: "token", state: "valid" };
}