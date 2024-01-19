import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useCustomerStore = defineStore('CustomerStore', {
    state: () => reactive ({
      userName: '',
      isLoggedIn: false,
      customerAccount: true,
      postal_code: '' //Vorerst mal erstellt. Denke zum LogIn PostalCode abspeichen könnte praktisch sein

    }),
  
    getters: {
      // Getter für die Anzahl der Produkte
      getUserName: (state) => state.userName,
      getIsLoggedIn: (state) => state.isLoggedIn,
      getIsCustomerAccount: (state) => state.customerAccount
      },
  
    actions: {
      // Aktion, um ein neues Produkt hinzuzufügen
      setUserName(userName) {
        state.userName.push(userName);
      },
     setIsLoggedIn(isLoggedIn){
        state.isLoggedIn = isLoggedIn;
      },
      setCustomerAccount(customerAccount){
        state.customerAccount = customerAccount;
      }
    },

  });