# Security Policy

This repository is an in-memory confirmed-credit ledger primitive, not a custodial or non-custodial wallet.

Report vulnerabilities privately through GitHub security reporting where available.

Callers are responsible for deciding when an external transaction is confirmed, authenticating transaction sources, durable idempotency, reconciliation, authorization, audit storage, and any key/signing custody. Do not store private keys, seed phrases, credentials, or customer secrets in this package.

Do not use this library as the authoritative ledger for real assets without durable transactional storage and independent financial/security review.
