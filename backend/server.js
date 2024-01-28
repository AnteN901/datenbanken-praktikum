const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();


app.use(cors({
  origin: 'http://localhost:8080' // Replace with your frontend's origin
}));
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

const db = new sqlite3.Database('./LSDatabase.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the existing SQLite database');
    
  }
});




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

app.post('/create-shop', (req, res) => {
  console.log('create shop Request received');
  const {userName, name, image, address, description, password} = req.body;
  const { postcode, street, city, houseNumber } = address;
  const insertQuery = `
    INSERT INTO restaurants (username, name, address, postcode, description, image, password)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    insertQuery,
    [userName, name, JSON.stringify(address), postcode, description, image, password],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to create customer account' });
      } else {
        console.log('restaurant account created successfully');
        res.json({ success: true });
      }
    }
  );
});

app.post('/customerLogIn', (req,res) =>{
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
      res.json({ success: true, message: 'Login successful', postal_code: row.postal_code });
      }
      else{
        console.log('userName und Password invalid')
        res.status(401).json({ error: 'Invalid username or password' });
      }
    }
  });

});

app.post('/restaurantLogIn', (req,res) =>{
  console.log('request For LogIn recieved');
  const {userName,password} = req.body;

  const query = 'SELECT * FROM restaurants WHERE username = ? AND password = ?';
  db.get(query, [userName,password] ,(err,row) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (row) {
      res.json({ success: true, message: 'Login successful', postcode: row.postcode});
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

app.get('/getRestaurantsFiltered', (req, res) => { 
  console.log('Request for Restaurants Filtered revieced');
  const {postal_code} = req.query; //Für axios.get wird req.query gebraucht(?) = erhält parameter aus dem anfrage-String
  const query = "SELECT * FROM  restaurants RIGHT JOIN (SELECT * FROM delivery_radius WHERE postal_code = '"+postal_code+"') AS f_rest ON restaurants.id = f_rest.restaurants_id";
  console.log(query);
  db.all(query,(err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });
});

app.get('/getRestaurantItems', (req, res) => {
  console.log('Request for Restaurant Items received');
  const restaurantId = req.query.restaurant_id;

  if (!restaurantId) {
      return res.status(400).json({ error: 'Restaurant ID is required' });
  }

  const query = 'SELECT * FROM items WHERE restaurant_id = ?';

  db.all(query, [restaurantId], (err, rows) => {
      if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Internal server error' });
      } else {
          res.json(rows);
      }
  });
});

app.get('/getCustomerOrders/:username', (req, res) => {
  console.log('Request for Order Items received');

  const username = req.params.username;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  const query = `
    SELECT
      o.id AS order_id,
      o.created_at,
      o.status,
      od.quantity,
      od.note,
      i.id
    FROM
      orders o
    JOIN
      order_details od ON o.id = od.order_id
    JOIN
      items i ON od.item_id = i.id
    WHERE
      o.customer_id = (SELECT id FROM customers WHERE username = ?)
    ORDER BY
      o.created_at DESC;
`;

  db.all(query, [username], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });
});

app.get('/getId', (req, res) => { 
  console.log('Request for Id revieced');
  const {username} = req.query; //Für axios.get wird req.query gebraucht(?) = erhält parameter aus dem anfrage-String
  const query = 'SELECT id FROM restaurants WHERE username = ?';
  console.log(query);
  db.get(query, [username],(err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.log(rows);
      res.json(rows);
    }
  });
});

app.post('/insertItem', (req, res) => {
  console.log('insert Request received');

  const {name, price, description, image, category, restaurantId } = req.body;
  const imagePath = '/images/restaurantImages/' + image;

  const insertQuery = `
    INSERT INTO items (restaurant_id, name, description, price, image, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    insertQuery,
    [restaurantId, name, description, price, imagePath, category],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to insert item' });
      } else {
        console.log('item created successfully');
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
