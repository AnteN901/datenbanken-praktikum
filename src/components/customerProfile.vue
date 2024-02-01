<template>
  <div class="container">
    <div class="buttons-container">
      <button v-if="showBestellHistorieBtn" @click="bestellHisorieClicked" class="orderHistory-button">Bestellübersicht</button>
    </div>

    <div v-show="visibleWarenkorb || visibleBestHist" class="text-fields-container">
      <div class="text-fields">
        <ul v-if="visibleBestHist">
          <li v-for="groupedOrder in groupedOrders" :key="groupedOrder.order_id">
            <p>Status: {{ groupedOrder.status }}, {{ groupedOrder.created_at }}</p>
            <!-- Iterate over items for the current order -->
            <ul>
              <li v-for="item in groupedOrder.items" :key="item.id">
                <p>Item Id: {{ item.id }}</p>
                <p>Quantity: {{ item.quantity }}</p>
                <p>Note: {{ item.note }}</p>
                <!-- Add more item details as needed -->
              </li>
            </ul>
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
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useCustomerStore } from '@/stores/CustomerStore';

const customerStore = useCustomerStore();

const showBestellHistorieBtn = ref(true);
const showBackButton = ref(false);
const visibleBestHist = ref(false);
const visibleWarenkorb = ref(false);
const customerOrders = ref([]);

const groupedOrders = computed(() => {
  const groupedOrdersMap = new Map();
  
  // Group orders by order_id
  customerOrders.value.forEach(order => {
    if (!groupedOrdersMap.has(order.order_id)) {
      groupedOrdersMap.set(order.order_id, {
        order_id: order.order_id,
        status: order.status,
        created_at: order.created_at,
        items: [],
      });
    }
    // Add item to the corresponding order
    groupedOrdersMap.get(order.order_id).items.push({
      id: order.id,
      quantity: order.quantity,
      note: order.note,
      // Add more item details as needed
    });
  });
  const groupedOrdersArray = Array.from(groupedOrdersMap.values());

  const orderedStatus = ["in Bearbeitung", "In Zubereitung","abgeschlossen", "storniert"];
  groupedOrdersArray.sort((a, b) => {
  const indexA = orderedStatus.indexOf(a.status);
  const indexB = orderedStatus.indexOf(b.status);

  if (indexA <= 1 || indexB <= 1) {
      return -1; // funktion geklaut aus restaurantProfile nur, dass hier egal ist welche reihenfolge bearbeitung/zubereitung haben
    } else {
      return 1; // Treat all other statuses as equal
    }
  });

  return groupedOrdersArray;
});

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

