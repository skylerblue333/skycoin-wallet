import { applyConfirmedTransaction, createWallet } from '../src/wallet';

describe('wallet domain', () => {
  it('creates an empty wallet', () => {
    expect(createWallet('wallet-1')).toMatchObject({ walletId: 'wallet-1', balance: 0, currency: 'SKY4' });
  });

  it('applies a confirmed transaction exactly once', () => {
    const wallet = createWallet('wallet-1');
    const tx = { id: 'tx-1', amount: 25, currency: 'SKY4', status: 'confirmed' as const, createdAt: new Date().toISOString() };
    const credited = applyConfirmedTransaction(wallet, tx);
    const duplicate = applyConfirmedTransaction(credited, tx);
    expect(credited.balance).toBe(25);
    expect(duplicate.balance).toBe(25);
  });

  it('rejects pending transactions and currency mismatches', () => {
    const wallet = createWallet('wallet-1');
    expect(() => applyConfirmedTransaction(wallet, { id: 'tx-1', amount: 10, currency: 'SKY4', status: 'pending', createdAt: new Date().toISOString() })).toThrow();
    expect(() => applyConfirmedTransaction(wallet, { id: 'tx-2', amount: 10, currency: 'USD', status: 'confirmed', createdAt: new Date().toISOString() })).toThrow();
  });
});
