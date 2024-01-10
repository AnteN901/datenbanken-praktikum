<template>
    <div>
      <h1>Create a Restaurant Account</h1>
      <form @submit.prevent>
        <!-- userName Input -->
        <div>
          <label for="userName">userName:</label>
          <input type="text" id="userName" v-model="userName" required />
        </div>
  
        <!-- Password Input -->
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
  
        <!-- Address Inputs -->
        <div>
          <label for="postcode">Postcode:</label>
          <input type="text" id="postcode" v-model="address.postcode" required />
        </div>
  
        <div>
          <label for="street">Street:</label>
          <input type="text" id="street" v-model="address.street" required />
        </div>
  
        <div>
          <label for="city">City:</label>
          <input type="text" id="city" v-model="address.city" required />
        </div>
  
        <div>
          <label for="houseNumber">House Number:</label>
          <input type="text" id="houseNumber" v-model="address.houseNumber" required />
        </div>
  
        <!-- Submit Button -->
        <div>
          <button type="submit">Create Account</button>
        </div>
      </form>
    </div>
  </template>
  
  
  <script setup>
  import { ref, reactive } from 'vue';
  const userName = ref('');
  const password = ref('');
  const address = reactive({
    postcode: '',
    street: '',
    city: '',
    houseNumber: ''
  });
  </script>
  
  <style scoped>
  /* Add component-specific styles here if needed */
  </style>
  