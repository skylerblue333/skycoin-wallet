# Changelog

## 1.1.0 - Engineering beta

- Reclassified the code from a wallet claim to a confirmed-credit ledger primitive.
- Added asset-code, timestamp, transaction-ID, safe-integer amount, and balance-overflow validation.
- Normalized stored transaction timestamps/currencies.
- Preserved idempotent transaction-ID handling and immutable updates.
- Replaced fake success scripts with real typecheck/test/build/dependency-audit gates.
- Removed misleading HTTP-service container packaging.
- Added explicit custody, persistence, reconciliation, and production boundaries.
