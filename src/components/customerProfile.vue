<script setup>
import { useCustomerStore } from '@/stores/CustomerStore';
</script>

<template>
    <div>
        <button @click="goToCart">Warenkorb</button>
        <button @click="showOrderOverview">Bestellübersicht</button>
    </div>
</template>

<script>

export default {
  methods: {
    goToCart() {
      console.log('Warenkorb button clicked');
    },
    showOrderOverview() {
      console.log('Bestellübersicht button clicked');
    },
  },
  computed: {
  getIsLoggedIn() {
    return useCustomerStore.getIsLoggedIn;
  },
},
};
</script>

<style scoped>
</style>