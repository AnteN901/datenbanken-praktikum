<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useCustomerStore } from '@/stores/CustomerStore';
import { useRestaurantStore } from '@/stores/RestaurantStore';

const restaurantStore = useRestaurantStore();
const customerStore = useCustomerStore();

const name = ref('');
const price = ref(999.999);
const description = ref('');
const image = ref('');
const category = ref('');
const itemId = ref(9999999);

const insertItem = ref(false);
const deleteItem = ref(false);
const showHistory = ref(false)

const restaurantOrders = ref([]);


onMounted(() => {
  getItemListe();
});

const toggleDelete = () =>{
  deleteItem.value = !deleteItem.value;
  insertItem.value = false;
  showHistory.value = false;
  }

const toggleInsert = () =>{
  insertItem.value = !insertItem.value;
  showHistory.value = false;
  deleteItem.value = false;
}

const toggleHistory = async () => {
  if (!showHistory.value) {
    await getOrders();
  }
  showHistory.value = !showHistory.value;
  insertItem.value = false;
  deleteItem.value =false;
};

const getOrders = async() =>{
  const username = customerStore.userName; 
  try {
    const response = await axios.get(`http://localhost:3000/getRestaurantOrders/${username}`);
    restaurantOrders.value = response.data;
  } catch (error) {
    console.error('Error fetching Restaurant orders:', error);
  }
}


// AB HIER FÜR BESTELLHISTORIE ------------------------------------------------------------------
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

  try {
    await axios.post('http://localhost:3000/set-order-state', { orderId, status: 'In Zubereitung' });
    console.log('Order status updated successfully');
    await getOrders(); // Refresh order history
  } catch (error) {
    console.error('Error accepting order:', error);
  }
};

const rejectOrder = async (groupedOrder) => {
  const orderId = groupedOrder.order_id;

  try {
    await axios.post('http://localhost:3000/set-order-state', { orderId, status: 'storniert' });
    console.log('Order status updated successfully');
    await getOrders(); // Refresh order history
  } catch (error) {
    console.error('Error rejecting order:', error);
  }
};

const completeOrder = async (groupedOrder) => {
  const orderId = groupedOrder.order_id;

  try {
    await axios.post('http://localhost:3000/set-order-state', { orderId, status: 'abgeschlossen' });
    console.log('Order status updated successfully');
    await getOrders(); // Refresh order history
  } catch (error) {
    console.error('Error rejecting order:', error);
  }
};

// BIS HIER -----------------------------------------------------------------------
// AB HIER MANIPULATION VON ITEMS

const getId = async () =>
  {
    try{
        const response = await axios.get(`http://localhost:3000/getId?username=${customerStore.getUserName}`);
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

  const removeItem = async (itemId) => {
  const restaurantId = await getId();
  console.log('R_id: ',restaurantId, 'itemId:', itemId.value);
  try {
    const response = await axios.post('http://localhost:3000/deleteItem', {
      restaurantId : restaurantId,
      itemId : itemId,
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
const update = ref(false);

const toggleUpdate = async () => {
  update.value = !update.value
}

const updateItem = async (itemId, rId, name, description, price, image, category) =>
{
  //console.log("ItemId "+itemId+"rId "+rId+"name"+name+"description"+description+"price"+price+"image"+image+"category"+category);
  console.log("updateItem:"+itemId);
  try {
    const response = await axios.post('http://localhost:3000/updateItem', {
      itemId : itemId,
      restaurantId : rId,
      name : name,
      description : description,
      price : price,
      image : image,
      category : category,
    });
    if(response.success)
    {
      restaurantStore.getRestaurantItems(restaurantId);
    }
    
  } catch (error) {
      console.log("Test: "+error);
  }
}

//--------------BIS HIER--------------------
</script>

<template>
  <div>
    <button @click="toggleInsert" v-if="!insertItem">showInsertItem</button>
    <button @click="toggleInsert" v-else>hideInsertItem</button>
    <button @click="toggleHistory" v-if="!showHistory">showHistory</button>
    <button @click="toggleHistory" v-else>hideHistory</button> 
    <button @click="toggleDelete" v-if="!deleteItem">Delete/Update Item</button>
    <button @click="toggleDelete" v-else>Delete/Update Item</button>
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
            <div v-if="groupedOrder.status=='In Zubereitung'">
              <button @click="completeOrder(groupedOrder)">Abschließen</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="form-group" v-show="deleteItem">
    <div class="item-cards">
      <button @click="toggleUpdate()" class="update-btn">Delete/Update Item</button>
      <div v-show="update">
      <li v-for="item in restaurantStore.items" :key="item.id" class="item-card">
        <h3>{{ item.name }}</h3>
        <div class="item-actions">
          <button @click="removeItem(item.id)" class="delete-btn">Delete Item</button>
          </div>
      </li>
    </div>
    <div>
      <li v-show="!update" v-for="item in restaurantStore.items" :key="item.id" class="item-card">
        <p>ID: {{ item.id }}</p>
        <p>ItemName:  <input v-model="item.name"></p>
        <p>ItemDescription: <input v-model="item.description"></p>
        <p>ItemPrice: <input v-model="item.price" type="price"></p>
        <p>ItemImage: <input v-model="item.image"></p>
        <p>ItemCategory: <input v-model="item.category"></p>
        
        
        <button @click="updateItem(item.id, item.restaurant_id, item.name, item.description, item.price, item.image, item.category)" class="update-btn">Update Item</button>
          
      </li>
    </div>
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

.item-cards {
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