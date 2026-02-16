export type AnchorStatus = "confirmed" | "pending" | "failed";

export type AnchorResult = {
  network: string;
  transaction_id: string;
  anchored_at: string;
  status: AnchorStatus;
};

export interface AnchorAdapter {
  anchor(bundle: unknown): Promise<AnchorResult>;
}

// Future: TestnetIotaAnchorAdapter implementing AnchorAdapter
