export function aggregate(results) {
    const domains = {};
    let hasHold = false;
    let hasReject = false;
    for (const result of results) {
        domains[result.microtool] = {
            state: result.state,
            ...(result.reason !== undefined ? { reason: result.reason } : {}),
        };
        if (result.state === "reject") {
            hasReject = true;
        }
        else if (result.state === "hold") {
            hasHold = true;
        }
    }
    const aggregated_state = hasReject
        ? "reject"
        : hasHold
            ? "hold"
            : "valid";
    return {
        aggregated_state,
        domains,
    };
}
//# sourceMappingURL=aggregate.js.map