export function interpretIdentity(event) {
    if (event.domain !== "identity") {
        return null;
    }
    if (typeof event.type !== "string" || event.type.trim().length === 0) {
        return {
            microtool: "identity",
            state: "reject",
            reason: "missing_event_type",
        };
    }
    const meaning = event.meaning;
    if (typeof meaning?.subject_ref !== "string" ||
        meaning.subject_ref.trim().length === 0) {
        return {
            microtool: "identity",
            state: "reject",
            reason: "missing_subject_ref",
        };
    }
    if (meaning.identity_status === "verified") {
        return {
            microtool: "identity",
            state: "valid",
        };
    }
    if (meaning.identity_status === "pending") {
        return {
            microtool: "identity",
            state: "hold",
        };
    }
    if (meaning.identity_status === "revoked") {
        return {
            microtool: "identity",
            state: "reject",
        };
    }
    return {
        microtool: "identity",
        state: "hold",
        reason: "unknown_identity_status",
    };
}
//# sourceMappingURL=identity.tool.js.map