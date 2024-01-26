<template>
  <div class="container">
    <div class="buttons-container">
      <button v-if="showBestellHistorieBtn" @click="bestellHisorieClicked" class="orderHistory-button">Bestellübersicht</button>
    </div>

    <div v-show="visibleWarenkorb || visibleBestHist" class="text-fields-container">
      <div class="text-fields">
        <ul v-if="visibleBestHist">
          <li v-for="order in customerOrders" :key="order.id">
            <p>Status: {{ order.status }}</p>
            <p>Order Date: {{ order.created_at }}</p>
            <p>Order Id: {{ order.order_id }} </p>
          </li>
        </ul>
      </div>
      <div class="buttons-bottom">
        <button v-if="showBackButton" @click="backClicked" class="back-button">Back</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useCustomerStore } from '@/stores/CustomerStore';

const customerStore = useCustomerStore();

const showBestellHistorieBtn = ref(true);
const showBackButton = ref(false);
const visibleBestHist = ref(false);
const visibleWarenkorb = ref(false);
const customerOrders = ref([]);

const bestellHisorieClicked = async () => {
  console.log('Bestellübersicht button clicked');
  showBestellHistorieBtn.value = false;
  visibleBestHist.value = true;
  showBackButton.value = true; 


  const username = customerStore.userName; 
  try {
    const response = await axios.get(`http://localhost:3000/getCustomerOrders/${username}`);
    customerOrders.value = response.data;
  } catch (error) {
    console.error('Error fetching customer orders:', error);
  }
};

const backClicked = () => {
  console.log('Back button clicked');
  showBestellHistorieBtn.value = true;
  showBackButton.value = false; 
  visibleBestHist.value = false;
};

</script>

<style scoped>
.text-fields-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  width: calc(100% - 40px);
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.text-fields {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
}

.buttons-bottom {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.back-button, .orderHistory-button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #7700fe;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 10px;
}

.back-button:hover, .orderHistory-button:hover {
  background-color: #9765d1;
}

.text-field {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  font-size: 16px;
  box-sizing: border-box;
}
</style>

