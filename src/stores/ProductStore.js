import { defineStore } from 'pinia';

export const useProductStore = defineStore('ProductStore', {
  state: () => ({
    products: [],
  }),

  getters: {
    // Getter für die Anzahl der Produkte
    productCount: (state) => state.products.length,

    // Getter für alle Produkte
    getAllProducts: (state) => state.products,
  },

  actions: {
    // Aktion, um ein neues Produkt hinzuzufügen
    addProduct(product) {
      state.products.push(product);
    },
  },
});
