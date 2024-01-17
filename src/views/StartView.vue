<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import RestaurantCard from '@/components/restaurantCard.vue';
import RestaurantOverlay from '@/components/restaurantOverlay.vue';
import { useCustomerStore } from '@/stores/CustomerStore';

const customerStore = useCustomerStore();
const restaurants = ref([]);
let selectedRestaurant = ref(null);
const postal_code = ref(customerStore.postal_code);

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

const onShowOverlay = (restaurant) => {
  selectedRestaurant.value = restaurant;
};
</script>

<template>
  <div class="start">
    <div class="restaurantGrid">
      <RestaurantCard v-for="restaurant in restaurants" :key="restaurant.id" :restaurant="restaurant" @showOverlay="onShowOverlay" />
    </div>
    <RestaurantOverlay v-if="selectedRestaurant" :restaurant="selectedRestaurant" />
  </div>
</template>
<style>
.start {
  display: flex;
  justify-content: center;
}

.restaurantGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
  max-width: 960px;
}

.RestaurantCard {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

</style>