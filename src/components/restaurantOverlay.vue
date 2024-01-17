<template>
    <div class="overlay" v-if="selectedRestaurant">
      <div class="overlay-content">
        <button class="close-button" @click="emitCloseEvent">X</button>
        <div class="restaurant-info">
          <h2>{{ selectedRestaurant.name }}</h2>
          <img :src="selectedRestaurant.image" alt="Restaurant Image" class="restaurant-image">
          <p><strong>Address:</strong> {{ selectedRestaurant.address }}</p>
          <p>{{ selectedRestaurant.description }}</p>
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
      /* Additional styling for the restaurant info as needed */
  }
  
  .restaurant-image {
      width: 100%;
      max-width: 400px;
      margin-bottom: 20px;
  }
  </style>
  