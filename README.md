# SKYCOIN4444 Confirmed Credit Ledger

A small TypeScript domain library that accumulates **positive confirmed credits** exactly once by transaction ID. Despite the repository name, this code is not a cryptographic wallet: it contains no private keys, addresses, signing, blockchain RPC, custody, withdrawal, or chain-confirmation implementation.

## Implemented behavior

- creates an empty ledger for one normalized asset code
- accepts only positive safe-integer credit amounts
- validates transaction IDs and timestamps
- applies only `confirmed` credits
- rejects cross-currency application
- treats a repeated transaction ID as idempotent
- returns new ledger objects instead of mutating the input
- guards balance overflow

Amounts are integral caller-defined units. For fiat or token systems, callers should pass the smallest chosen unit (for example cents or token base units) and own the decimal/display conversion separately.

## Verification

```bash
npm install
npm run lint
npm test
npm run build
npm audit --audit-level=high
```

CI runs those gates on `main`, product branches, and pull requests.

## Integration boundary

This library can sit behind a verified payment/blockchain adapter that decides when an external transaction is genuinely final enough to be represented as `confirmed`. Persistent idempotency, debit/withdrawal accounting, double-entry bookkeeping, reconciliation, chain reorg handling, authorization, audit-log durability, and key custody belong outside this primitive.

## Status

**Classification:** ENGINEERING LAB / beta library.

Automated tests validate the in-memory credit behavior only. This repository does not handle real assets, establish account balances against an external source of truth, or constitute production wallet software.

## Security and financial boundary

Never use this in-memory summary as the authoritative ledger for real-money or token custody. Production financial systems require durable transactional storage, reconciliation, auditability, access controls, operational controls, and independent review.

## License

MIT; see `LICENSE`.
