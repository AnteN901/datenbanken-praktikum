<template>
  <div>
    <div class="checkbox-container">
      <label>
        <input type="checkbox" v-model="isChecked" @change="handleCheckboxChange" />
        Restaurant Account
      </label>
    </div>
    <shopLogin v-if="isChecked" />
    <customerLogin v-else />
  </div>
</template>

 <script setup>
import { ref } from 'vue';
import customerLogin from '@/components/customerLogin.vue';
import shopLogin from '@/components/shopLogin.vue';
import { useCustomerStore } from '@/stores/CustomerStore';

const customerStore = useCustomerStore();

const isChecked = ref(false);
customerStore.customerAccount = !ref(isChecked);
</script>
<style scoped>
.checkbox-container {
  background-color: #f5f5f5; /* Match the form's background color */
  padding: 20px;
  text-align: center;
  margin-bottom: 0%;
}
</style>
