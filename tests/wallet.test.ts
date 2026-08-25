import { describe, expect, it } from 'vitest';
import { applyConfirmedTransaction, createWallet } from '../src/wallet';

describe('confirmed credit ledger', () => {
  it('creates an empty normalized ledger', () => {
    expect(createWallet(' wallet-1 ', 'sky4')).toEqual({ walletId: 'wallet-1', balance: 0, currency: 'SKY4', transactions: [] });
  });

  it('applies a confirmed transaction exactly once', () => {
    const wallet = createWallet('wallet-1');
    const tx = { id: 'tx-1', amount: 25, currency: 'sky4', status: 'confirmed' as const, createdAt: '2026-08-24T00:00:00Z' };
    const credited = applyConfirmedTransaction(wallet, tx);
    const duplicate = applyConfirmedTransaction(credited, tx);
    expect(credited.balance).toBe(25);
    expect(credited.transactions[0].createdAt).toBe('2026-08-24T00:00:00.000Z');
    expect(duplicate).toBe(credited);
  });

  it('rejects pending transactions and currency mismatches', () => {
    const wallet = createWallet('wallet-1');
    expect(() => applyConfirmedTransaction(wallet, { id: 'tx-1', amount: 10, currency: 'SKY4', status: 'pending', createdAt: '2026-08-24' })).toThrow(/confirmed/);
    expect(() => applyConfirmedTransaction(wallet, { id: 'tx-2', amount: 10, currency: 'USD', status: 'confirmed', createdAt: '2026-08-24' })).toThrow(/currency/);
  });

  it('rejects fractional/non-positive amounts, malformed dates, and malformed asset codes', () => {
    const wallet = createWallet('wallet-1');
    expect(() => applyConfirmedTransaction(wallet, { id: 'tx-1', amount: 1.5, currency: 'SKY4', status: 'confirmed', createdAt: '2026-08-24' })).toThrow(/safe integer/);
    expect(() => applyConfirmedTransaction(wallet, { id: 'tx-1', amount: 0, currency: 'SKY4', status: 'confirmed', createdAt: '2026-08-24' })).toThrow(/positive/);
    expect(() => applyConfirmedTransaction(wallet, { id: 'tx-1', amount: 1, currency: 'SKY4', status: 'confirmed', createdAt: 'bad' })).toThrow(/createdAt/);
    expect(() => createWallet('wallet-1', '$$$')).toThrow(/asset code/);
  });
});
