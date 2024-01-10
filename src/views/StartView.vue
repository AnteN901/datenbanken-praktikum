<script setup></script>

<template>
  <div class="start">
      <img alt="Vue logo" src="../assets/logo.png" />

      <div class="restaurant_card">
      <img src="/img/Firefox.png" alt="Bild" />
      <h2>Titel der Karte</h2>
      <p>Ein kurzer Text oder eine Beschreibung, die in der Karte steht.</p>
    </div>
  </div>
  
</template>





<style>
/* Stile für die Karte */
.restaurant_card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 16px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
/* Stile für das Bild in der Karte */
.restaurant_card img {
  width: 100%;
  border-radius: 4px;
  margin-bottom: 8px;
}

/* Stile für den Titel in der Karte */
.restaurant_card h2 {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

/* Stile für den Text in der Karte */
.restaurant_card p {
  font-size: 1rem;
  color: #555;
}
</style>
