<template>
  <div class="order-history">
    <div class="buttons-container">
      <button
        v-if="showBestellHistorieBtn"
        @click="bestellHisorieClicked"
        class="orderHistory-button"
      >
        Bestellübersicht
      </button>
    </div>

    <div
      v-show="visibleWarenkorb || visibleBestHist"
      class="order-list-container"
    >
      <div
        class="order-card"
        v-for="groupedOrder in groupedOrders"
        :key="groupedOrder.order_id"
      >
        <div class="order-header">
          <div
            class="status-indicator"
            :class="getStatusClass(groupedOrder.status)"
          >
            {{ groupedOrder.status }}
          </div>
          <p class="order-date">{{ groupedOrder.created_at }}</p>
        </div>
        <div class="item-grid">
          <div
            v-for="item in groupedOrder.items"
            :key="item.id"
            class="order-item"
          >
            <div class="item-box">
              <p class="item-name">{{ item.item_name }}</p>
              <p class="item-quantity">Quantity: {{ item.quantity }}</p>
              <p class="item-note">Note: {{ item.note }}</p>
            </div>
          </div>
        </div>
        <div class="order-total">
              <strong>Total Price:</strong> {{ calculateTotalPrice(groupedOrder) }} €
        </div>
      </div>
    </div>

    <div class="buttons-bottom">
      <button v-if="showBackButton" @click="backClicked" class="back-button">
        Back
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useCustomerStore } from '@/stores/CustomerStore';

const customerStore = useCustomerStore();
const showBestellHistorieBtn = ref(true);
const showBackButton = ref(false);
const visibleBestHist = ref(false);
const visibleWarenkorb = ref(false);
const customerOrders = ref([]);

// Define calculateTotalPrice at the top level of the <script setup> block
const calculateTotalPrice = (order) => {
  return order.items.reduce((sum, item) => sum + (item.quantity * item.item_price), 0).toFixed(2);
};

const groupedOrders = computed(() => {
  const groupedOrdersMap = new Map();

  customerOrders.value.forEach(order => {
    if (!groupedOrdersMap.has(order.order_id)) {
      groupedOrdersMap.set(order.order_id, {
        order_id: order.order_id,
        status: order.status,
        created_at: order.created_at,
        items: [],
      });
    }
    groupedOrdersMap.get(order.order_id).items.push({
      id: order.item_id,
      quantity: order.quantity,
      note: order.note,
      item_name: order.item_name,
      item_price: order.item_price,
    });
  });

  const groupedOrdersArray = Array.from(groupedOrdersMap.values());

  const orderedStatus = ["In Zubereitung", "in Bearbeitung", "abgeschlossen", "storniert"];
  groupedOrdersArray.sort((a, b) => {
    const indexA = orderedStatus.indexOf(a.status);
    const indexB = orderedStatus.indexOf(b.status);
    if (indexA <= 1 || indexB <= 1) {
      return indexA - indexB;
    } else {
      return 2; // Treat all other statuses as equal
    }
  });

  return groupedOrdersArray;
});

const bestellHisorieClicked = async () => {
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
  showBestellHistorieBtn.value = true;
  showBackButton.value = false;
  visibleBestHist.value = false;
};

const getStatusClass = (status) => {
  switch (status) {
    case "in Bearbeitung": return "in-bearbeitung";
    case "In Zubereitung": return "in-zubereitung";
    case "abgeschlossen": return "abgeschlossen";
    case "storniert": return "storniert";
    default: return "";
  }
};
</script>


<style scoped>
.order-history {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  width: 90%;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.buttons-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.orderHistory-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #4CAF50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.orderHistory-button:hover {
  background-color: #45a049;
}

.order-list-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.order-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20px 0;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}

.status-indicator {
  padding: 6px 12px;
  border-radius: 5px;
  font-weight: bold;
  color: white;
}

.in-bearbeitung {
  background-color: #3498db; /* Light Blue */
}

.in-zubereitung {
  background-color: #f1c40f; /* Dark Yellow */
}

.abgeschlossen {
  background-color: #27ae60; /* Green */
}

.storniert {
  background-color: #e74c3c; /* Red */
}

.order-date {
  font-size: 14px;
  color: #888;
}

.item-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* Increased gap for larger item boxes */
  justify-content: space-between;
}

.order-item {
  flex-basis: calc(33.33% - 20px); /* 3 items per row, adjust as needed */
}

.item-box {
  width: 300px; /* Set a fixed width in pixels for uniform size */
  background-color: white;
  padding: 20px; /* Increased padding for larger item boxes */
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.item-name {
  font-size: 18px; /* Larger font size for item names */
  font-weight: bold;
}

.item-quantity {
  font-size: 16px; /* Larger font size for quantity */
  color: #666;
}

.item-note {
  font-size: 16px; /* Larger font size for item notes */
  color: #888;
}
.buttons-bottom {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.back-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #4CAF50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #45a049;
}
</style>

