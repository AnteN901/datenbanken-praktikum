<template>
  <div>
    <h1>Create a User Account</h1>
    <form @submit.prevent="createAccount">
      <!-- Username Input -->
      <div>
        <label for="firstName">First name:</label>
        <input type="text" id="firstName" v-model="firstName" required />
      </div>

      <div>
        <label for="lastName">Last Name:</label>
        <input type="text" id="lastName" v-model="LastName" required />
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
import axios from 'axios';

const firstName = ref('');
const lastName = ref('');
const password = ref('');
const address = reactive({
  postcode: '',
  street: '',
  city: '',
  houseNumber: ''
});

const createAccount = async () => {
  try {
    console.log('Address:', address);
    const response = await axios.post('http://localhost:3000/create-customer', {
      firstName: firstName.value,
      lastName: lastName.value,
      password: password.value,
      address: {
        postcode: address.postcode,
        street: address.street,
        city: address.city,
        houseNumber: address.houseNumber
      }
    });

    // Handle the response if needed
    console.log('Response:', response.data);
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
  }
};
</script>

<style scoped>
/* Add component-specific styles here if needed */
</style>