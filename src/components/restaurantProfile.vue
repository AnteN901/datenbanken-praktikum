

<script setup>
 //--------------------Alles neu --------------------------------------------------------
 import { ref, watch } from 'vue';
  import axios from 'axios';
  import { useCustomerStore } from '@/stores/CustomerStore';
  import router from '@/router'
  import { response } from 'express';

  const CustomerStore = useCustomerStore(); 
  const name = ref('');
  const price = ref('');
  const description = ref('');
  const image = ref('');
  const insertItem = ref(false);
  const category = ref('');


  const getId = async() =>
  {
    try{
        const response = await axios.get(`http://localhost:3000/getId/${CustomerStore.getUserName}`);
        return response;
    }
    catch(error)
    {
        console.log(error);
    }
  }

  const toggleInsert = () =>
  {
    insertItem.value = !insertItem.value;
  }

  const addItem = async () => {
  try {
    const response = await axios.post('http://localhost:3000/insertItem', {
      name: name.value,
      price: price.value,
      description: description.value,
      image: image.value,
      category : category.value,
      restaurantId : await getId()
    });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}; 



</script>

<template>
  <div>
    <button @click="toggleInsert" v-show="!insertItem">showInsertItem</button>
    <button @click="toggleInsert" v-show="insertItem">hideInsertItem</button>
  
  <div class="form-container" v-show="insertItem">
  <h1>Füge Item hinzu</h1>
  <form @submit="addItem()" class="item-form">
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

     <!-- Image Inputs -->
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
</div>
</template>

