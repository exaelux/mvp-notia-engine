export function interpretAccess(event) {
    if (event.domain !== "access") {
        return null;
    }
    if (typeof event.type !== "string" || event.type.trim().length === 0) {
        return {
            microtool: "access",
            state: "reject",
            reason: "missing_event_type",
        };
    }
    const action = event.meaning?.action;
    if (action === "enter" || action === "exit") {
        return {
            microtool: "access",
            state: "valid",
        };
    }
    return {
        microtool: "access",
        state: "hold",
        reason: "unsupported_action",
    };
}
//# sourceMappingURL=access.tool.js.map