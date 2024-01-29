<template>
  <div class="cart-overlay">
    <div class="cart-header">
      <button class="close-button" @click="closeCart">X</button>
      <h1>Cart</h1>
    </div>
    <div class="cart-content">
      <ItemCard
        v-for="item in OrderStore.cartItems"
        :key="item.id"
        :item="item"
        @item-update="handleItemUpdate"
/>
      <div class="total-price">Total: {{ totalPrice }} €</div>
      <button v-if="customerStore.isLoggedIn" class="orderButton" @click="createOrder">Order Now!</button>
    </div>
  </div>
</template>

<script setup>
import { computed, defineEmits } from 'vue';
import { useOrderStore } from '@/stores/OrderStore';
import ItemCard from './itemCard.vue'; // Adjust the path as necessary
import { useCustomerStore } from '@/stores/CustomerStore';
import { useToast } from 'vue-toastification';
const OrderStore = useOrderStore();
const customerStore = useCustomerStore();

// Computed property to calculate the total price
const totalPrice = computed(() => {
  return OrderStore.cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ).toFixed(2);
});

const handleItemUpdate = ({ id, quantity, specialRequests }) => {
  const itemIndex = OrderStore.cartItems.findIndex(item => item.id === id);
  if (itemIndex !== -1) {
    const item = OrderStore.cartItems[itemIndex];
    item.quantity = quantity;
    item.specialRequests = specialRequests;

    if (quantity === 0) {
      // Remove the item from the cart if quantity is 0
      OrderStore.cartItems.splice(itemIndex, 1);
    }
    // No need to call recalculateTotalPrice() since totalPrice is a computed property
  }
};

const recalculateTotalPrice = () => {
  totalPrice.value = OrderStore.cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ).toFixed(2);
};



const emit = defineEmits(['close-cart']);

const closeCart = () => {
  emit('close-cart');
};

const createOrderData = () => {
  if (OrderStore.cartItems.length === 0) {
    alert("Your cart is empty.");
    return null;
  }

  // Use the restaurantId from the first item in the cart
  const restaurantId = OrderStore.cartItems[0].restaurantId;

  return {
    customerUserName: customerStore.userName,
    restaurantId: restaurantId,  // Use the restaurantId from the cart item
    items: OrderStore.cartItems.map(item => ({
      itemId: item.id,
      quantity: item.quantity,
      specialRequests: item.specialRequests || '',
      price: item.price
    }))
  };
};


const createOrder = async () => {
  const toast = useToast();
  const orderData = createOrderData();

  if (!orderData) {
    toast.error("Order data is not available.");
    return;
  }

  console.log("Order Data:", orderData);

  try {
    const response = await fetch('http://localhost:3000/createOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();
    console.log(data);

    OrderStore.cartItems = [];
    closeCart();

    toast.success("Order placed successfully!");

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    toast.error("Failed to place the order. Please try again.");
  }
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

  .total-price {
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px; /* Adjust as necessary */
  align-self: center; /* Center the total price within the cart-content */
}
  
  
    </style>
  
