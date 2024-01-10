<template>
  <div>
    <h1>User Login</h1>
    <form @submit.prevent="login">
      <label for="userName">userName:</label>
      <input type="text" placeholder="Benutzername" id="userName" v-model="userName" required />
      <label for="password">Password:</label>
      <input type="password" placeholder="Passwort" id="password" v-model="password" required />
      <button type="submit">Login</button>
      <text>{{ meldung }}</text>
       </form>
       
  </div>
  
</template>

 <script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useCustomerStore } from '@/stores/CustomerStore';
import { loadRouteLocation, useRouter } from 'vue-router';

const customerStore = useCustomerStore();
const router = useRouter();
const userName = ref('');
const password = ref('');
const meldung = ref('');

const login = async() => {
  try{
  console.log("Logging in..."); // Use the console object to log the message
  const response = await axios.post('http://localhost:3000/logIn', 
  {userName: userName.value, 
   password: password.value
  });
   if (response.data.success) {
      customerStore.userName = userName;
      customerStore.isLoggedIn = true;
      console.log('Login successful');

      // Jump to Main-Site
      router.push('/');
      
      
      
    } else {
      console.log('Login failed:', response.data.error);
      // Handle login failure, e.g., show an error message to the user
    }
  } catch (error) {
    // Handle network errors or other issues
    console.error('Error:', error.message);
    meldung.value = 'Benutzername oder Passwort falsch!';
    // Show an appropriate error message to the user
  }
  
  
};
</script>
<style scoped>
/* Add your custom styles here */
</style>
