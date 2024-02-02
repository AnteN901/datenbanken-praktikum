<template>
  <div class="form-container">
    <h1>Create a User Account</h1>
    <form @submit.prevent="createAccount" class="user-form">
      <div class="form-group">
        <label for="userName" class="form-label">User name:</label>
        <input type="text" id="userName" v-model="userName" class="form-input" required />
      </div>

      <div class="form-group">
        <label for="firstName" class="form-label">First name:</label>
        <input type="text" id="firstName" v-model="firstName" class="form-input" required />
      </div>

      <div class="form-group">
        <label for="lastName" class="form-label">Last Name:</label>
        <input type="text" id="lastName" v-model="lastName" class="form-input" required />
      </div>

      <div class="form-group">
        <label for="password" class="form-label">Password:</label>
        <input type="password" id="password" v-model="password" class="form-input" required />
      </div>

      <div class="form-group">
        <label for="postcode" class="form-label">Postcode:</label>
        <input type="text" id="postcode" v-model="address.postcode" class="form-input" required />
      </div>

      <div class="form-group">
        <label for="city" class="form-label">City:</label>
        <input type="text" id="city" v-model="address.city" class="form-input" required />
      </div>

      <div class="form-group">
        <label for="street" class="form-label">Street:</label>
        <input type="text" id="street" v-model="address.street" class="form-input" required />
      </div>

      <div class="form-group">
        <label for="houseNumber" class="form-label">House Number:</label>
        <input type="text" id="houseNumber" v-model="address.houseNumber" class="form-input" required />
      </div>

      <div class="form-group">
        <button type="submit" class="submit-button">Create Account</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; // Import useRouter
import { useToast } from 'vue-toastification'; // Import useToast

const userName = ref('');
const firstName = ref('');
const lastName = ref('');
const password = ref('');
const address = reactive({
  postcode: '',
  street: '',
  city: '',
  houseNumber: ''
});

const router = useRouter(); // Use useRouter composable
const toast = useToast(); // Use the useToast composable for toast notifications

const createAccount = async () => {
  try {
    const response = await axios.post('http://localhost:3000/create-customer', {
      userName: userName.value,
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

    // Check the response for successful registration
    if (response && response.data) {
      // Show success toast
      toast.success('Account created successfully! Redirecting to login...');

      // Redirect to login page after a short delay to allow user to see the toast
      setTimeout(() => {
        router.push('/login');
      }, 2000); // Adjust delay as needed
    }
  } catch (error) {
    console.error('Error:', error);
    // Show error toast
    toast.error('Failed to create account. Please try again.');
  }
};
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
  width: calc(100% - 40px); /* Adjusts the width with padding */
  margin: 0 auto; /* Centers the form */
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.form-group {
  margin-bottom: 15px;
  margin-right: 20px;
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




