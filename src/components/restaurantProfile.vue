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
const shopdescription = ref('');
const image = ref('');
const category = ref('');

const insertItem = ref(false);
const deleteItem = ref(false);
const showHistory = ref(false)
const showDescription = ref(false);
const insertRadius = ref(false);

const radius = ref(0);
const radiusMode = ref(false);

const restaurantOrders = ref([]);

const insertHours = ref(false);
const dateMode = ref(false);
const openingH = ref(0);
const openingM = ref(0);
const endH = ref(0);
const endM = ref(0);
const day = ref(1);


onMounted(() => {
  getItemListe();
getShopDescription();
});

const getShopDescription = async () => {
  const username = customerStore.userName;
  try {
    const response = await axios.get(`http://localhost:3000/getShopDescription?username=${username}`);
    
    shopdescription.value = response.data.description;
    
  } catch (error) {
    console.error('Error fetching shop description:', error);
  }
};

const toggleDeleteItem = () =>{
  deleteItem.value = !deleteItem.value;
  insertItem.value = false;
  showHistory.value = false;
  insertRadius.value = false;
  insertHours.value = false;
showDescription.value = false;
  }

const toggleInsertItem = () =>{
  insertItem.value = !insertItem.value;
  showHistory.value = false;
  deleteItem.value = false;
  insertRadius.value = false;
  insertHours.value = false;
showDescription.value = false;
}

const toggleDescription = () => {
  showDescription.value = !showDescription.value;
  showHistory.value = false;
  deleteItem.value = false;
  insertRadius.value = false;
  insertHours.value = false;
  insertItem.value = false;
}

const toggleHistory = async () => {
  if (!showHistory.value) {
    await getOrders();
  }
  showHistory.value = !showHistory.value;
  insertItem.value = false;
  deleteItem.value =false;
  insertRadius.value = false;
  insertHours.value = false;
showDescription.value = false;
};

const toggleInsertRadius = () =>{
  insertRadius.value = !insertRadius.value;
  showHistory.value = false;
  deleteItem.value = false;
  insertItem.value = false;
  insertHours.value = false;
showDescription.value = false;
}

const toggleRadiusMode = () =>{
  radiusMode.value = !radiusMode.value 
}

const toggleInsertDate = () =>{
  insertHours.value = !insertHours.value;
  insertRadius.value = false;
  showHistory.value = false;
  deleteItem.value = false;
  insertItem.value = false;
showDescription.value = false;
}

const toggleDateMode = () =>{
  dateMode.value = !dateMode.value 
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
      id: order.item_id,
      quantity: order.quantity,
      note: order.note,
      item_name : order.item_name,
    });
  });

  // Convert map values to array
  const groupedOrdersArray = Array.from(groupedOrdersMap.values());

  // wir wird gezaubert um "neue bestellungen"->"zubereitungen"-> "abgeschlossen ODER storniert"
  const orderedStatus = ["in Bearbeitung", "In Zubereitung","abgeschlossen", "storniert"];
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
const updateShopDescription = async (description) => {
  const username = customerStore.userName;


  try {
    await axios.post('http://localhost:3000/set-description', { description, username });
    console.log('Shop description updated successfully');
  } catch (error) {
    console.error('Error accepting order:', error);
  }
};

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
//-------AB HIER LIEFERRADIUS
const addRadius = async (radius) => {
  const id = await getId();
  try {
    const response = await axios.post('http://localhost:3000/insertRadius', {
      restaurantId : id,
      radius : radius
    });
    if(response.data)
    {
      console.log("addRadius succes");
    }
  } catch (error) {
      console.log(error);
  }
  }

  const deleteRadius = async (radius) => {
  const id = await getId();
  try {
    const response = await axios.post('http://localhost:3000/deleteRadius', {
      restaurantId : id,
      radius : radius
    });
    if(response.data)
    {
      console.log("delete Radius succes");
    }
  } catch (error) {
      console.log(error);
  }
  }


//-------------BIS HIER---------------------
//------------HOURS-------------------------
const addHours = async (day,openingH,openingM,endH,endM) => {
  const id = await getId();
  
  const opening =(openingH < 10 ? '0' : '') + openingH + ':' + (openingM < 10 ? '0' : '') + openingM;
  const end = (endH < 10 ? '0' : '') + endH + ':' + (endM < 10 ? '0' : '') + endM;
  console.log(opening, end)

  try {
    const response = await axios.post('http://localhost:3000/insertHours', {
      restaurantId : id,
      day : day,
      opening : opening,
      end : end,
    });
    if(response.data)
    {
      console.log("add hours succes");
    }
  } catch (error) {
      console.log(error);
  }
  }

  const deleteHours = async (day) => {
  const id = await getId();
  try {
    const response = await axios.post('http://localhost:3000/deleteHours', {
      restaurantId : id,
      day : day
    });
    if(response.data)
    {
      console.log("delete hour succes");
    }
  } catch (error) {
      console.log(error);
  }
  }

//-----------BIS HIER-----------------------

const getStatusClass = (status) => {
  switch (status) {
    case "in Bearbeitung":
      return "in-bearbeitung";
    case "In Zubereitung":
      return "in-zubereitung";
    case "abgeschlossen":
      return "abgeschlossen";
    case "storniert":
      return "storniert";
    default:
      return ""; // Return an empty string or a default class if none of the cases match
  }
};


const validateRadius = () => {
  radius.value = radius.value.replace(/[^0-9]/g, '').slice(0, 5);
};


</script>

<template>
  <div class="main">
    <nav class="navbar">
    <ul class="nav-list">
       <li><button @click="toggleDescription">Change Description</button></li>
       <li><button @click="toggleHistory">History</button></li>
       <li><button @click="toggleInsertItem">Insert Item</button></li>
       <li><button @click="toggleInsertDate">Add Opening/Closing Time</button></li>
       <li><button @click="toggleInsertRadius">Add Radius</button></li>
       <li><button @click="toggleDeleteItem">Delete/Update Item</button></li>
    </ul>
</nav>


  <div class="form-container" v-show="insertItem">
  <h1>Insert item into menue</h1>
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
      <select v-model="category" class="form-input" required>
    <option value="Vorspeise">Vorspeise</option>
    <option value="Nachspeise">Nachspeise</option>
    <option value="Hauptspeise">Hauptspeise</option>
    <option value="Getränk">Getränk</option>
    </select >
    </div>

   
    <!-- Submit Button -->
    <div class="form-group">
      <button type="submit" class="submit-button">Insert Item</button>
    </div>
  </form>
  </div>
  
  <div v-show="showHistory" class="order-history">
  <h1>Bestellübersicht</h1>
  <div class="order-list-container">
    <div class="order-card" v-for="groupedOrder in groupedOrders" :key="groupedOrder.order_id">
      <div class="order-header">
        <div class="status-indicator" :class="getStatusClass(groupedOrder.status)">
          {{ groupedOrder.status }}
        </div>
        <p class="order-date">{{ groupedOrder.created_at }}</p>
      </div>
      <div class="item-grid">
        <div v-for="item in groupedOrder.items" :key="item.id" class="order-item">
          <div class="item-box">
            <p class="item-name">{{ item.item_name }}</p>
            <p class="item-quantity">Quantity: {{ item.quantity }}</p>
            <p class="item-note">Note: {{ item.note }}</p>
          </div>
        </div>
      </div>
      <div v-if="groupedOrder.status === 'in Bearbeitung'" class="buttons-container">
        <button @click="acceptOrder(groupedOrder)" class="accept-btn">Annehmen</button>
        <button @click="rejectOrder(groupedOrder)" class="decline-btn">Ablehnen</button>
      </div>
      <div v-if="groupedOrder.status === 'In Zubereitung'" class="buttons-container">
        <button @click="completeOrder(groupedOrder)" class="submit-button">Abschließen</button>
      </div>
    </div>
  </div>
</div>
<div v-show="deleteItem" class="form-group">
  <h1>Delete or Edit Items</h1>
  <div class="item-cards">
    <button @click="toggleUpdate()" class="accept-btn">Delete/Update Item</button>
    <div v-show="update">
      <div v-for="item in restaurantStore.items" :key="item.id" class="item-card">
        <div class="item-card-bg">
          <div class="item-card-content">
            <h3>{{ item.name }}</h3>
            <div class="item-actions">
              <button @click="removeItem(item.id)" class="decline-btn">Delete Item</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div v-show="!update" v-for="item in restaurantStore.items" :key="item.id" class="item-card">
        <div class="item-card-bg">
          <div class="item-card-content">
            <p>ID: {{ item.id }}</p>
            <div class="form-group">
              <label for="itemName" class="form-label">Item Name:</label>
              <input type="text" id="itemName" v-model="item.name" class="form-input" />
            </div>
            <div class="form-group">
              <label for="itemDescription" class="form-label">Item Description:</label>
              <input type="text" id="itemDescription" v-model="item.description" class="form-input" />
            </div>
            <div class="form-group">
              <label for="itemPrice" class="form-label">Item Price:</label>
              <input type="text" id="itemPrice" v-model="item.price" class="form-input" />
            </div>
            <div class="form-group">
              <label for="itemImage" class="form-label">Item Image:</label>
              <input type="text" id="itemImage" v-model="item.image" class="form-input" />
            </div>
            <div class="form-group">
              <label for="itemCategory" class="form-label">Item Category:</label>
              <select id="itemCategory" v-model="item.category" class="form-input">
                <option value="Vorspeise">Vorspeise</option>
                <option value="Nachspeise">Nachspeise</option>
                <option value="Hauptspeise">Hauptspeise</option>
                <option value="Getränk">Getränk</option>
              </select>
            </div>
            <button @click="updateItem(item.id, item.restaurant_id, item.name, item.description, item.price, item.image, item.category)" class="submit-button">Update Item</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  <div v-show="insertRadius" class="radius-section">
  <h1>Adjust the delivery radius</h1>
  <div class="radius-controls">
    <button @click="toggleRadiusMode()" class="radius-toggle-btn">Toggle Mode</button>
    <div class="radius-input-group">
      <label for="radius">Radius:</label>
      <input type="text" id="radius" v-model="radius" class="radius-input" @input="validateRadius">
    </div>
    <button @click="radiusMode ? deleteRadius(radius) : addRadius(radius)" class="radius-action-btn">
      {{ radiusMode ? 'Delete Radius' : 'Add Radius' }}
    </button>
  </div>
</div>

  <div v-show="insertHours">
  <button @click="toggleDateMode()" class="accept-btn">Add/Delete Opening Hours</button>
  <h1>Weekday (0-Sunday | 6-Saturday)</h1>
  <input type="number" min="0" max="6" step="1" v-model="day">
  <p v-if="!dateMode">
    Opening Time:
    <input type="number" min="0" max="23" step="1" v-model="openingH"> Hours
    <input type="number" min="0" max="59" step="1" v-model="openingM"> Minutes
  </p>
  <p v-if="!dateMode">
    Closing Time:
    <input type="number" min="0" max="23" step="1" v-model="endH"> Hours
    <input type="number" min="0" max="59" step="1" v-model="endM"> Minutes
  </p>
  <button @click="addHours(day,openingH,openingM,endH,endM)" class="submit-button" v-if="!dateMode">Add Hours</button>
  <button @click="deleteHours(day)" class="decline-btn" v-else>Delete Hours</button>
</div>
  <div v-show="showDescription">
  <h1>Change your restaurants description</h1>  
        <textarea type="text" id="description" v-model="shopdescription" class="description-input">
        </textarea>
  <button @click="updateShopDescription(shopdescription)" class="submit-button">Submit</button>
</div>
</div> 
</template>
      
  

<style scoped>
/* General layout and button styling */
/* Style for the navbar container */
.navbar {
  text-align: center;
  margin-top: 20px; /* Space from top */
  background-color: transparent;
}

.nav-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0 auto;
  background-color: #5262a3; /* Navbar background */
  border-radius: 20px;
  overflow: hidden; /* Ensure rounded corners for inner buttons */
}

.nav-list li {
  flex: 1; /* Distribute space evenly among list items */
}

.nav-list li button {
  background-color: #5262a3; /* Match navbar background */
  color: white;
  border: none;
  padding: 10px 15px;
  display: flex; /* Use flexbox for centering */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  width: 100%; /* Take up 100% width of the parent */
  height: 40px; /* Set a fixed height for all buttons */
  transition: background-color 0.3s;
}

.nav-list li button:hover {
  background-color: #6f7bb6; /* Lighter shade for hover */
}

/* Ensure other buttons retain their specific styles */
/* Reset for buttons to avoid global styling interference */
button {
  background-color: #4CAF50; /* Default green background for other buttons */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

/* Specific styles for submit, accept, and decline buttons */
.submit-button {
  background-color: #4CAF50; /* Keep your specific green color */
}

.accept-btn {
  background-color: #febe00; /* Specific yellow color */
}

.decline-btn {
  background-color: #fe5900; /* Specific orange color */
}


/* Form and input styling */
.form-container, .description-input, .item-cards {
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: white;
  max-width: 600px;
  width: calc(100% - 40px);
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-input, textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

/* Order history styling */
.order-history {
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px auto;
  max-width: 800px;
  width: calc(100% - 40px);
}

.order-card {
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 15px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.status-indicator {
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
}

/* Status colors */
.in-bearbeitung {
  background-color: #3498db; /* Blue */
}

.in-zubereitung {
  background-color: #f1c40f; /* Yellow */
}

.abgeschlossen {
  background-color: #27ae60; /* Green */
}

.storniert {
  background-color: #e74c3c; /* Red */
}

.order-date {
  color: #888;
}

.item-grid {
  display: flex;
  flex-direction: column;
}

.item-box {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.item-name, .item-quantity, .item-note {
  margin: 5px 0;
}

/* Hover effects for interactive elements */
.ui-buttons button:hover, .submit-button:hover, .accept-btn:hover, .decline-btn:hover {
  opacity: 0.9;
}

.radius-section {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.radius-controls {
  margin-top: 15px;
}

.radius-toggle-btn, .radius-action-btn {
  margin: 10px;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.radius-toggle-btn:hover, .radius-action-btn:hover {
  background-color: #0056b3;
}

.radius-input-group {
  margin: 15px 0;
}

.radius-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px; /* Adjust as needed */
  text-align: center;
}


</style>
