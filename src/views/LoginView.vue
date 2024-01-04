<template>
  <div>
    <h1>User Login</h1>
    <form @submit.prevent="login">
      <label for="userName">userName:</label>
      <input type="text" id="userName" v-model="userName" required />
      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

 <script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';

const userName = ref('');
const password = ref('');

const login = async() => {
  try{
  console.log("Logging in..."); // Use the console object to log the message
  const response = await axios.post('http://localhost:3000/logIn', 
  {userName: userName.value, 
   password: password.value
  });
   console.log('response nach await',response.data);
   if (response.data.success) {
      console.log('Login successful');
      // Redirect to another page, update state, or perform other actions on success
    } else {
      console.log('Login failed:', response.data.error);
      // Handle login failure, e.g., show an error message to the user
    }
  } catch (error) {
    // Handle network errors or other issues
    console.error('Error:', error.message);
    // Show an appropriate error message to the user
  }
  
};
</script>
<style scoped>
/* Add your custom styles here */
</style>
