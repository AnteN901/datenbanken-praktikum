<template>
    <div>
      <label>
        <input type="checkbox" v-model="isChecked" @change="handleCheckboxChange" />
         Restaurant Account
      </label>
  
      <shopRegistration v-if="isChecked" />
      <customerRegistration v-else />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import customerRegistration from '../components/customerRegistration.vue';
  import shopRegistration from '../components/shopRegistration.vue';
  
  // Use const for components and functions
  const isChecked = ref(false);
  
  const handleCheckboxChange = () => {
    console.log('Checkbox state:', isChecked.value);
  };
  </script>
  