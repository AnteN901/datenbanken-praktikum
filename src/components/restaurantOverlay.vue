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
      <div class="item-card-container">
        <restaurantOverlayItems v-for="item in restaurantStore.items" :key="item.id" :item="item" @updateQuantity="updateItemQuantity" class="itemCard"/>
      </div>
      <button v-if="customerStore.isLoggedIn" class="add-to-cart-button" @click="addToCart">Add to Cart</button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, onMounted, ref } from 'vue';
import { useOrderStore } from '@/stores/OrderStore';
import { useRestaurantStore } from '@/stores/RestaurantStore';
import restaurantOverlayItems from './restaurantOverlayItems.vue';
import {useCustomerStore} from '@/stores/CustomerStore';

const restaurantStore = useRestaurantStore();
const selectedRestaurant = useOrderStore().selectedRestaurant;
const OrderStore = useOrderStore();
const customerStore = useCustomerStore();
const emit = defineEmits(['close']);

const itemQuantities = ref({});

const emitCloseEvent = () => {
  emit('close', false);
};

const updateItemQuantity = ({ id, price, name, quantity }) => {
  itemQuantities.value[id] = { id, price, name, quantity };
};

const addToCart = () => {
  const itemsToAdd = Object.values(itemQuantities.value)
    .filter(item => item.quantity > 0)
    .map(item => ({ ...item, restaurantId: selectedRestaurant.id }));

  console.log(itemsToAdd); 
  OrderStore.cartItems = [...OrderStore.cartItems, ...itemsToAdd];
  console.log(OrderStore.cartItems);
};

const getImageUrl = (imagePath) => {
  const baseUrl = 'http://localhost:3000';
  return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

onMounted(() => {
  if (selectedRestaurant) {
    fetchItems(selectedRestaurant.id);
  }
});

const fetchItems = async (restaurantId) => {
  await restaurantStore.getRestaurantItems(restaurantId);
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
    /* Allow vertical scrolling */
    overflow-y: auto;
    /* Hide scrollbar for Webkit browsers */
    &::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge, and Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
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
}.itemCard {
  margin-top: 15px; /* adjust as needed */
}

/* new styles */

.item-card-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.add-to-cart-button {
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

  .add-to-cart-button:hover {
      background-color: #45a049; /* Slightly darker green on hover */
  }
</style>

  