<template>
  <div>
    <div class="checkbox-container">
      <label>
        <input type="checkbox" v-model="isChecked" @change="handleCheckboxChange" />
        Restaurant Account
      </label>
    </div>
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

  <style>
.checkbox-container {
  background-color: #f5f5f5; /* Match the form's background color */
  padding: 20px;
  text-align: center;
}

label {
  font-size: 16px;
  color: #2c3e50; /* Adjust the color as needed */
}

input[type="checkbox"] {
  margin-right: 10px;
}

  
  </style>
  