const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express();

// Connect to the existing SQLite database
const db = new sqlite3.Database('./backend/LSDatabase.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the existing SQLite database');
  }
});

// Your express server setup goes here

// Close the database connection when the server is closed
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Closed the database connection');
    }
    process.exit(0);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
