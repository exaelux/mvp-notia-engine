import { IotaClient } from "@iota/iota-sdk/client";

export interface CargoManifestResult {
  valid: boolean;
  manifest_id: string;
  cargo_type: string;
  shipper: string;
  fda_prior_notice: string;
  reason?: string;
}

export async function verifyCargoManifestOnChain(
  objectId: string
): Promise<CargoManifestResult> {
  const rpcUrl = process.env.IOTA_RPC_URL ?? "https://api.testnet.iota.cafe";
  const client = new IotaClient({ url: rpcUrl });

  const obj = await client.getObject({
    id: objectId,
    options: { showContent: true },
  });

  if (!obj.data?.content || obj.data.content.dataType !== "moveObject") {
    return { valid: false, manifest_id: "", cargo_type: "", shipper: "", fda_prior_notice: "", reason: "object_not_found" };
  }

  const fields = (obj.data.content as { fields?: Record<string, unknown> }).fields ?? {};

  const active = fields["active"] as boolean;
  const temperature_ok = fields["temperature_ok"] as boolean;
  const seal_intact = fields["seal_intact"] as boolean;
  const xray_cleared = fields["xray_cleared"] as boolean;
  const hazmat = fields["hazmat"] as boolean;
  const manifest_id = fields["manifest_id"] as string;
  const cargo_type = fields["cargo_type"] as string;
  const shipper = fields["shipper"] as string;
  const fda_prior_notice = fields["fda_prior_notice"] as string;

  if (!active) return { valid: false, manifest_id, cargo_type, shipper, fda_prior_notice, reason: "manifest_revoked" };
  if (!temperature_ok) return { valid: false, manifest_id, cargo_type, shipper, fda_prior_notice, reason: "cold_chain_failed" };
  if (!seal_intact) return { valid: false, manifest_id, cargo_type, shipper, fda_prior_notice, reason: "seal_broken" };
  if (!xray_cleared) return { valid: false, manifest_id, cargo_type, shipper, fda_prior_notice, reason: "xray_failed" };
  if (hazmat) return { valid: false, manifest_id, cargo_type, shipper, fda_prior_notice, reason: "hazmat_detected" };

  return { valid: true, manifest_id, cargo_type, shipper, fda_prior_notice };
}
