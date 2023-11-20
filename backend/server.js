const express = require('express');
const sqlite3 = require('sqlite3');

const app = express();
const port = 3000;

// Verbindung zur SQLite-Datenbank herstellen
const db = new sqlite3.Database('backend/productDatabase.sqlite');

// Routen definieren
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Server starten
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});