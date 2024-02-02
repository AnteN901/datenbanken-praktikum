<script setup>
import { ref, onMounted } from 'vue';
import { useRestaurantStore } from '@/stores/RestaurantStore';
import { useOrderStore } from '@/stores/OrderStore';
import RestaurantCard from '@/components/restaurantCard.vue';
import RestaurantOverlay from '@/components/restaurantOverlay.vue';

const restaurantStore = useRestaurantStore();
const orderStore = useOrderStore();
const showOverlay = ref(false);


onMounted(() => {
  restaurantStore.getRestaurants(); // Fetch restaurants when component is mounted
});

const onShowOverlay = (restaurant) => {
  showOverlay.value = true;
  orderStore.selectedRestaurant = restaurant;
};

const handleOverlayClose = (value) => {
  showOverlay.value = value;
  orderStore.selectedRestaurant = null;
};
</script>

<template>
  <div class="start">
    <!-- Show loading message when data is being fetched -->
    <p v-if="restaurantStore.isLoading">Loading...</p>

    <!-- Render restaurant cards when data is ready -->
    <div v-else class="restaurantGrid">
      <RestaurantCard
        v-for="restaurant in restaurantStore.restaurants"
        :key="restaurant.id"
        :restaurant="restaurant"
        @click="onShowOverlay"
      />
    </div>
    <RestaurantOverlay v-if="showOverlay" @close="handleOverlayClose" />
  </div>
</template>
<style scoped>
.start {
  display: flex;
  justify-content: center;
}

.restaurantGrid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px; /* Adjust as needed */
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