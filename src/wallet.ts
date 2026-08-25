export interface WalletTransaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: string;
}

export interface WalletSummary {
  walletId: string;
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
}

const CURRENCY = /^[A-Z0-9][A-Z0-9._-]{1,15}$/;

function normalizeCurrency(currency: string): string {
  const normalized = currency.trim().toUpperCase();
  if (!CURRENCY.test(normalized)) throw new Error('currency must be a 2-16 character asset code');
  return normalized;
}

function validateTransaction(transaction: WalletTransaction): WalletTransaction {
  const id = transaction.id.trim();
  if (!id) throw new Error('transaction id is required');
  if (!Number.isSafeInteger(transaction.amount) || transaction.amount <= 0) {
    throw new Error('transaction amount must be a positive safe integer');
  }
  const createdAtMs = Date.parse(transaction.createdAt);
  if (Number.isNaN(createdAtMs)) throw new Error('transaction createdAt must be a valid date');
  return {
    ...transaction,
    id,
    currency: normalizeCurrency(transaction.currency),
    createdAt: new Date(createdAtMs).toISOString(),
  };
}

/**
 * Creates an in-memory balance ledger. This object does not contain keys,
 * addresses, signing capability, or blockchain connectivity.
 */
export function createWallet(walletId: string, currency = 'SKY4'): WalletSummary {
  const id = walletId.trim();
  if (!id) throw new Error('walletId is required');
  return { walletId: id, balance: 0, currency: normalizeCurrency(currency), transactions: [] };
}

/** Applies a positive confirmed credit exactly once by transaction id. */
export function applyConfirmedTransaction(wallet: WalletSummary, transaction: WalletTransaction): WalletSummary {
  const normalized = validateTransaction(transaction);
  if (normalized.status !== 'confirmed') throw new Error('only confirmed transactions affect balance');
  if (normalized.currency !== normalizeCurrency(wallet.currency)) throw new Error('currency mismatch');
  if (wallet.transactions.some((item) => item.id === normalized.id)) return wallet;

  const balance = wallet.balance + normalized.amount;
  if (!Number.isSafeInteger(balance)) throw new Error('balance exceeds safe integer range');

  return {
    ...wallet,
    balance,
    currency: normalizeCurrency(wallet.currency),
    transactions: [...wallet.transactions, normalized],
  };
}
