import { defineStore } from 'pinia';

export const useCustomerStore = defineStore('CustomerStore', {
    state: () => ({
      userName: null
    }),
  
    getters: {
      // Getter für die Anzahl der Produkte
      getuserName: (state) => state.userName
      },
  
    actions: {
      // Aktion, um ein neues Produkt hinzuzufügen
      setuserName(userName) {
        state.userName.push(userName);
      },
    },
  });