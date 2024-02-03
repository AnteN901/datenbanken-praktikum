<template>
  <div class="form-container">
    <h1>User Login</h1>
    <form @submit.prevent="login" class="user-form">
      <!-- Username Input -->
      <div class="form-group">
        <label for="userName" class="form-label">Username:</label>
        <input type="text" placeholder="Username" id="userName" v-model="userName" class="form-input" required />
      </div>

      <!-- Password Input -->
      <div class="form-group">
        <label for="password" class="form-label">Password:</label>
        <input type="password" placeholder="Password" id="password" v-model="password" class="form-input" required />
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

watch(() => localIsLoggedIn.value, (newValue) => {
  if (newValue) {
    router.push('/'); // Redirect to home or another route as needed
  }
});

const login = async () => {
  try {
    const response = await axios.post('http://localhost:3000/customerLogIn', {
      userName: userName.value, 
      password: password.value
    });

    if (response.data.success) {
      customerStore.userName = userName.value;
      localIsLoggedIn.value = true;
      customerStore.isLoggedIn = localIsLoggedIn.value; // Ensure this is set correctly
      customerStore.customerAccount = true;
      customerStore.postal_code = response.data.postal_code;

      toast.success('Login successful!');
    } else {
      toast.error('Username or Password wrong');
    }
  } catch (error) {
    toast.error('Error: ' + error.message);
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
  max-width: 400px; /* Adjust if necessary to fit your design */
  width: calc(100% - 40px); /* Ensures some space on the sides within the container */
  margin: auto; /* Centers the form in its parent container */
  padding: 20px; /* Increases padding to prevent children from touching the edges */
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.form-input {
  max-width: 95%; /* Prevents the input from filling the entire form width */
  margin: auto; /* Centers the input within the form */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.form-group {
  margin-bottom: 15px;
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
  padding: 12px 15px; /* Ensure padding is the same for both forms */
  width: 100%; /* Make the button take the full width of the form */
  border: none;
  border-radius: 4px;
  background-color: #fe9c00;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #d27700;
}

</style>