import { describe, expect, test } from 'bun:test';
import { calculateMissingValue } from '../services/calculator';

describe('calculateMissingValue', () => {
  test('calculates total from price and quantity', () => {
    expect(calculateMissingValue({ pricePerUnit: '20', quantity: '1.5', totalPaid: '' })).toEqual({
      error: false,
      updates: { totalPaid: '30' },
    });
  });

  test('calculates quantity from total and price', () => {
    expect(calculateMissingValue({ pricePerUnit: '25', quantity: '', totalPaid: '50' })).toEqual({
      error: false,
      updates: { quantity: '2' },
    });
  });

  test('calculates price from total and quantity', () => {
    expect(calculateMissingValue({ pricePerUnit: '', quantity: '2', totalPaid: '15' })).toEqual({
      error: false,
      updates: { pricePerUnit: '7.5' },
    });
  });

  test('recalculates total when all values are present', () => {
    expect(calculateMissingValue({ pricePerUnit: '12', quantity: '3', totalPaid: '1' })).toEqual({
      error: false,
      updates: { totalPaid: '36' },
    });
  });

  test('rejects fewer than two positive values', () => {
    expect(calculateMissingValue({ pricePerUnit: '-1', quantity: '', totalPaid: '10' })).toEqual({
      error: true,
      updates: {},
    });
  });
});
