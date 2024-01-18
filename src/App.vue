<script setup>
import { useCustomerStore } from '@/stores/CustomerStore';
const customerStore = useCustomerStore();

const logOut = () => {
  customerStore.userName = '';
  customerStore.isLoggedIn = false;
  customerStore.postal_code = '';
  location.reload();
};




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
      </div>
    </nav>
    
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

body, html {
  margin: 0;
  padding: 0;
}

nav {
  background-color: #703bd9d9; /* Orange background */
  box-sizing: border-box;
  padding-bottom: 70px;
  width: 100%; /* Full width */
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
