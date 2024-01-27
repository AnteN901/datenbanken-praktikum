import { defineStore } from 'pinia';

export const useOrderStore = defineStore('order', {
    state: () => ({
        selectedRestaurant: null,
        cartItems: [],
    }),
});
