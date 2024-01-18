<template>
  <div class="container">
    <div class="buttons-container">
      <button v-if="showWarenkorbBtn" @click="WarenkorbClicked">Warenkorb</button>
      <button v-if="showBestellHistorieBtn" @click="BestellHisorieClicked">Bestellübersicht</button>
    </div>

    <div v-if="!showButtons" class="text-fields-container">
      <div class="text-fields">
        <input v-if="visibleWarenkorb" type="text" value="Text for Warenkorb" readonly class="text-field" />
        <input v-if="visibleBestHist" type="text" value="Text for Bestellübersicht" readonly class="text-field" />
      </div>

      <div class="buttons-bottom">
        <button v-if="showBackButton" @click="BackClicked" class="back-button">Back</button>
        <button v-if="showBuyButton" @click="buyClicked" class="buy-button">Kaufen</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showWarenkorbBtn: true,
      showBestellHistorieBtn: true,
      showBuyButton: false,
      showBackButton: false,
      visibleWarenkorb: false,
      visibleBestHist: false,
    };
  },
  methods: {
    WarenkorbClicked() {
      console.log('Warenkorb button clicked');
      this.showBestellHistorieBtn = false;
      this.showWarenkorbBtn = false;
      this.visibleWarenkorb = true;
      this.showBuyButton = true; // Show Kaufen button
      this.showBackButton = true; // Show Back button
    },
    BestellHisorieClicked() {
      console.log('Bestellübersicht button clicked');
      this.showBestellHistorieBtn = false;
      this.showWarenkorbBtn = false;
      this.visibleBestHist = true;
      this.showBackButton = true; // Show Back button
      this.showBuyButton = false; // Hide Kaufen button

    },
    BackClicked() {
      console.log('Back button clicked');
      this.showWarenkorbBtn = true;
      this.showBestellHistorieBtn = true;
      this.showBuyButton = false; // Hide Kaufen button
      this.showBackButton = false; // Hide Back button
      this.visibleWarenkorb = false;
      this.visibleBestHist = false;
    },
    buyClicked() {
      console.log('Kaufen button clicked');
      // Implement the logic for the Kaufen button
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