import { createHash } from "node:crypto";
function extractBundleRef(bundle) {
    if (bundle === null || typeof bundle !== "object") {
        return "";
    }
    const meaning = bundle.meaning;
    if (meaning === null || typeof meaning !== "object") {
        return "";
    }
    const bundleRef = meaning.bundle_ref;
    return typeof bundleRef === "string" ? bundleRef : "";
}
export function anchorBundle(bundle) {
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
//# sourceMappingURL=anchor.js.map