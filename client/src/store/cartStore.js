import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  purchasedProducts: new Set(),

  addPurchased: (productId) => {
    const current = new Set(get().purchasedProducts);
    current.add(productId);
    set({ purchasedProducts: current });
  },

  hasPurchased: (productId) => {
    return get().purchasedProducts.has(productId);
  },

  setPurchasedProducts: (ids) => {
    set({ purchasedProducts: new Set(ids) });
  },
}));
