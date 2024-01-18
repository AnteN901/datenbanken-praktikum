<template>
  <div class="container">
    <div class="buttons-container">
      <button v-if="showWarenkorbBtn" @click="WarenkorbClicked" class="warenkorb-button">Warenkorb</button>
      <button v-if="showBestellHistorieBtn" @click="BestellHisorieClicked" class="orderHistory-button">Bestellübersicht</button>
    </div>

    <div v-show="visibleWarenkorb || visibleBestHist" class="text-fields-container">
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

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

.text-fields {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
}

.buttons-bottom {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.buy-button, .back-button, .warenkorb-button, .orderHistory-button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #7700fe;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 10px;
}

.buy-button:hover, .back-button:hover, .warenkorb-button:hover, .orderHistory-button:hover {
  background-color: #9765d1;
}

.text-field {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  font-size: 16px;
  box-sizing: border-box;
}
</style>

