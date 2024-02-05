<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useCustomerStore } from '@/stores/CustomerStore';
import { useRestaurantStore } from '@/stores/RestaurantStore';
import { useToast } from 'vue-toastification'; 

const restaurantStore = useRestaurantStore();
const customerStore = useCustomerStore();

const toast = useToast();

const name = ref('');
const price = ref(999.999);
const description = ref('');
const shopdescription = ref('');
const image = ref('');
const category = ref('');

const insertItem = ref(false);
const selectedItem = ref({
  id: null,
  name: '',
  price: 0,
  description: '',
  image: '',
  category: ''
});
const deleteItem = ref(false);

const showHistory = ref(false)
const showDescription = ref(false);

const insertRadius = ref(false);

const radius = ref(0);
const deliveryRadius = ref([]);
const radiusMode = ref(false);

const restaurantOrders = ref([]);

const insertHours = ref(false);
const dateMode = ref(false);
const openingH = ref(0);
const openingM = ref(0);
const endH = ref(0);
const endM = ref(0);
const day = ref(1);

const isPPUploaded = ref(false);
const isFPUploaded = ref(false);

onMounted(() => {
  getItemListe();
getShopDescription();
getDeliveryRadius();
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
  isFPUploaded.value = false;
  }

const toggleInsertItem = () =>{
  insertItem.value = !insertItem.value;
  showHistory.value = false;
  deleteItem.value = false;
  insertRadius.value = false;
  insertHours.value = false;
  showDescription.value = false;
  isFPUploaded.value = false;
}

const toggleDescription = () => {
  showDescription.value = !showDescription.value;
  showHistory.value = false;
  deleteItem.value = false;
  insertRadius.value = false;
  insertHours.value = false;
  insertItem.value = false;
  isPPUploaded.value = false;
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
      item_price : order.item_price
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
    console.error('Error changing description', error);
  }
};

const calculateTotalPrice = (order) => {
  console.log(order);
  return order.items.reduce((sum, item) => {
    return sum + (item.quantity * item.item_price); // Assuming 'price' is a property of each item
  }, 0).toFixed(2); // Converts the total to a string with 2 decimal places
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
    console.error('Error completing order:', error);
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
      image: FPImagePath,
      category: category.value,
      restaurantId: id,
    });
    if (response.data) {
      restaurantStore.getRestaurantItems(id);
      toast.success('Item added successfully'); // Display a success toast
    }
  } catch (error) {
    console.log(error);
    toast.error('Failed to add item'); // Display an error toast
  }
  isFPUploaded.value = false;
}

const removeItem = async (itemId) => {
  const restaurantId = await getId();
  console.log('R_id: ', restaurantId, 'itemId:', itemId.value);
  try {
    const response = await axios.post('http://localhost:3000/deleteItem', {
      restaurantId: restaurantId,
      itemId: itemId,
    });
    if (response.data) {
      restaurantStore.getRestaurantItems(restaurantId);
      toast.success('Item removed successfully'); // Display a success toast
    }

  } catch (error) {
    console.log(error);
    toast.error('Failed to remove item'); // Display an error toast
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

const updateItem = async (itemId, rId, name, description, price, category, image) => {
  console.log("updateItem:" + itemId);
  try {
    const response = await axios.post('http://localhost:3000/updateItem', {
      itemId: itemId,
      restaurantId: rId,
      name: name,
      description: description,
      price: price,
      image: image,
      category: category,
    });
    if (response.data.success) {
      restaurantStore.getRestaurantItems(rId);
      toast.success('Item updated successfully'); // Display a success toast
    } else {
      toast.error('Failed to update item'); // Display an error toast
    }
  } catch (error) {
    toast.error('Failed to update item'); // Display an error toast
  }
  isFPUploaded.value = false;
}


//--------------BIS HIER--------------------
//-------AB HIER LIEFERRADIUS
const addRadius = async (radius) => {
  const id = await getId();
  try {
    await axios.post('http://localhost:3000/insertRadius', { restaurantId: id, radius: radius });
    toast.success('Radius added successfully');
    await getDeliveryRadius(); // Fetch updated radius list
  } catch (error) {
    console.error(error);
    toast.error('Error adding radius');
  }
};

const deleteRadius = async (radius) => {
  const id = await getId();
  try {
    await axios.post('http://localhost:3000/deleteRadius', { restaurantId: id, radius: radius });
    toast.success('Radius deleted successfully');
    await getDeliveryRadius(); // Fetch updated radius list
  } catch (error) {
    console.error(error);
    toast.error('Error deleting radius');
  }
};

const getDeliveryRadius = async () => {
  const id = await getId();
  try {
    const response = await axios.get(`http://localhost:3000/getDeliveryRadius?restaurantId=${id}`);
    deliveryRadius.value = response.data.radius;
  } catch (error) {
    console.error(error);
  }
};

//-------------BIS HIER---------------------
//------------HOURS-------------------------
const addHours = async (day, openingH, openingM, endH, endM) => {
  console.log("day"+ day + "openingH"+ openingH + "openingM"+ openingM + "endH"+ endH + "endM"+ endM)
  const id = await getId();
  const opening = (openingH < 10 ? '0' : '') + openingH + ':' + (openingM < 10 ? '0' : '') + openingM;
  const end = (endH < 10 ? '0' : '') + endH + ':' + (endM < 10 ? '0' : '') + endM;
  console.log(opening, end);

  try {
    const response = await axios.post('http://localhost:3000/insertHours', {
      restaurantId: id,
      day: day,
      opening: opening,
      end: end,
    });
    if (response.data) {
      console.log("add hours success");
      // Show a success toast
      toast.success('Hours added successfully');
    }
  } catch (error) {
    console.log(error);
    // Show an error toast
    toast.error('Error adding hours');
  }
}

const deleteHours = async (day) => {
  const id = await getId();
  try {
    console.log("day"+ day)
    const response = await axios.post('http://localhost:3000/deleteHours', {
      restaurantId: id,
      day: day,
    });
    if (response.data) {
      console.log("delete hour success");
      // Show a success toast
      toast.success('Hours deleted successfully');
    }
  } catch (error) {
    console.log(error);
    // Show an error toast
    toast.error('Error deleting hours');
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

let PPfileName = "";
let PPImagePath = ""; //filename of upload restaurant image
let FPfileName = "";
let FPImagePath = ""; //filename of upload food image

const handleDrop = function(event) {
  const files = event.dataTransfer.files;
  uploadFiles(files);
};
const handleFoodDrop = function(event) {
  const files = event.dataTransfer.files;
  uploadFoodFiles(files);
};


const handleDragOver = function(event) {
  event.dataTransfer.dropEffect = "copy";
};

const handleFileSelect = (event) => {
  const files = event.target.files;
  uploadFiles(files);
};


const uploadFiles = function(files) {
  const formData = new FormData();
  formData.append("file", files[0]);
  PPfileName = files[0].name;
  PPImagePath = "/images/uploadedImages/" + PPfileName;
  console.log(PPImagePath)
  axios.post("http://localhost:3000/api/upload", formData)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error("Error uploading file:", error);
    });
  isPPUploaded.value = true;
};

const uploadFoodFiles = function(files) {
  const formData = new FormData();
  formData.append("file", files[0]);
  FPfileName = files[0].name;
  FPImagePath = "/images/uploadedImages/" + FPfileName;
  console.log(FPImagePath)
  axios.post("http://localhost:3000/api/upload", formData)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error("Error uploading file:", error);
    });
  isFPUploaded.value = true;
};

const updateShopProfilePicture = async () =>{
  const username = customerStore.userName;
  const image = PPImagePath;
  console.log(username, PPImagePath);
  try {
    await axios.post('http://localhost:3000/set-path-to-pp', { image, username });
    console.log('Shop picture updated successfully');
  } catch (error) {
    console.error('Error updating picture:', error);
  }
  isPPUploaded.value = false;
};


</script>

<template>
  <div class="main">
    <nav class="navbar">
      <ul class="nav-list">
        <li><button @click="toggleDescription">Change Description/Picture</button></li>
        <li><button @click="toggleHistory">History</button></li>
        <li><button @click="toggleInsertDate">Add Opening/Closing Time</button></li>
        <li><button @click="toggleInsertRadius">Add Radius</button></li>
        <li><button @click="toggleInsertItem">Insert Item</button></li>
        <li><button @click="toggleDeleteItem">Delete/Update Item</button></li>
      </ul>
    </nav>

    <div class="form-container" v-show="insertItem">
      <h1>Insert item into menu</h1>
      <form @submit.prevent="addItem()" class="item-form">
        <!-- Name Input -->
        <div class="form-group">
          <label for="name" class="form-label">Name:</label>
          <input type="text" id="name" v-model="name" class="form-input" required />
        </div>

        <!-- Price Input -->
        <div class="form-group">
          <label for="price" class="form-label">Preis:</label>
          <input type="number" id="price" v-model="price" class="form-input" required />
        </div>

        <!-- Description Input -->
        <div class="form-group">
          <label for="description" class="form-label">Beschreibung:</label>
          <input type="text" id="description" v-model="description" class="form-input" required />
        </div>

        <!-- Image Input -->
        <div class="form-group">
          <label for="image" class="form-label">Bild:</label>
          <div v-if="!isFPUploaded" class="file-upload" @drop.prevent="handleFoodDrop" @dragover.prevent="handleDragOver">
          <p>Upload Item Picture!</p>
          </div>
          <div v-if="isFPUploaded" class="file-uploaded">
          <p>File uploaded successfully!</p>
          <p>Filename: {{ FPfileName }}</p>
        </div>
        </div>

        <!-- Category Input -->
        <div class="form-group">
          <label for="category" class="form-label">Kategorie:</label>
          <select v-model="category" class="form-input" required>
            <option value="Vorspeise">Vorspeise</option>
            <option value="Nachspeise">Nachspeise</option>
            <option value="Hauptspeise">Hauptspeise</option>
            <option value="Getränk">Getränk</option>
          </select>
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
            <div class="order-total">
                  <strong>Total Price:</strong> {{ calculateTotalPrice(groupedOrder) }} €
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

    <div v-show="deleteItem" class="delete-item-section">
      <h1>Delete or Edit Items</h1>
      <button @click="toggleUpdate()" class="accept-btn">Delete/Update Item</button>
      <div v-show="update">
        <label for="itemSelector">Select an item:</label>
        <select v-model="selectedItem" id="itemSelector">
          <option v-for="item in restaurantStore.items" :key="item.id" :value="item" class="item-card">
            {{ item.name }}
          </option>
        </select>
          <div class="item-card-bg" v-if="selectedItem!=null">
            <div class="item-card-content">
              <h3>{{ selectedItem.name }}</h3>
              <div class="item-actions">
                <button @click="removeItem(selectedItem.id)" class="decline-btn">Delete Item</button>
              </div>
            </div>
        </div>
      </div>
      
      
      <div v-show="!update">
        <label for="itemSelector">Select an item:</label>
        <select v-model="selectedItem" id="itemSelector">
          <option v-for="item in restaurantStore.items" :key="item.id" :value="item" class="item-card">
            {{ item.name }}
          </option>
        </select>
         <div class="item-card-bg" v-if="selectedItem !==null">
            <div class="item-card-content">
              <p>ID: {{ selectedItem.id}}</p>
              <div class="form-group">
                <label for="itemName" class="form-label">Item Name:</label>
                <input type="text" id="itemName" v-model="selectedItem.name" class="form-input" />
              </div>
              <div class="form-group">
                <label for="itemDescription" class="form-label">Item Description:</label>
                <input type="text" id="itemDescription" v-model="selectedItem.description" class="form-input" />
              </div>
              <div class="form-group">
                <label for="itemPrice" class="form-label">Item Price:</label>
                <input type="number" id="itemPrice" v-model="selectedItem.price" class="form-input" />
              </div>
              <div class="form-group">
                <label for="itemImage" class="form-label">Item Image:</label>
                <div v-if="!isFPUploaded" class="file-upload" @drop.prevent="handleFoodDrop" @dragover.prevent="handleDragOver">
                  <p>Upload Item Picture!</p>
                </div>
                <div v-if="isFPUploaded" class="file-uploaded">
                  <p>File uploaded successfully!</p>
                  <p>Filename: {{ FPfileName }}</p>
                </div>
              </div>
              <div class="form-group">
                <label for="itemCategory" class="form-label">Item Category:</label>
                <select id="itemCategory" v-model="selectedItem.category" class="form-input">
                  <option value="Vorspeise">Vorspeise</option>
                  <option value="Nachspeise">Nachspeise</option>
                  <option value="Hauptspeise">Hauptspeise</option>
                  <option value="Getränk">Getränk</option>
                </select>
              </div>
              <button @click="updateItem(selectedItem.id, selectedItem.restaurant_id, selectedItem.name, selectedItem.description, selectedItem.price, selectedItem.category, FPfileName)" class="submit-button">Update Item</button>
            </div>
          </div>
        </div>
      </div>
    

    <div v-show="insertRadius" class="delivery-radius-section">
      <h1>Adjust the Delivery Radius</h1>
      <div class="delivery-radius-controls">
        <button @click="toggleRadiusMode()" class="delivery-radius-toggle-btn">Toggle Mode</button>
        <div class="delivery-radius-input-group">
          <label for="delivery-radius">Postal Code:</label>
          <div class="delivery-radius-input-wrapper">
            <input type="text" id="delivery-radius" v-model="radius" class="delivery-radius-input" @input="validateRadius" />
          </div>
        </div>
        <button @click="radiusMode ? deleteRadius(radius) : addRadius(radius)" class="delivery-radius-action-btn">
          {{ radiusMode ? 'Remove from Radius' : 'Add to Radius' }}
        </button>
      </div>
      <div class="delivery-radius-table">
        <h2>Current Delivery Radius</h2>
        <ul>
          <li v-for="code in deliveryRadius" :key="code">{{ code }}</li>
        </ul>
      </div>
    </div>

    <div v-show="insertHours" class="hours-section">
      <button @click="toggleDateMode()" class="accept-btn">Add/Delete Opening Hours</button>
      <h1>Weekday (0-Sunday | 6-Saturday)</h1>
      <select class="day_selector" v-model="day">
        <option value="7">Sunday</option>
        <option value="1">Monday</option>
        <option value="2">Tuesday</option>
        <option value="3">Wednesday</option>
        <option value="4">Thursday</option>
        <option value="5">Friday</option>
        <option value="6">Saturday</option>
      </select>
      <div v-if="!dateMode">
        <label>Opening Time:</label>
        <input class="time_adjustments" type="number" min="0" max="23" step="1" v-model="openingH"> Hours
        <input class="time_adjustments" type="number" min="0" max="59" step="1" v-model="openingM"> Minutes
        <label>Closing Time:</label>
        <input class="time_adjustments" type="number" min="0" max="23" step="1" v-model="endH"> Hours
        <input class="time_adjustments" type="number" min="0" max="59" step="1" v-model="endM"> Minutes
        <button @click="addHours(day,openingH,openingM,endH,endM)" class="submit-button">Add Hours</button>
      </div>
      <button @click="deleteHours(day)" class="decline-btn" v-if="dateMode">Delete Hours</button>
    </div>

    <div v-show="showDescription" class="description-section">
    <h1>Change your restaurant's description and picture!</h1>
    <textarea id="description" v-model="shopdescription" class="description-input" placeholder="Enter your restaurant's description here"></textarea>
    <div v-if="!isPPUploaded" class="file-upload" @drop.prevent="handleDrop" @dragover.prevent="handleDragOver">
      <p>Drag and drop your profile picture here, or click to select a file</p>
      <input type="file" @change="handleFileSelect" style="display: none;">
    </div>
    <div v-if="isPPUploaded" class="file-uploaded">
      <p>File uploaded successfully!</p>
      <p>Filename: {{ PPfileName }}</p>
    </div>
    <button @click="updateShopDescription(shopdescription)" class="submit-button">Submit Description</button>
    <button v-if="isPPUploaded" @click="updateShopProfilePicture" class="submit-button">Update Profile Picture</button>
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


.time_adjustments {
  width: 50px; /* Adjust the width as needed */
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 5px;
}

/* Style for the day selector */
.day_selector {
  padding: 10px; /* Add some padding for better visual appearance */
  font-size: 16px; /* Adjust the font size as needed */
  border: 1px solid #ccc; /* Add a border */
  border-radius: 5px; /* Add rounded corners */
  background-color: #fff; /* Background color for the selector */
  width: 200px; /* Set a specific width for the selector */
  cursor: pointer; /* Change cursor on hover */
  outline: none; /* Remove the default focus outline */
}

/* Style for the dropdown arrow */
.day_selector::after {
  content: '\25BC'; /* Unicode down arrow character */
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
}

/* Style for the dropdown options */
.day_selector option {
  font-size: 16px; /* Adjust the font size of options */
  padding: 10px; /* Add padding to options */
  background-color: #fff; /* Background color for options */
  color: #333; /* Text color for options */
}

/* Style for the selected option */
.day_selector option:checked {
  background-color: #5262a3; /* Background color for the selected option */
  color: #fff; /* Text color for the selected option */
}


.delivery-radius-section {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-bottom: 20px; /* Ensures spacing between this section and others */
}

.delivery-radius-controls, .delivery-radius-table {
  margin-top: 20px;
}

.delivery-radius-input-group {
  text-align: center; /* Center the label */
  margin-bottom: 5px;
}

.delivery-radius-input-wrapper {
  display: flex;
  justify-content: center; /* Center the input field horizontally */
}

.delivery-radius-input {
  width: 50%; /* Adjust the width as needed */
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}


.delivery-radius-toggle-btn, .delivery-radius-action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  margin-right: 10px;
}

.delivery-radius-toggle-btn:hover, .delivery-radius-action-btn:hover {
  background-color: #0056b3;
}

.delivery-radius-table ul {
  list-style-type: none;
  padding: 0;
}

.delivery-radius-table li {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.delivery-radius-table li:last-child {
  border-bottom: none;
}

.description-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  margin: 0 auto;
  gap: 15px; /* Space between elements */
}

.description-input, .file-upload, .file-uploaded {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  text-align: center;
}

.file-upload {
  cursor: pointer;
  border: 2px dashed #ccc;
  background: #fafafa;
  transition: background-color 0.3s, border-color 0.3s;
}

.file-upload:hover {
  background: #f0f0f0;
  border-color: #bbb;
}

.file-uploaded {
  background: #e0f7fa;
  color: #007c02;
  border: 2px solid #007c02;
}

.submit-button {
  cursor: pointer;
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #45a049;
}

</style>
