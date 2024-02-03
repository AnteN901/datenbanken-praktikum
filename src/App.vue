<script setup>
import { useCustomerStore } from '@/stores/CustomerStore';
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { useRestaurantStore } from './stores/RestaurantStore';
import cartOverlay from '@/components/cartOverlay.vue';
import { useOrderStore } from './stores/OrderStore';
import io from 'socket.io-client';
import { useToast } from 'vue-toastification'; 

const socket = io('http://localhost:3000');
const customerStore = useCustomerStore();
const orderStore = useOrderStore();
const restaurantStore = useRestaurantStore();
const toast = useToast();

const logOut = () => {
  customerStore.userName = '';
  customerStore.isLoggedIn = false;
  customerStore.postal_code = '';
  location.reload();
};

const cartIsOpen = ref(false);

const openCart = () =>{
  cartIsOpen.value = !cartIsOpen.value;
}
onMounted(() => {
  restaurantStore.getRestaurants();
  socket.on('new-order', (data) => {
    console.log(data.message);  // "New order received!"
    if (customerStore.getIsLoggedIn && !customerStore.getIsCustomerAccount) {
      toast.success('New order received!');
      
    }
  });
});

onUnmounted(() => {
  socket.off('new-order');
  socket.close();
});

watch(
  () => orderStore.cartItems.length,
  (newLength, oldLength) => {
    // Check if the length of the array has increased (item added)
    if (newLength > oldLength) {
      // Open the cart overlay
      cartIsOpen.value = true;
    }
  }
);



</script>


<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link> 
      <router-link v-if="!customerStore.getIsLoggedIn" to="/register">Register</router-link> 
      <router-link v-if="!customerStore.getIsLoggedIn" to="/login">Login</router-link>
      <button v-else class="logOut" @click="logOut">Log Out</button> 
      <div class="profile-pic-container">
        <router-link to="/profile">
          <img src="./assets/user_light.png" alt="Profile" class="profile-pic"/>
        </router-link>
        <button v-if="customerStore.getIsLoggedIn && customerStore.getIsCustomerAccount" class="logOut" @click="openCart">
          <img src="./assets/warenkorb_icon.png" class="profile-pic">
        </button>
      </div>
    </nav>
    <cartOverlay v-if="cartIsOpen" @close-cart="cartIsOpen = false" />
    <router-view />
  </div>
</template>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body, html, #app {
  margin: 0;
  padding: 0;
}

nav {
  background-color: #703bd9d9; /* Orange background */
  box-sizing: border-box;
  padding-bottom: 70px;
  width: 100%; /* Full width */
  height: 80px;
  padding: 25px 50px;/* Adjust padding as needed */
  position:static; 
  text-align: center; /* Aligns the nav items to the left */
  display:flex;
  align-items: center; /* Align items vertically */
}

nav a {
  font-weight: bold;
  color: white; /* White text */
  margin-right: 10px; /* Adds spacing between links */
  text-decoration: none; /* Removes underline from links */
}

nav a.router-link-exact-active,
nav a:hover {
  color: #b691ffd9; /* Lighter orange for active/hover state */
}

.logOut {
  background: none;
  border: none;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.logOut:hover {
  color: #b691ffd9; /* Lighter orange for hover state */
}

.profile-pic {
  height: 20px; /* Adjust to the desired size */
  width: 20px; /* Adjust to the desired size */
  object-fit: cover; /* Ensures the image covers the area without stretching */
  margin-left: 10px; /* Adds some space between the picture and other items */
}

.profile-pic-container {
  margin-left: auto; /* Pushes the picture to the right */
}

</style>
