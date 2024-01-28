<template>
  <div class="cart-overlay">
    <div class="cart-header">
      <button class="close-button" @click="closeCart">X</button>
      <h1>Cart</h1>
    </div>
    <div class="cart-content">
      <ItemCard v-for="item in OrderStore.cartItems" :key="item.id" :item="item" />
      <button v-if="customerStore.isLoggedIn" class="orderButton" @click="createOrder">Order Now!</button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, onMounted } from 'vue';
import { useOrderStore } from '@/stores/OrderStore';
import ItemCard from './itemCard.vue'; // Make sure the path and component name are correct
import { useCustomerStore } from '@/stores/CustomerStore';
const customerStore = useCustomerStore();
const emit = defineEmits(['close-cart']);
const OrderStore = useOrderStore();

const closeCart = () => {
  emit('close-cart');
};

onMounted(() => {
  console.log(OrderStore.cartItems);
});
</script>


<style scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  right: 0;
  width: 20%;
  height: 95%;
  margin-bottom: 5%;
  background-color: rgba(255, 255, 255, 0.95);
  z-index: 9999;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  border-left: 1px solid #ddd;
  transition: right 0.3s ease;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
}

.cart-header {
  background-color: #703bd9d9;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 30px;
  padding: 10px;
  color: white;
}

.close-button {
  background-color: transparent;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-button:hover {
  color: #b691ffd9;
}

.cart-content {
  background-color: white;
  padding: 15px;
  overflow-y: auto;
  height: calc(100% - 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.orderButton {
      background-color: #4CAF50; /* Green background */
      color: white; /* White text */
      padding: 10px 20px; /* Padding for better button size */
      margin-top: 10px; /* Adjust top margin */
      border: none; /* Remove border */
      border-radius: 5px; /* Rounded corners */
      cursor: pointer; /* Cursor changes to pointer on hover */
      font-size: 16px; /* Increased font size */
      transition: background-color 0.3s; /* Smooth transition for hover effect */
  }

  .orderButton :hover {
      background-color: #45a049; /* Slightly darker green on hover */
  }
  
  
    </style>
  
