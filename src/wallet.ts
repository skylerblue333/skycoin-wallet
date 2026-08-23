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

export function createWallet(walletId: string, currency = 'SKY4'): WalletSummary {
  if (!walletId.trim()) throw new Error('walletId is required');
  if (!currency.trim()) throw new Error('currency is required');
  return { walletId: walletId.trim(), balance: 0, currency: currency.trim().toUpperCase(), transactions: [] };
}

export function applyConfirmedTransaction(wallet: WalletSummary, transaction: WalletTransaction): WalletSummary {
  if (transaction.amount <= 0 || !Number.isFinite(transaction.amount)) throw new Error('transaction amount must be positive');
  if (transaction.status !== 'confirmed') throw new Error('only confirmed transactions affect balance');
  if (transaction.currency.toUpperCase() !== wallet.currency) throw new Error('currency mismatch');
  if (wallet.transactions.some((item) => item.id === transaction.id)) return wallet;

  return {
    ...wallet,
    balance: wallet.balance + transaction.amount,
    transactions: [...wallet.transactions, transaction],
  };
}
