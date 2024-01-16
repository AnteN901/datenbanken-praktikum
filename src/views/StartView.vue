<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import restaurantCard from '@/components/restaurantCard.vue'
import { useCustomerStore } from '@/stores/CustomerStore';
const customerStore = useCustomerStore();
const restaurants = ref([]);


const getRestaurants = async () => {
  try {
    if(customerStore.isLoggedIn)
    {
    const postal_code = customerStore.postal_code;
    const response = await axios.get(`http://localhost:3000/getRestaurantsFiltered?postal_code=${postal_code}`); //Extrem unangehm und ungewohn, es werde `` gebraucht und nicht ''
    restaurants.value = response.data;
    }
    else
    {
      const response = await axios.get('http://localhost:3000/getRestaurants');
      restaurants.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching restaurant data:', error);
  }
};

onMounted(() => {
  getRestaurants();
});
</script>

<template>
  <div class="start">
      <img alt="Vue logo" src="../assets/logo.png" />
      <div v-for="restaurant in restaurants" :key="restaurant.id">
      <restaurant-card :restaurant="restaurant" />
    </div>
  </div>
  
</template>




<style></style>


