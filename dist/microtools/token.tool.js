export function interpretToken(event) {
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
    const meaning = event.meaning;
    if (typeof meaning?.token_id !== "string" ||
        meaning.token_id.trim().length === 0) {
        return {
            microtool: "token",
            state: "reject",
            reason: "missing_token_id",
        };
    }
    if (typeof meaning.token_standard !== "string" ||
        meaning.token_standard.trim().length === 0) {
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
//# sourceMappingURL=token.tool.js.map