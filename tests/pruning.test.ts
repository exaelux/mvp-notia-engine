import { runNotia } from "../src/index.js";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

const totalEvents = 20;
const maxDepth = 5;
const history: string[] = [];

let previousBundleRef: string | undefined;

for (let i = 0; i < totalEvents; i++) {
  const event = {
    event_id: `evt-prune-${i}`,
    domain: "access",
    type: "access_attempt",
    timestamp: `2026-02-14T10:${String(i).padStart(2, "0")}:00Z`,
    meaning: {
      action: "enter",
    },
  };

  const result = runNotia(event, {
    ...(previousBundleRef ? { previous_bundle_ref: previousBundleRef } : {}),
    ...(history.length > 0 ? { additional_ancestors: [...history] } : {}),
    max_depth: maxDepth,
  });

  if (result.type !== "semantic_bundle") {
    throw new Error(`Expected semantic_bundle at iteration ${i}`);
  }

  const derivedFrom = result.bundle.meaning.derived_from;
  assert(
    derivedFrom.length <= maxDepth,
    `derived_from exceeds max depth at iteration ${i}`,
  );

  if (previousBundleRef) {
    assert(
      derivedFrom.includes(previousBundleRef),
      `derived_from must include immediate previous ref at iteration ${i}`,
    );
  }

  history.unshift(result.bundle.meaning.bundle_ref);
  previousBundleRef = result.bundle.meaning.bundle_ref;
}

const comparisonEvent = {
  event_id: "evt-prune-depth-compare",
  domain: "access",
  type: "access_attempt",
  timestamp: "2026-02-14T11:00:00Z",
  meaning: {
    action: "enter",
  },
};

assert(!!previousBundleRef, "Expected previous bundle ref after chain generation");

const resultDepth5 = runNotia(comparisonEvent, {
  previous_bundle_ref: previousBundleRef as string,
  additional_ancestors: [...history],
  max_depth: 5,
});

const resultDepth3 = runNotia(comparisonEvent, {
  previous_bundle_ref: previousBundleRef as string,
  additional_ancestors: [...history],
  max_depth: 3,
});

if (resultDepth5.type !== "semantic_bundle" || resultDepth3.type !== "semantic_bundle") {
  throw new Error("Expected semantic_bundle for depth comparison");
}

assert(
  resultDepth5.bundle.meaning.bundle_ref !== resultDepth3.bundle.meaning.bundle_ref,
  "bundle_ref must change when pruning depth changes",
);

console.log("Pruning test passed.");
