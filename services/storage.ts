import { ShopGroup } from '../types';

const STORAGE_KEY = 'grocertrack_data_v1';
const THEME_KEY = 'grocertrack_theme';

export const saveShopGroups = (groups: ShopGroup[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  } catch (e) {
    console.error('Failed to save data', e);
  }
};

export const loadShopGroups = (): ShopGroup[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load data', e);
    return [];
  }
};

export const saveTheme = (theme: 'light' | 'dark') => {
  localStorage.setItem(THEME_KEY, theme);
};

export const loadTheme = (): 'light' | 'dark' | null => {
  return localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
};