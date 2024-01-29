<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useCustomerStore } from '@/stores/CustomerStore';
import { useRestaurantStore } from '@/stores/RestaurantStore';

const customerStore = useCustomerStore();
const restaurantStore = useRestaurantStore();
const name = ref('');
const price = ref('');
const description = ref('');
const image = ref('');
const insertItem = ref(false);
const showHistory = ref(false);
const deleteItem = ref(false);
const category = ref('');
const restaurantOrders = ref([]);
const itemId = ref(99999);


onMounted(() => {
  getItemListe();
});

const toggleInsert = () =>{
  insertItem.value = !insertItem.value;
}
const toggleHistory = () =>{
  if (!showHistory.value) {
    getOrders();
  }
  showHistory.value = !showHistory.value;
}
const toggleDelte = () =>{
  deleteItem.value = !deleteItem.value;
  
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

const getId = async () =>
  {
    try{
        const response = await axios.get(`http://localhost:3000/getId?username=${customerStore.getUserName}`);
        console.log('Respondes from getId: ',response.data.id);
        return response.data.id;
    }
    catch(error)
    {
        console.log(error);
    }
  }

  const addItem = async () => {
  const id = await getId();
  try {
    const response = await axios.post('http://localhost:3000/insertItem', {
      name: name.value,
      price: price.value,
      description: description.value,
      image: image.value,
      category : category.value,
      restaurantId : id,
    });
    if(response.data)
    {
      restaurantStore.getRestaurantItems(id);
    }
  } catch (error) {
      console.log(error);
  }
  }  
  
  const removeItem = async () => {
  const restaurantId = await getId();
  console.log('R_id: ',restaurantId, 'itemId:', itemId.value);
  try {
    const response = await axios.post('http://localhost:3000/deleteItem', {
      restaurantId : restaurantId,
      itemId : itemId.value,
    });
    if(response.data)
    {
      restaurantStore.getRestaurantItems(restaurantId);
    }
    
  } catch (error) {
      console.log(error);
  }
  }

  const getItemListe = async () =>{
    const restaurantId = await getId();
    console.log('R_id: ',restaurantId);
    restaurantStore.getRestaurantItems(restaurantId);
  }



  
</script>

<template>
  <div>
    <button @click="toggleInsert" v-if="!insertItem">showInsertItem</button>
    <button @click="toggleInsert" v-else>hideInsertItem</button>
    <button @click="toggleHistory" v-if="!showHistory">showHistory</button>
    <button @click="toggleHistory" v-else>hideHistory</button> 
    <button @click="toggleDelte" v-if="!deleteItem">showDeleteItem</button>
    <button @click="toggleDelte" v-else>hideDeleteItem</button>
  
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
  
  </div>

  <div class="form-container" v-show="deleteItem">
   <h1>Lösche Item</h1>
   <form @submit.prevent="removeItem()" class="item-form">
    
    <!-- id -->
    <div class="form-group">
      <label for="id" class="form-label">Item ID:</label>
      <input type="number" id="itemId" v-model="itemId" class="form-input" required />
    </div>
   
    <!-- Submit Button -->
    <div class="form-group">
      <button type="submit" class="submit-button">Delete Item</button>
    </div>

    <div class="form-group">
      <li v-for="item in restaurantStore.items" :key="item.id">
          <p>ID: {{ item.id }}</p>
        <p>Name: {{ item.name }}</p>
      </li>
    </div>
  </form>
        
   </div>
   </div>
</template>

