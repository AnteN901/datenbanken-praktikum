<script setup>
import { useCustomerStore } from '@/stores/CustomerStore';
import customerProfile from "../components/customerProfile.vue";
import restaurantProfile from "../components/restaurantProfile.vue";
const customerStore = useCustomerStore();

</script>
<template>
  <div>
    <div>
      <template v-if="customerStore.getIsLoggedIn">
        
        <customerProfile v-if="customerStore.getIsCustomerAccount" />
        <restaurantProfile v-else />
      </template>
      <template v-else>
        <p>Bitte einloggen, um auf das Profil zuzugreifen.</p>
      </template>
    </div>
  </div>
  </template>


<style scoped>
</style>