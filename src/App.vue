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
      <div class="nav-links">
        <router-link to="/">Home</router-link>
        <router-link v-if="!customerStore.getIsLoggedIn" to="/register">Register</router-link>
        <router-link v-if="!customerStore.getIsLoggedIn" to="/login">Login</router-link>
        <button v-else class="logOut" @click="logOut">Log Out</button>
      </div>
      <div class="logo-container">
        <div class="logo"></div> <!-- Logo as a background image -->
      </div>
      <div class="profile-cart">
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
  width: 100%; /* Full width */
  display: flex;
  justify-content: space-between; /* Space between for left and right sections */
  align-items: center; /* Align items vertically */
  padding: 15px 50px; /* Adjusted padding */
  flex-wrap: wrap; /* Allows items to wrap to prevent overflow */
  box-sizing: border-box; /* Ensures padding is included in width calculation */
}

.nav-links, .profile-cart {
  display: flex;
  align-items: center;
}

.nav-links a, .logOut {
  font-weight: bold;
  color: white; /* White text */
  text-decoration: none; /* Removes underline from links */
  margin-right: 20px; /* Adds spacing between links */
  padding: 10px 0; /* Adds vertical padding for better clickability */
}

.logOut {
  background: transparent; /* Ensures logOut button has no background */
  border: none; /* Ensures logOut button has no border */
  cursor: pointer; /* Changes cursor to pointer on hover */
}

.logOut:hover {
  color: #b691ffd9; /* Lighter shade for hover state */
}

.logo-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 65px; /* Adjust height as needed */
}

.logo {
  background-image: url('./assets/Lieferspatz_Head.png'); /* Path to your logo image */
  background-position: center; /* Center the background image */
  background-repeat: no-repeat;
  background-size: contain; /* Resize the background to fit the container */
  width: auto; /* Width auto for intrinsic aspect ratio */
  height: 100%; /* Set height to 100% of the container */
}

.profile-pic {
  height: 30px; /* Adjusted for better visibility */
  width: 30px; /* Adjusted for better visibility */
  object-fit: cover; /* Ensures the image covers the area without stretching */
  margin-left: 10px; /* Adds some space between the picture and other items */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .nav-links, .profile-cart {
    flex-direction: column; /* Stack the links vertically on smaller screens */
    align-items: center; /* Center align the items */
  }

  .nav-links a, .logOut, .profile-pic {
    margin: 5px 0; /* Reduce margin for smaller screens */
  }

  .logo-container {
    height: 50px; /* Reduce the logo container height on smaller screens */
  }
}
</style>


