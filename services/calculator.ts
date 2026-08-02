import type { ShopItem } from '../types';

type NumericFields = Pick<ShopItem, 'pricePerUnit' | 'quantity' | 'totalPaid'>;

export type CalculationResult = {
  error: boolean;
  updates: Partial<NumericFields>;
};

const positiveNumber = (value: string) => {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) && number > 0 ? number : null;
};

const format = (value: number) => Number.parseFloat(value.toFixed(3)).toString();

export const calculateMissingValue = ({
  pricePerUnit,
  quantity,
  totalPaid,
}: NumericFields): CalculationResult => {
  const price = positiveNumber(pricePerUnit);
  const amount = positiveNumber(quantity);
  const total = positiveNumber(totalPaid);

  if ([price, amount, total].filter((value) => value !== null).length < 2) {
    return { error: true, updates: {} };
  }

  if (price !== null && amount !== null) {
    return { error: false, updates: { totalPaid: format(price * amount) } };
  }

  if (total !== null && price !== null) {
    return { error: false, updates: { quantity: format(total / price) } };
  }

  return {
    error: false,
    updates: { pricePerUnit: format((total as number) / (amount as number)) },
  };
};
