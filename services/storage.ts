import type { ShopGroup, ShopItem } from '../types';

const STORAGE_KEY = 'grocertrack_data_v1';
const THEME_KEY = 'grocertrack_theme';

type LegacyItem = Partial<ShopItem> & { amount?: string };

export const migrateShopGroups = (value: unknown): ShopGroup[] => {
  if (!Array.isArray(value)) return [];

  return value
    .filter((group): group is Record<string, unknown> => !!group && typeof group === 'object')
    .map((group) => ({
      ...group,
      items: Array.isArray(group.items)
        ? group.items
            .filter((item): item is LegacyItem => !!item && typeof item === 'object')
            .map(({ amount, ...item }) => ({
              ...item,
              quantity: item.quantity ?? amount ?? '',
            }))
        : [],
    })) as ShopGroup[];
};

export const saveShopGroups = (groups: ShopGroup[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  } catch (error) {
    console.error('Failed to save data', error);
  }
};

export const loadShopGroups = (): ShopGroup[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? migrateShopGroups(JSON.parse(data)) : [];
  } catch (error) {
    console.error('Failed to load data', error);
    return [];
  }
};

export const saveTheme = (theme: 'light' | 'dark') => {
  localStorage.setItem(THEME_KEY, theme);
};

export const loadTheme = (): 'light' | 'dark' | null => {
  return localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
};
