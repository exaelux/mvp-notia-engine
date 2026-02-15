const ROUTING_TABLE = {
    access: ["access"],
    identity: ["identity"],
    supply: ["supply"],
    token: ["token"],
};
export function routeEvent(event) {
    const microtools = ROUTING_TABLE[event.domain];
    return microtools ? [...microtools] : [];
}
//# sourceMappingURL=router.js.map