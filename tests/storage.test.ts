import { describe, expect, test } from 'bun:test';
import { migrateShopGroups } from '../services/storage';

describe('migrateShopGroups', () => {
  test('renames legacy amount without mutating the input', () => {
    const input = [
      {
        id: 'group',
        name: 'Weekly shop',
        createdAt: 1,
        updatedAt: 1,
        items: [
          {
            id: 'item',
            name: 'Rice',
            unitType: 'kg',
            pricePerUnit: '50',
            amount: '2',
            totalPaid: '100',
            timestamp: 1,
          },
        ],
      },
    ];

    const result = migrateShopGroups(input);

    expect(result[0].items[0].quantity).toBe('2');
    expect('amount' in result[0].items[0]).toBe(false);
    expect(input[0].items[0].amount).toBe('2');
  });

  test('returns an empty list for invalid stored data', () => {
    expect(migrateShopGroups({ items: [] })).toEqual([]);
  });

  test('normalizes missing item arrays', () => {
    const [group] = migrateShopGroups([{ id: 'group', name: 'Shop' }]);
    expect(group.items).toEqual([]);
  });
});
