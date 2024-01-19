<template>
  <div class="form-container">
    <h1>Create a Restaurant Account</h1>
    <form @submit.prevent="createAccount" class="user-form">
      <!-- userName Input -->
      <div class="form-group">
        <label for="userName" class="form-label">userName:</label>
        <input type="text" id="userName" v-model="userName" class="form-input" required />
      </div>

      <!-- Password Input -->
      <div class="form-group">
        <label for="password" class="form-label">Password:</label>
        <input type="password" id="password" v-model="password" class="form-input" required />
      </div>

      <!-- Address Inputs -->
      <div class="form-group">
        <label for="postcode" class="form-label">Postcode:</label>
        <input type="text" id="postcode" v-model="address.postcode" class="form-input" required />
      </div>

      <div class="form-group">
        <label for="street" class="form-label">Street:</label>
        <input type="text" id="street" v-model="address.street" class="form-input" required />
      </div>

      <div class="form-group">
        <label for="city" class="form-label">City:</label>
        <input type="text" id="city" v-model="address.city" class="form-input" required />
      </div>

      <div class="form-group">
        <label for="houseNumber" class="form-label">House Number:</label>
        <input type="text" id="houseNumber" v-model="address.houseNumber" class="form-input" required />
      </div>

      <!-- Submit Button -->
      <div class="form-group">
        <button type="submit" class="submit-button">Create Account</button>
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

// Add createAccount method if needed
// const createAccount = async () => {
//   // API call logic here
// };
</script>

<style scoped>
.form-container {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
min-height: 100vh;
background-color: #f5f5f5;
}

.user-form {
display: flex;
flex-direction: column;
max-width: 400px;
width: calc(100% - 40px);
margin: 0 auto;
padding: 20px;
background: white;
border-radius: 8px;
box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.form-group {
margin-bottom: 15px;
margin-right: 20px; /* Adjusts the right-side space */
}

.form-label {
display: block;
margin-bottom: 5px;
font-weight: bold;
color: #444;
}

.form-input {
width: 100%;
padding: 10px;
border: 1px solid #ccc;
border-radius: 4px;
font-size: 16px;
}

.submit-button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #fe9c00;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}
‚
.submit-button:hover {
  background-color: #d27700;
}
</style>
