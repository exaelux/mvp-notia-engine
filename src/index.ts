import type { CanonicalEvent } from "./core/types.js";

import { structuralCheck } from "./validator/structural-checker.js";
import { validateCoreBundle } from "./validator/core-validator.js";
import { routeEvent } from "./pipeline/router.js";

import { interpretAccess } from "./microtools/access.tool.js";
import { interpretIdentity } from "./microtools/identity.tool.js";
import { interpretSupply } from "./microtools/supply.tool.js";
import { interpretToken } from "./microtools/token.tool.js";

import { aggregate } from "./aggregator/aggregate.js";
import { createBundle } from "./bundler/bundler.js";

type RunOptions = {
  previous_bundle_ref?: string;
};

type StructuralFailResult = {
  type: "structural_fail";
  errors?: string[];
};

type SemanticBundleResult = {
  type: "semantic_bundle";
  bundle: ReturnType<typeof createBundle>;
};

type CoreSchemaFailResult = {
  type: "core_schema_fail";
  errors?: string[];
};

export function runNotia(
  event: CanonicalEvent,
  options?: RunOptions,
): StructuralFailResult | CoreSchemaFailResult | SemanticBundleResult {
  const structural = structuralCheck(event);

  if (structural.status === "fail") {
    if (structural.errors) {
      return {
        type: "structural_fail",
        errors: structural.errors,
      };
    }

    return {
      type: "structural_fail",
    };
  }

  const routes = routeEvent(event);
  const results: Array<{
    microtool: string;
    state: "valid" | "hold" | "reject";
    reason?: string;
  }> = [];

  for (const route of routes) {
    if (route === "access") {
      const r = interpretAccess(event);
      if (r) {
        results.push(r);
      }
    }

    if (route === "identity") {
      const r = interpretIdentity(event);
      if (r) {
        results.push(r);
      }
    }

    if (route === "supply") {
      const r = interpretSupply(event);
      if (r) {
        results.push(r);
      }
    }

    if (route === "token") {
      const r = interpretToken(event);
      if (r) {
        results.push(r);
      }
    }
  }

  const aggregated = aggregate(results);
  const bundle = createBundle(
    options?.previous_bundle_ref
      ? {
          event,
          aggregated,
          previous_bundle_ref: options.previous_bundle_ref,
        }
      : {
          event,
          aggregated,
        },
  );

  const coreValidation = validateCoreBundle(bundle);
  if (!coreValidation.valid) {
    if (coreValidation.errors) {
      return {
        type: "core_schema_fail",
        errors: coreValidation.errors,
      };
    }

    return {
      type: "core_schema_fail",
    };
  }

  return {
    type: "semantic_bundle",
    bundle,
  };
}
