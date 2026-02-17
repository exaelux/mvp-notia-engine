import dotenv from "dotenv";
dotenv.config();

import { TestnetIotaAnchorAdapter } from "../src/iota/TestnetIotaAnchorAdapter.js";

async function main() {
  const adapter = new TestnetIotaAnchorAdapter();

  const fakeBundle = {
    meaning: {
      bundle_ref: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      domain: "test",
    },
  };

  const result = await adapter.anchor(fakeBundle);

  console.log("ANCHOR RESULT:", result);
}

main().catch((err) => {
  console.error("ERROR:", err);
});
