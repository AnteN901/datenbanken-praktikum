<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['restaurant']);

</script>


<template>
  <div class="restaurantCard">
    <div class="cardContent">
      <img class="cardImage" src="../assets/Firefox.png" alt="Bild" />
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
  padding: 16px;
  margin: 16px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  transition: transform 0.3s ease-in-out;
}

.restaurantCard:hover {
  transform: scale(1.05);
}

.cardContent {
  display: flex;
  flex-direction: row;
}

.cardImage {
  width: 50%;
  border-radius: 4px;
}
</style>