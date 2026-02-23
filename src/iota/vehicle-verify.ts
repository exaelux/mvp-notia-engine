import { IotaClient } from "@iota/iota-sdk/client";

export interface VehicleCertResult {
  valid: boolean;
  plate: string;
  owner_did: string;
  vehicle_class: string;
  active: boolean;
  reason?: string;
}

export async function verifyVehicleCertOnChain(
  objectId: string
): Promise<VehicleCertResult> {
  const rpcUrl = process.env.IOTA_RPC_URL ?? "https://api.testnet.iota.cafe";
  const client = new IotaClient({ url: rpcUrl });

  const obj = await client.getObject({
    id: objectId,
    options: { showContent: true },
  });

  if (!obj.data?.content || obj.data.content.dataType !== "moveObject") {
    return { valid: false, plate: "", owner_did: "", vehicle_class: "", active: false, reason: "object_not_found" };
  }

  const fields = (obj.data.content as { fields?: Record<string, unknown> }).fields ?? {};

  const active = fields["active"] as boolean;
  const plate = fields["plate"] as string;
  const owner_did = fields["owner_did"] as string;
  const vehicle_class = fields["vehicle_class"] as string;

  if (!active) {
    return { valid: false, plate, owner_did, vehicle_class, active, reason: "certificate_revoked" };
  }

  return { valid: true, plate, owner_did, vehicle_class, active };
}
