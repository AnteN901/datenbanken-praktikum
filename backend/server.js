const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./LSDatabase.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the existing SQLite database');
  }
});

app.post('/create-customer', (req, res) => {
  console.log('Request received');

  const { firstName, lastName, address, password } = req.body;
  const { postcode, street, city, houseNumber } = address;

  const insertQuery = `
    INSERT INTO customers (first_name, last_name, address, postal_code, password)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    insertQuery,
    [firstName, lastName, JSON.stringify(address), postcode, password],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to create customer account' });
      } else {
        console.log('Customer account created successfully');
        res.json({ success: true });
      }
    }
  );
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
