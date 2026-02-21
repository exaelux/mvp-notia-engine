# IOTA Identity Backend (Axum)

Rust microservice for IOTA Identity operations on testnet, built with Axum and running on port `3002`.

## What It Does

Implements 4 endpoints for a driver identity flow:

- `POST /driver/create-did`
- `POST /driver/issue-vc`
- `POST /driver/create-vp`
- `POST /driver/verify`

The service persists identity artifacts in the current working directory and reuses them if they already exist.

## High-Level Architecture

This service is the `identity` microtool inside the NOTIA deterministic pipeline.

```text
External Systems (Identity / Access / Token / Supply / IoT / Backend events)
                              |
                              v
                   Canonical Event Input (JSON)
                              |
                              v
         Structural Validator (NOTIA canonical event schema)
                              |
                              v
                    Deterministic Domain Router
                              |
                              v
        Isolated Microtools (access / identity / token / supply)
                              |
                              v
         Deterministic Aggregator (reject > hold > valid)
                              |
                              v
      Bundler -> Core Pure Semantic Object (Noema-compliant output)
                              |
                              v
           Core Validator (noema-core-pure.schema.json)
                              |
                              v
                   CLI / API Output (portable semantic bundle)
                              |
                              +----------------------+
                              |                      |
                              v                      v
                 Optional IOTA Mock Anchor      Downstream Systems
                 (replaceable with real         (parking, mobility,
                 IOTA notarization)             restricted access, etc.)
```

### Responsibility of This Repository Component

- Provides identity issuance and verification primitives (`DID`, `VC`, `VP`) over HTTP.
- Integrates with IOTA Identity testnet and Stronghold key storage.
- Exposes deterministic outputs consumed by the aggregator/bundler stages.

## Requirements

- Rust toolchain (`cargo`)
- Network access to IOTA testnet RPC
- Environment variables:
  - `IOTA_API_ENDPOINT`
  - `IOTA_IDENTITY_PKG_ID`
  - `STRONGHOLD_PASSWORD`

Example:

```bash
export IOTA_API_ENDPOINT="https://api.testnet.iota.cafe"
export IOTA_IDENTITY_PKG_ID="0x222741bbdff74b42df48a7b4733185e9b24becb8ccfbafe8eac864ab4e4cc555"
export STRONGHOLD_PASSWORD="change-me"
```

## Run

```bash
cargo run
```

Server listens on:

```text
http://127.0.0.1:3002
```

## Endpoint Flow

All endpoints are `POST` and do not require request bodies.

1. Create or load driver DID

```bash
curl -s -X POST http://127.0.0.1:3002/driver/create-did
```

Response:

```json
{ "did": "did:iota:testnet:0x..." }
```

2. Issue VC (issuer DID is created on first call if missing)

```bash
curl -s -X POST http://127.0.0.1:3002/driver/issue-vc
```

Response:

```json
{ "vc": "<jwt>" }
```

Credential subject:

```json
{
  "name": "Joe Bloggs",
  "licenseNumber": "UK-TRK-2024-001",
  "vehicleClass": "HGV",
  "country": "GB"
}
```

3. Create VP signed by driver DID

```bash
curl -s -X POST http://127.0.0.1:3002/driver/create-vp
```

Response:

```json
{ "vp": "<jwt>" }
```

4. Verify VP on IOTA network

```bash
curl -s -X POST http://127.0.0.1:3002/driver/verify
```

Response:

```json
{ "valid": true, "holder": "did:iota:testnet:0x...", "credential_count": 1 }
```

## Generated Files

The service reads/writes these files in the current directory:

- `driver.stronghold`
- `issuer.stronghold`
- `driver_did.json`
- `driver_fragment.txt`
- `issuer_did.json`
- `issuer_fragment.txt`
- `driver_vc.jwt`
- `driver_vp.jwt`

## Notes

- Existing `.stronghold` and DID files are reused, not recreated.
- Testnet funds are requested only when creating a new DID.
- Errors return HTTP `500` with a plain-text error message.
