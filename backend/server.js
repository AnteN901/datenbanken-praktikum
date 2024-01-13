const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./backend/LSDatabase.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the existing SQLite database');
    
  }
});
/*
const createCustomerTable = `
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userName TEXT,
    first_name TEXT,
    last_name TEXT,
    address TEXT,
    postal_code TEXT,
    password TEXT
  )
`;

db.run(createCustomerTable, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Table "customers" created or already exists');
  }
});

const createShopTable = `
  CREATE TABLE IF NOT EXISTS shop (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shop_name TEXT,
    address TEXT,
    postal_code TEXT,
    city TEXT
    password TEXT
  )
`;

db.run(createShopTable, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Table "shop" created or already exists');
  }
});
*/


app.post('/create-customer', (req, res) => {
  console.log('create customer Request received');

  const {userName, firstName, lastName, address, password } = req.body;
  const { postcode, street, city, houseNumber } = address;

  const insertQuery = `
    INSERT INTO customers (username, first_name, last_name, address, postal_code, password)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  

  db.run(
    insertQuery,
    [userName, firstName, lastName, JSON.stringify(address), postcode, password],
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

app.post('/logIn', (req,res) =>{
  console.log('request For LogIn recieved');
  const {userName,password} = req.body;

  const query = 'SELECT * FROM customers WHERE userName = ? AND password = ?';
  db.get(query, [userName,password] ,(err,row) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (row) {
      console.log('Success LogIn');
      res.json({ success: true, message: 'Login successful' });
      }
      else{
        console.log('userName und Password invalid')
        res.status(401).json({ error: 'Invalid username or password' });
      }
    }
  });

});

app.get('/getRestaurants', (req, res) => { 
  console.log('Request for Restaurants revieced');
  const query = 'SELECT * FROM restaurants';
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });
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
