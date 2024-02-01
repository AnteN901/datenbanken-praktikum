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
  let opening,end;
  if(openingM <10){
     opening = openingH+':0'+openingM;
  }
  else{
     opening = openingH+':'+openingM;
  }
  if(endM < 10){
     end = endH+':0'+endM;
  }
  else{
   end = endH+':'+endM;
  }
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

//-----------BIS HIER-----------------------
</script>

<template>
  <div>
    <div class="ui-buttons">
    <button @click="toggleDescription">Change description</button>
    <button @click="toggleHistory">History</button>
    <button @click="toggleInsertItem">Insert Item</button> 
    <button @click="toggleInsertDate">Add Opening/Closing Time</button>
    <button @click="toggleInsertRadius">Add radius</button>
    <button @click="toggleDeleteItem">Delete/Update Item</button>
    </div>
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
  
  <div v-show="showHistory">
    <h1>Bestellübersicht</h1>
    <div class="text-fields">
        <ul v-if="showHistory">
          <li v-for="groupedOrder in groupedOrders" :key="groupedOrder.order_id" class="text-fields-container">
            <p>Status: {{ groupedOrder.status }}, {{ groupedOrder.created_at }}</p>
            <!-- Iterate over items for the current order -->
            <ul>
              <li v-for="item in groupedOrder.items" :key="item.id">
                <p>Item: {{ item.id }} , {{  item.item_name }}</p>
                <p>Quantity: {{ item.quantity }}</p>
                <p>Note: {{ item.note }}</p>
                <!-- Add more item details as needed -->
              </li>
            </ul>
            <div v-if="groupedOrder.status=='in Bearbeitung'">
              <button @click="acceptOrder(groupedOrder)" class="accept-btn">Annehmen</button>
              <button @click="rejectOrder(groupedOrder)" class="decline-btn">Ablehnen</button>
            </div>
            <div v-if="groupedOrder.status=='In Zubereitung'">
              <button @click="completeOrder(groupedOrder)" class="submit-button">Abschließen</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="form-group" v-show="deleteItem">
    <h1>Delete or edit items</h1>
    <div class="item-cards">
      <button @click="toggleUpdate()" class="accept-btn">Delete/Update Item</button>
      <div v-show="update">
      <li v-for="item in restaurantStore.items" :key="item.id" class="item-card">
        <h3>{{ item.name }}</h3>
        <div class="item-actions">
          <button @click="removeItem(item.id)" class="decline-btn">Delete Item</button>
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
        <p>ItemCategory: 
        <select v-model="item.category">
          <option value="Vorspeise">Vorspeise</option>
          <option value="Nachspeise">Nachspeise</option>
          <option value="Hauptspeise">Hauptspeise</option>
          <option value="Getränk">Getränk</option>
        </select>
    </p>
        <button @click="updateItem(item.id, item.restaurant_id, item.name, item.description, item.price, item.image, item.category)" class="submit-button">Update Item</button>
      </li>
    </div>
    </div>
  </div>
  <div v-show="insertRadius">
    <h1>Adjust the delivery radius</h1>
    <div v-show="!radiusMode">
    <button @click="toggleRadiusMode()">Add/Delete Radius</button>
    Radius: <input type="number" v-model="radius">
    <button @click="addRadius(radius)">Add Radius</button>
    </div>
    <div v-show="radiusMode">
    <button @click="toggleRadiusMode()">Add/Delete Radius</button>
    Radius: <input type="number" v-model="radius">
    <button @click="deleteRadius(radius)">Delete Radius</button>
    </div>
  </div>
  <div v-show="insertHours">
  <h1>Weekday (1-Monday | 7-Saturday)</h1>
  <input type="number" min="1" max="7" step="1" v-model="day">
  <p>
    Opening Time:
    <input type="number" min="0" max="23" step="1" v-model="openingH"> Hours
    <input type="number" min="0" max="59" step="1" v-model="openingM"> Minutes
  </p>
  <p>
    Closing Time:
    <input type="number" min="0" max="23" step="1" v-model="endH"> Hours
    <input type="number" min="0" max="59" step="1" v-model="endM"> Minutes
    
  </p>
  <button @click="addHours(day,openingH,openingM,endH,endM)" class="submit-button">Add Hours</button>
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
.description-input {
  width: 50%;
  height: 300px; /* Set the initial height as per your requirement */
  resize: none;
  overflow-y: auto; /* Always show vertical scrollbar if needed */
  overflow-x: hidden; /* Hide horizontal scrollbar */
  box-sizing: border-box;
  padding: 8px;
}

.ui-buttons {
  display: flex;
  flex-wrap: wrap; /* Allow buttons to wrap to the next line */
  justify-content: flex-start; /* Align buttons to the start of the container (left) */
  gap: 8px; /* Optional: Add gap between buttons */
}

.ui-buttons button {
  flex: 0 0 calc(33.33% - 8px); /* Three buttons in a row, with 8px gap between them */
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #b691ffd9; /* Match the button color to registration form */
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.ui-buttons button:hover{
  background-color: #a3a3a3d9;
}

.submit-button{
  background-color: #4CAF50; /* Green background */
  color: white; /* White text */
  padding: 10px 20px; /* Padding for better button size */
  margin-top: 10px; /* Adjust top margin */
  border: none; /* Remove border */
  border-radius: 5px; /* Rounded corners */
  cursor: pointer; /* Cursor changes to pointer on hover */
  font-size: 16px; /* Increased font size */
  transition: background-color 0.3s; /* Smooth transition for hover effect */
}

.accept-btn{
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #febe00;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 10px;
}

.decline-btn{
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #fe5900;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 10px;
}


</style>