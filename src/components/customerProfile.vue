<template>
  <div class="container">
    <div class="buttons-container">
      <button v-if="showButton1" @click="showText1">Warenkorb</button>
      <button v-if="showButton2" @click="showText2">Bestellübersicht</button>
    </div>

    <div v-if="!showButtons" class="text-fields-container">
      <div class="text-fields">
        <input v-if="visibleText1" type="text" value="Text for Warenkorb" readonly class="text-field" />
        <input v-if="visibleText2" type="text" value="Text for Bestellübersicht" readonly class="text-field" />
      </div>

      <div class="buttons-bottom">
        <button v-if="showBackButton" @click="goBack" class="back-button">Back</button>
        <button v-if="showBuyButton" @click="buy" class="buy-button">Kaufen</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showButton1: true,
      showButton2: true,
      showBuyButton: false,
      showBackButton: false,
      visibleText1: false,
      visibleText2: false,
    };
  },
  methods: {
    showText1() {
      console.log('Warenkorb button clicked');
      this.showButton1 = false;
      this.visibleText1 = true;
      this.showBuyButton = true; // Show "Kaufen" button
      this.showBackButton = true; // Show "Back" button
    },
    showText2() {
      console.log('Bestellübersicht button clicked');
      this.showButton2 = false;
      this.visibleText2 = true;
      this.showBackButton = true; // Show "Back" button
    },
    goBack() {
      console.log('Back button clicked');
      this.showButton1 = true;
      this.showButton2 = true;
      this.showBuyButton = false; // Hide "Kaufen" button
      this.showBackButton = false; // Hide "Back" button
      this.visibleText1 = false;
      this.visibleText2 = false;
    },
    buy() {
      console.log('Kaufen button clicked');
      // Implement the logic for the "Kaufen" button
    },
  },
};
</script>

<style scoped>
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  height: 100vh;
}

.buttons-container {
  display: flex;
  flex-direction: column;
}

.text-fields-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.text-fields {
  width: 300px;
  text-align: center;
}

.buttons-bottom {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.buy-button, .back-button {
  width: 100px;
  margin: 10px;
}

.text-field {
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  font-size: 16px;
  box-sizing: border-box;
}
</style>