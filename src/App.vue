<script setup>
import { useCustomerStore } from '@/stores/CustomerStore';
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { useRestaurantStore } from './stores/RestaurantStore';
import cartOverlay from '@/components/cartOverlay.vue';
import { useOrderStore } from './stores/OrderStore';
import io from 'socket.io-client';
import { useToast } from 'vue-toastification'; 
import logoImage from '@/assets/Lieferspatz_Head.png';

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
        <!-- Use img tag with dynamic src binding for the logo -->
        <img :src="logoImage" alt="Logo" class="logo">
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

.nav-links a, .logOut {
  color: white; /* Base color */
  text-decoration: none; /* Removes underline */
  padding: 10px 15px; /* Adds some padding around the links for better clickability */
  margin-right: 10px; /* Adds spacing between the links */
  border-radius: 5px; /* Optional: rounds the corners */
  transition: color 0.3s; /* Smooth transition for color change */
}

/* Hover state for navigation links and the logOut button */
.nav-links a:hover, .logOut:hover {
  color: #703bd9; /* Dark purple color on hover */
  background-color: transparent; /* Ensures no background block appears */
}

/* Active state for navigation links and the logOut button */
.nav-links a:active, .logOut:active,
.router-link-active { /* Styles for Vue Router's active link */
  color: #b691ffd9; /* Light purple color when active */
  background-color: transparent; /* Ensures no background block appears */
}

/* Ensures the logOut button has no background or border by default */
.logOut {
  background: none;
  border: none;
  cursor: pointer;
}


/* Ensure the logOut button has the same styles on hover and active states as links */
.logOut:hover, .logOut:active {
  color: #b691ffd9; /* Match the hover and active color of the links */
  background-color: rgba(255, 255, 255, 0.2); /* Match the hover background of the links */
}

.logo-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 65px; /* Adjust height as needed */
}

.logo {
   /* Path to your logo image */
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


