<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['restaurant']);
const emit = defineEmits(['click']); // Define the 'click' event

const getImageUrl = (imagePath) => {
  const baseUrl = 'http://localhost:3000';
  return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};


const onClick = () => {
  emit('click', props.restaurant); // Emit the 'click' event with the restaurant as the payload
  console.log(JSON.stringify(props.restaurant, null, 2) + " wurde geklickt");
  
};
</script>


<template>
  <div class="restaurantCard" @click="onClick">
    <div class="cardContent">
      <img class="cardImage" :src="getImageUrl(restaurant.image)" alt="Restaurant Image" @load="console.log(getImageUrl(restaurant.image))">
      <div class="cardText">
        <h2>{{ restaurant.name }}</h2>
        <p>{{restaurant.description}}</p>
      </div>
    </div>
  </div>  
</template>

<style>
.restaurantCard {
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: white;
  padding: 16px;
  margin: 16px;
  width: 600px; /* Adjust width as needed */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  transition: transform 0.3s ease-in-out;
}

.restaurantCard:hover {
  transform: scale(1.03);
}

.cardContent {
  display: flex;
}

.cardImage {
  width: 150px; /* Width of the image */
  height: 150px; /* Height of the image (making it square) */
  object-fit: cover;
  border-radius: 4px;
  margin-right: 10px; /* Adds some space to the right of the image */
}

.cardText {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>

