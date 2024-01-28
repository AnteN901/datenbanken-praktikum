<template>
    <div class="item-card">
      <img :src="item.image" alt="Item Image" class="item-image" />
      <div class="item-details">
        <h3 class="item-title">{{ item.name }}</h3>
        <p class="item-description">{{ item.description }}</p>
        <div class="item-footer">
          <div class="price-and-control">
            <span class="item-price">{{ item.price }} €</span>
            <div class="quantity-control">
              <button class="minus-button" @click="decrement">−</button>
              <input type="number" class="quantity-field" :value="quantity" readonly />
              <button class="plus-button" @click="increment">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    item: {
      type: Object,
      required: true
    }
  });
  
  const emits = defineEmits(['updateQuantity']);
  
  const quantity = ref(0);
  
  watch(quantity, (newQuantity) => {
    emits('updateQuantity', { id: props.item.id, name: props.item.name, quantity: newQuantity });
  });
  
  const increment = () => {
    quantity.value++;
  };
  
  const decrement = () => {
    if (quantity.value > 0) {
      quantity.value--;
    }
  };
  </script>

<style scoped>
.item-card {
    display: flex;
    align-items: start; /* Align items to the start instead of center */
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    position: relative;
    width: 120%;
    box-sizing: border-box;
    min-height: 100px; /* Adjust the min-height to accommodate content */
}

.item-image {
    width: 72px;
    height: 72px;
    object-fit: cover;
    margin-right: 12px;
}

.item-details {
    flex: 1;
}

.item-title {
    font-size: 17px;
    font-weight: bold;
    margin-bottom: 6px;
}

.item-description {
    font-size: 14px;
    color: #666;
    margin-bottom: 12px;
}

.price-and-control {
    display: flex;
    align-items: center;
    flex-direction: column;
    position: absolute;
    right: 12px;
    top: 10px; /* Adjust top position */
}

.item-price {
    font-size: 17px;
    font-weight: bold;
    margin-bottom: 6px;
}

.quantity-control {
    display: flex;
    align-items: center;
    background-color: lightgrey;
    border-radius: 5px;
    overflow: hidden;
    margin-top: 6px; /* Add margin to separate from price */
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


