<template>
  <div class="container">
    <div class="buttons-container">
      <button v-if="showBestellHistorieBtn" @click="BestellHisorieClicked" class="orderHistory-button">Bestellübersicht</button>
    </div>

    <div v-show="visibleWarenkorb || visibleBestHist" class="text-fields-container">
      <div class="text-fields">
        <input v-if="visibleBestHist" type="text" value="Text for Bestellübersicht" readonly class="text-field" />
      </div>

      <div class="buttons-bottom">
        <button v-if="showBackButton" @click="BackClicked" class="back-button">Back</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showBestellHistorieBtn: true,
      showBackButton: false,
      visibleBestHist: false,
    };
  },
  methods: {
    BestellHisorieClicked() {
      console.log('Bestellübersicht button clicked');
      this.showBestellHistorieBtn = false;
      this.visibleBestHist = true;
      this.showBackButton = true; // Show Back button
    },
    BackClicked() {
      console.log('Back button clicked');
      this.showBestellHistorieBtn = true;
      this.showBackButton = false; // Hide Back button
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

.back-button, .orderHistory-button {
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

.back-button:hover, .orderHistory-button:hover {
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

