<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useCustomerStore } from '@/stores/CustomerStore';

const customerStore = useCustomerStore();
const name = ref('');
const price = ref('');
const description = ref('');
const image = ref('');
const insertItem = ref(false);
const showHistory = ref(false)
const category = ref('');
const restaurantOrders = ref([]);

const toggleInsert = () =>{
  insertItem.value = !insertItem.value;
}
const toggleHistory = () =>{
  if (!showHistory.value) {
    getOrders();
  }
  showHistory.value = !showHistory.value;
}

const getOrders = async() =>{
  const username = customerStore.userName; 
  try {
    const response = await axios.get(`http://localhost:3000/getRestaurantOrders/${username}`);
    restaurantOrders.value = response.data;
  } catch (error) {
    console.error('Error fetching Restaurant orders:', error);
  }
}

const groupedOrders = computed(() => {
  const groupedOrdersMap = new Map();
  
  // Group orders by order_id
  restaurantOrders.value.forEach(order => {
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

  // Convert map values to array
  return Array.from(groupedOrdersMap.values());
});

const acceptOrder = async (groupedOrder) => {
  const orderId = groupedOrder.order_id;

  axios.post('http://localhost:3000/set-order-state', { orderId, status: 'In Zubereitung' })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Error accepting order:', error);
    });
};

const rejectOrder = async (groupedOrder) => {
  const orderId = groupedOrder.order_id;

  axios.post('http://localhost:3000/set-order-state', { orderId, status: 'storniert' })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Error rejecting order:', error);
    });
};
const getId = async () =>
  {
    try{
        const response = await axios.get(`http://localhost:3000/getId?username=${customerStore.getUserName}`);
        console.log(response);
        return response.data;
    }
    catch(error)
    {
        console.log(error);
    }
  }

  const addItem = async () => {
  const id = await getId();
  console.log(id.id);
  try {
    const response = await axios.post('http://localhost:3000/insertItem', {
      name: name.value,
      price: price.value,
      description: description.value,
      image: image.value,
      category : category.value,
      restaurantId : id.id,
    });
    console.log('Response:', response.data);
  } catch (error) {
      console.log(error);
  }
  }
  
</script>

<template>
  <div>
    <button @click="toggleInsert" v-if="!insertItem">showInsertItem</button>
    <button @click="toggleInsert" v-else>hideInsertItem</button>
    <button @click="toggleHistory" v-if="!showHistory">showHistory</button>
    <button @click="toggleHistory" v-else>hideHistory</button> 
  <div class="form-container" v-show="insertItem">
  <h1>Füge Item hinzu</h1>
  <form @submit.prevent="addItem()" class="item-form">
    <!-- name -->
    <div class="form-group">
      <label for="name" class="form-label">Name:</label>
      <input type="text" id="name" v-model="name" class="form-input" required />
    </div>

    <!-- Price Input -->
    <div class="form-group">
      <label for="price" class="form-label">Preis:</label>
      <input type="price" id="price" v-model="price" class="form-input" required />
    </div>

    <!-- Description Inputs -->
    <div class="form-group">
      <label for="description" class="form-label">Beschreibung:</label>
      <input type="text" id="description" v-model="description" class="form-input" required />
    </div>

    <!-- Image Inputs -->
    <div class="form-group">
      <label for="image" class="form-label">Bild:</label>
      <input type="text" id="image" v-model="image" class="form-input" required />
    </div>

     <!-- category Inputs -->
     <div class="form-group">
      <label for="category" class="form-label">Kategorie:</label>
      <input type="text" id="category" v-model="category" class="form-input" placeholder="Vorspeise, Hauptspeise, Nachspeise" required />
    </div>

   
    <!-- Submit Button -->
    <div class="form-group">
      <button type="submit" class="submit-button">Insert Item</button>
    </div>
  </form>
  </div>
  
  <div v-show="showHistory">
    <h1>Bestellübersicht</h1>
    <div class="text-fields">
        <ul v-if="showHistory">
          <li v-for="groupedOrder in groupedOrders" :key="groupedOrder.order_id" class="text-fields-container">
            <p>Status: {{ groupedOrder.status }}, {{ groupedOrder.created_at }}, {{ groupedOrder.order_id }}</p>
            <!-- Iterate over items for the current order -->
            <ul>
              <li v-for="item in groupedOrder.items" :key="item.id">
                <p>Item Id: {{ item.id }}</p>
                <p>Quantity: {{ item.quantity }}</p>
                <p>Note: {{ item.note }}</p>
                <!-- Add more item details as needed -->
              </li>
            </ul>
            <div v-if="groupedOrder.status=='in Bearbeitung'">
              <button @click="acceptOrder(groupedOrder)">Annehmen</button>
              <button @click="rejectOrder(groupedOrder)">Ablehnen</button>
            </div>
          </li>
        </ul>
      </div>
  
  </div>
  </div>
</template>

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
</style>