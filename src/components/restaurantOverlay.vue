<template>
    <div class="overlay">
      <div class="overlay-content">
        <button class="close-button" @click="emitCloseEvent">X</button>
        <p>This is the overlay content.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineEmits } from 'vue';
  
  const emit = defineEmits(['close']);
  
  const emitCloseEvent = () => {
    emit('close', false); // Emitting 'false' as an example
  };
  </script>
  
  <style scoped>
 
  .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 20px;
      color: #333;
  }

  .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.5); /* Darkened background */
      backdrop-filter: blur(5px); /* Blurred background */
      z-index: 1000; /* Ensure it's on top */
  }
  
  .overlay-content {
      max-width: 80%;
      max-height: 80%;
      background-color: white; /* Visible content background */
      padding: 20px; /* Padding around content */
      border-radius: 10px; /* Rounded corners */
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Shadow for depth */
      overflow-y: auto;
      position: relative;
  }
  </style>
  