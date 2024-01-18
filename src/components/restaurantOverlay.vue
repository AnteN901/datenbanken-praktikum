<template>
  <div class="overlay" v-if="selectedRestaurant">
    <div class="overlay-content">
      <button class="close-button" @click="emitCloseEvent">X</button>
      <div class="restaurant-info">
        <img :src="getImageUrl(selectedRestaurant.image)" alt="Restaurant Image" class="restaurant-image">
        <div class="restaurant-details">
          <h2>{{ selectedRestaurant.name }}</h2>
          <p class="address"><strong>Address:</strong> {{ selectedRestaurant.address }}</p>
          <p>{{ selectedRestaurant.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
  import { defineEmits } from 'vue';
  import { useOrderStore } from '@/stores/OrderStore';
  
  const selectedRestaurant = useOrderStore().selectedRestaurant;
  const emit = defineEmits(['close']);
  
  const emitCloseEvent = () => {
    emit('close', false);
  };

  const getImageUrl = (imagePath) => {
  const baseUrl = 'http://localhost:3000';
  return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};
  </script>
  
  <style scoped>
  .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
      z-index: 1000;
  }
  
  .overlay-content {
      position: relative;
      width: 90%;
      max-width: 900px;
      height: 80%;
      max-height: 600px;
      background-color: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      overflow-y: auto;
  }
  
  .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 20px;
      color: #333;
  }
  
  .restaurant-info {
  display: flex;
  align-items: flex-start;
}

.restaurant-details {
  display: flex;
  flex-direction: column;
  gap: 10px; /* reduce gap to bring texts closer together */
  flex: 1; /* This will allow the details to take up the remaining space */
}

h2 {
  font-size: 30px; /* increase font size to make the name bigger */
}

.restaurant-image {
  width: 200px; /* adjust as needed */
  height: auto;
}

.address {
  font-size: 0.8em; /* adjust as needed */
}
</style>

  