import { spawnSync } from "node:child_process";
const result = spawnSync("node", ["dist/src/cli/index.js", "events/parking.json"], { encoding: "utf8" });
if (result.error) {
    console.error(`Failed to execute CLI: ${result.error.message}`);
    process.exit(1);
}
if (result.status !== 0) {
    console.error(`CLI exited with code ${result.status ?? "unknown"}`);
    if (result.stderr?.trim()) {
        console.error(result.stderr.trim());
    }
    process.exit(1);
}
const stdout = result.stdout ?? "";
const stderr = result.stderr ?? "";
if (stdout.includes("structural_fail") || stdout.includes("core_schema_fail") || stderr.includes("structural_fail") || stderr.includes("core_schema_fail")) {
    console.error("Validation failure detected (structural_fail/core_schema_fail present).");
    process.exit(1);
}
const lines = stdout
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
const pattern = /^\[(\d+)\]\s+(VALID|HOLD|REJECT)\s+\|\s+bundle_ref:\s+([a-f0-9]+)$/;
const semanticLines = lines.filter((line) => pattern.test(line));
if (semanticLines.length !== 5) {
    console.error(`Expected 5 semantic lines, got ${semanticLines.length}.`);
    process.exit(1);
}
const expectedStates = ["VALID", "VALID", "HOLD", "VALID", "VALID"];
for (let i = 0; i < semanticLines.length; i++) {
    const line = semanticLines[i];
    if (!line) {
        console.error(`Missing semantic output line at step ${i + 1}.`);
        process.exit(1);
    }
    const match = line.match(pattern);
    if (!match) {
        console.error(`Malformed semantic output line at step ${i + 1}: ${line}`);
        process.exit(1);
    }
    const index = Number(match[1]);
    const state = match[2];
    if (index !== i + 1) {
        console.error(`Unexpected index at step ${i + 1}: got ${index}`);
        process.exit(1);
    }
    if (state !== expectedStates[i]) {
        console.error(`Unexpected state at step ${i + 1}: expected ${expectedStates[i]}, got ${state}`);
        process.exit(1);
    }
}
console.log("CLI DEMO VALIDATION PASSED");
process.exit(0);
//# sourceMappingURL=validate-cli-demo.js.map