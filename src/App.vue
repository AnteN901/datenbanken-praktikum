<script setup>
import { useCustomerStore } from '@/stores/CustomerStore';
const customerStore = useCustomerStore();

const logOut = () => {
  customerStore.userName = '';
  customerStore.isLoggedIn = false;
  };

</script>


<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link v-if="!customerStore.isLoggedIn" to="/register">User Register</router-link> |
      <router-link v-if="!customerStore.getIsLoggedIn" to="/login" >User Login</router-link>
      <button v-else class="logOut" @click="logOut">Log Out</button> 
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

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

</style>
