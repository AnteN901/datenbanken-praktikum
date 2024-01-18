<script setup>


</script>


<template>
  <div class="itemCard">
    <div class="cardContent">
      <img src="../assets/logo.png" alt="Image Description" class="itemImage">
      <div class="cardText">
        <h2>Itemname</h2>
        <h3>itembeschreibung</h3>
      </div>
    </div>
    <div class="buttons-container">
      <button class="addButton">+</button>
      <button class="subButton">-</button>
    </div>
    <input type="text" class="textField" placeholder="Sonderwünsche">
  </div>  
</template>

<style>
.itemCard {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 16px;
  width: 600px; /* Adjust width as needed */
  height: 50px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  transition: transform 0.3s ease-in-out;
}

.itemCard:hover {
  transform: scale(1.05);
}

.cardContent {
  display: flex;
}

.cardImage {
  width: 50px; /* Width of the image */
  height: 50px; /* Height of the image (making it square) */
  object-fit: cover;
  border-radius: 4px;
  margin-right: 10px; /* Adds some space to the right of the image */
}

.cardText {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 5px; /* Adjust the top margin */
  margin-bottom: 5px; /* Adjust the bottom margin */
}

h2, h3 {
  margin: 0; /* Remove default margin for h2 and h3 */
  padding: 0; /* Remove default padding for h2 and h3 */
}


.itemImage {
  height: 60px; /* Adjust to the desired size */
  width: 60px; /* Adjust to the desired size */
  object-fit: cover; /* Ensures the image covers the area without stretching */
  margin-left: 10px; /* Adds some space between the picture and other items */
}

.buttons-container {
    display: flex;
}
.addButton {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  width: 25px;
  border: none;
  border-radius: 4px;
  background-color: #7700fe;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 1px;
}

.subButton {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  width: 25px;
  border: none;
  border-radius: 4px;
  background-color: #9b9b9b;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 1px;
}


.addButton:hover{
  background-color: #9765d1;
}

.subButton:hover {
  background-color: #d16565;
}

.textField {
  width: 600px;
  padding: 10px;
  margin-left: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}
</style>
