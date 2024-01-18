<template>
    <div class="cart-overlay">
      <div class="cart-header">
        <button class="close-button" @click="closeCart">X</button>
        <!-- ... -->
      </div>
      <div class="cart-content">
        <!-- ... -->
      </div>
    </div>
  </template>
  
<script setup>
  import { defineEmits } from 'vue';
  
  const emit = defineEmits(['close-cart']);
  
  const closeCart = () => {
    emit('close-cart');
  };
</script>

<style scoped>
.cart-overlay {
    position: fixed;
    top: 0;
    right: 0;
    width: 20%;
    height: 95%;
    margin-bottom: 5%;
    background-color: rgba(255, 255, 255, 0.95); /* Slight opacity */
    z-index: 9999;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1); /* Shadow on the left */
    border-left: 1px solid #ddd; /* Subtle border */
    transition: right 0.3s ease; /* Smooth transition for opening/closing */
    border-top-left-radius: 30px; /* Rounded top left corner */
    border-bottom-left-radius: 30px; /* Rounded bottom left corner */
}

.cart-header {
    background-color: #703bd9d9; /* As per your existing color */
    height: 80px;
    display: flex;
    justify-content: space-between; /* Aligns items with space in between */
    align-items: center;
    border-top-left-radius: 30px;
    padding: 10px;
    color: white; /* For text color in header */
}

.close-button {
    background-color: transparent;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: color 0.2s ease; /* Transition for hover effect */
}

.close-button:hover {
    color: #b691ffd9; /* Lighter color on hover */
}

.cart-content {
    background-color: white;
    padding: 15px; /* Added padding for inner content */
    overflow-y: auto; /* Allows scrolling for overflow content */
    height: calc(100% - 80px); /* Adjust height to account for header */
    /* Add other content styles as needed */
}

  </style>