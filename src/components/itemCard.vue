<template>
  <div v-if="item" class="item-card">
    <div class="card-header">
      <h3 class="item-title">{{ item.name }}</h3>
      <span class="item-price">{{ scaledPrice }} €</span>
    </div>
    <div class="controls-container">
      <input type="text" class="special-requests" placeholder="Special Requests">
      <div class="quantity-control">
        <button class="minus-button" @click="decrement">−</button>
        <input type="number" class="quantity-field" :value="quantity" readonly />
        <button class="plus-button" @click="increment">+</button>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, computed, defineProps, watch } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
});

const quantity = ref(props.item.quantity || 0);

// Computed property for scaled price
const scaledPrice = computed(() => {
  return (props.item.price * quantity.value).toFixed(2); // Fixes the price to 2 decimal places
});

const increment = () => {
  quantity.value++;
};

const decrement = () => {
  if (quantity.value > 0) {
    quantity.value--;
  }
};

// Example of how you might emit the scaled price to a parent component
// Define emits
const emit = defineEmits(['updateScaledPrice']);

// Watcher to emit scaled price whenever it changes
watch(scaledPrice, (newValue) => {
  emit('updateScaledPrice', newValue);
});
</script>

<style scoped>
.item-card {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 300px; /* Adjust width as needed */
  box-sizing: border-box;
  background-color: white;
  margin-bottom: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 6px; /* Space between header and controls */
}

.item-title {
  font-size: 17px;
  font-weight: bold;
}

.item-price {
  font-size: 17px;
  font-weight: bold;
}

.controls-container {
  display: flex;
  justify-content: space-between; /* Aligns children to the sides */
  width: 100%;
  align-items: center; /* Keeps items aligned at their center */
}

.special-requests {
  width: calc(50% - 10px); /* Adjusted to take up half of the container width */
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.quantity-control {
  display: flex;
  align-items: center;
  background-color: lightgrey;
  border-radius: 5px;
  overflow: hidden;
}

.plus-button, .minus-button {
  background-color: inherit;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
}

.quantity-field {
  width: 42px;
  text-align: center;
  border: none;
  background-color: inherit;
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: textfield;
}

.quantity-field::-webkit-inner-spin-button, 
.quantity-field::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity-field::-moz-focus-inner {
  border: 0;
}
</style>
