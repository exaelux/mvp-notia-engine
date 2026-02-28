import { createHash } from "node:crypto";
import { IotaClient } from "@iota/iota-sdk/client";
import { Ed25519Keypair } from "@iota/iota-sdk/keypairs/ed25519";
import {
  NotarizationClient,
  NotarizationClientReadOnly,
} from "@iota/notarization/node/index.js";
import type {
  ComplianceAnchorAdapter,
  ComplianceAnchorInput,
  AnchorResult,
} from "./types.js";

type TxSigner = Parameters<typeof NotarizationClient.create>[1];
type ReadOnlyIotaClient = Parameters<
  typeof NotarizationClientReadOnly.createWithPkgId
>[0];

class Ed25519SdkSigner {
  constructor(private readonly signer: Ed25519Keypair) {}

  async sign(tx_data_bcs: Uint8Array): Promise<string> {
    const signature = await this.signer.signTransaction(tx_data_bcs);
    return signature.signature;
  }

  async publicKey() {
    return this.signer.getPublicKey();
  }

  async iotaPublicKeyBytes(): Promise<Uint8Array> {
    return this.signer.getPublicKey().toIotaBytes();
  }

  keyId(): string {
    return this.signer.getPublicKey().toIotaAddress();
  }
}

export class IotaNotarizationAdapter implements ComplianceAnchorAdapter {
  private notarizationClient?: NotarizationClient;

  private async getClient(): Promise<NotarizationClient> {
    if (this.notarizationClient) {
      return this.notarizationClient;
    }

    const rpcUrl = process.env.IOTA_RPC_URL ?? "https://api.testnet.iota.cafe";
    const privateKey = process.env.IOTA_PRIVATE_KEY ?? "";
    const packageId = process.env.IOTA_NOTARIZATION_PKG_ID ?? "";

    if (!privateKey) {
      throw new Error("Missing IOTA_PRIVATE_KEY");
    }

    if (!packageId) {
      throw new Error("Missing IOTA_NOTARIZATION_PKG_ID");
    }

    const iotaClient = new IotaClient({ url: rpcUrl });
    const keypair = Ed25519Keypair.fromSecretKey(privateKey);

    const readOnlyClient = await NotarizationClientReadOnly.createWithPkgId(
      iotaClient as unknown as ReadOnlyIotaClient,
      packageId,
    );

    const signer = new Ed25519SdkSigner(keypair);
    this.notarizationClient = await NotarizationClient.create(
      readOnlyClient,
      signer as unknown as TxSigner,
    );

    return this.notarizationClient;
  }

  async submitProof(input: ComplianceAnchorInput): Promise<AnchorResult> {
    const anchored_at = new Date().toISOString();

    const content = JSON.stringify({
      subject_ref: input.subject_ref,
      profile_id: input.profile_id,
      result: input.result,
      bundle_hash: input.bundle_hash,
      timestamp: anchored_at,
    });

    const contentHash = createHash("sha256")
      .update(content)
      .digest("hex");

    const client = await this.getClient();

    const { response } = await client
      .createLocked()
      .withStringState(contentHash)
      .withImmutableDescription("NCR compliance proof")
      .finish()
      .buildAndExecute(client);

    return {
      network: "IOTA-TESTNET",
      transaction_id: response.digest,
      anchored_at,
      status: response.effects?.status?.status ?? "unknown",
    };
  }
}
