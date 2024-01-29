<template>
  <div class="form-container">
    <h1>User Login</h1>
    <form @submit.prevent="login" class="user-form">
      <!-- Username Input -->
      <div class="form-group">
        <label for="userName" class="form-label">Username:</label>
        <input type="text" id="userName" v-model="userName" class="form-input" required />
      </div>

      <!-- Password Input -->
      <div class="form-group">
        <label for="password" class="form-label">Password:</label>
        <input type="password" id="password" v-model="password" class="form-input" required />
      </div>

      <!-- Submit Button -->
      <div class="form-group">
        <button type="submit" class="submit-button">Login</button>
      </div>
    </form>
  </div>
</template>


<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification'; // Import useToast
import { useCustomerStore } from '@/stores/CustomerStore';
import { useRouter } from 'vue-router';

const toast = useToast(); // Use the useToast composable
const customerStore = useCustomerStore();
const router = useRouter();
const userName = ref('');
const password = ref('');
const localIsLoggedIn = ref(false);

// Watch for changes in isLoggedIn state
watch(() => localIsLoggedIn.value, (newValue) => {
  if (newValue) {
    console.log('Redirecting to home...');
    router.push('/'); // Redirect to the home page or another route as needed
  }
});

const login = async() => {
  try {
    console.log("Logging in...");
    const response = await axios.post('http://localhost:3000/customerLogIn', {
      userName: userName.value, 
      password: password.value
    });

    if (response.data.success) {
      customerStore.userName = userName.value;
      localIsLoggedIn.value = true;
      customerStore.isLoggedIn = localIsLoggedIn;
      customerStore.customerAccount = true;
      customerStore.postal_code = response.data.postal_code;

      toast.success('Login successful!'); // Display success toast
    } else {
      console.log('Login failed:', response.data.error);
      toast.error('Username or Password wrong'); // Display error toast
    }
  } catch (error) {
    console.error('Error:', error.message);
    toast.error('Error: ' + error.message); // Display error toast for network errors or other issues
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
background-color: #7700fe;
color: white;
font-size: 16px;
cursor: pointer;
transition: background-color 0.3s;
}

.submit-button:hover {
background-color: #9765d1;
}
</style>