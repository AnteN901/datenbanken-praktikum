const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const multer = require("multer");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8080', // Adjust this to match your frontend's origin
    methods: ['GET', 'POST']
  }
});

app.use(cors({ origin: 'http://localhost:8080' }));
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

const db = new sqlite3.Database('./LSDatabase.db', err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the existing SQLite database');
  }
});

io.on('connection', socket => {
  console.log('A user connected');

  // You can define socket event listeners here
  // For example, listening for a custom event
  socket.on('some-event', (data) => {
    console.log(data);
    // Handle the event
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "images/uploadedImages"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  // Handle the uploaded file, save it to disk or process as needed
  const file = req.file;
  // Example response
  res.json({ message: "File uploaded successfully", filename: file.originalname });
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

app.post('/set-order-state', (req, res) => {
  console.log('Orderstate change request received');
  const { orderId, status } = req.body;

  const updateQuery = `
    UPDATE orders 
    SET status = ?
    WHERE id = ?;
  `;

  db.run(updateQuery, [status, orderId], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.log(`Rows affected: ${this.changes}`);
      res.json({ message: 'Order status updated successfully' });
    }
  });
});

app.post('/set-description', (req, res) => {
  const { description,  username} = req.body;
  const updateQuery = `
    UPDATE restaurants 
    SET description = ?
    WHERE username = ?;
  `;

  db.run(updateQuery, [description, username], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ message: 'Restaurant Description updated successfully' });
    }
  });
});

app.post('/set-path-to-pp', (req, res) => {
  const { image,  username} = req.body;
  const updateQuery = `
    UPDATE restaurants 
    SET image = ?
    WHERE username = ?;
  `;

  db.run(updateQuery, [image, username], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ message: 'Restaurant Description updated successfully' });
    }
  });
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
  const {postal_code} = req.query; 
  const currentDate = new Date();
  
  const minute = (currentDate.getMinutes() < 10) ? "0" + currentDate.getMinutes() : currentDate.getMinutes();
  const hour = (currentDate.getHours() < 10) ? "0" + currentDate.getHours() : currentDate.getHours();
  const time = hour+":"+minute;
  const day = currentDate.getDay();
  const query = `
  SELECT *
  FROM restaurants AS r
  RIGHT JOIN (
    SELECT d_table.restaurants_id AS id, postal_code
    FROM delivery_radius AS d_table
    RIGHT JOIN (
      SELECT o.restaurant_id AS id
      FROM opening_hours AS o
      WHERE o.opening_time < '${time}' AND o.closing_time > '${time}' AND o.day_of_week = ${day}
    ) AS t_table ON t_table.id = d_table.restaurants_id
    WHERE postal_code = ${postal_code}
  ) AS f_table ON f_table.id = r.id;
`;
console.log(day);
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
      i.id AS item_id,
      i.name AS item_name,
      i.price AS item_price
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

app.get('/getRestaurantOrders/:username', (req, res) => {
  console.log('Request for Restaurant Order Items received');

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
    i.id AS item_id,
    i.name AS item_name,
    i.price AS item_price,
    c.first_name,
    c.last_name,
    c.address
  FROM
    orders o
  JOIN
    order_details od ON o.id = od.order_id
  JOIN
    items i ON od.item_id = i.id
  JOIN
    customers c ON o.customer_id = c.id
  WHERE
    o.restaurants_id = (SELECT id FROM restaurants WHERE username = ?)
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

app.get('/getShopDescription', (req, res) => { 
  console.log('Request for shop description revieced');
  const {username} = req.query; //Für axios.get wird req.query gebraucht(?) = erhält parameter aus dem anfrage-String
  const query = 'SELECT description FROM restaurants WHERE username = ?';
  db.get(query, [username],(err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });
});

app.post('/insertItem', (req, res) => {
  console.log('insert Request received');

  const {name, price, description, image, category, restaurantId } = req.body;

  const insertQuery = `
    INSERT INTO items (restaurant_id, name, description, price, image, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    insertQuery,
    [restaurantId, name, description, price, image, category],
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

app.post('/deleteItem', (req,res)=> {
  console.log('delete Request received');
  const {restaurantId, itemId} = req.body;
  const deleteQuery = `
    DELETE FROM items WHERE restaurant_id = ? AND id = ?
  `;

  db.run(
    deleteQuery,
    [restaurantId ,itemId],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to delete item' });
      } else {
        console.log('item created successfully');
        res.json({ success: true });
      }
    }
  );
});

app.post('/updateItem', (req, res) => {
  console.log('update Request received');

  const {itemId, restaurantId, name, description, price, image, category} = req.body;
  //console.log("ItemId "+itemId+"\nrId "+restaurantId+"\nname"+name+"\ndescription"+description+"\nprice"+price+"\nimage"+image+"\ncategory"+category);
  console.log(image);
  const updateQuery = `
    UPDATE items SET restaurant_id = ?, name = ?, description = ?, price = ?, image = ?, category = ?
    WHERE id = ?
  `;

  db.run(
    updateQuery,
    [restaurantId, name, description, price, image, category, itemId],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to insert item' });
      } else {
        console.log('item updated successfully');
        res.json({ success: true });
      }
    }
  );
});


app.post('/createOrder', (req, res) => {
  // Step 0: Extract the required data from the request body
  const { customerUserName, restaurantId, items } = req.body;

  // Step 1: Retrieve the customer ID using the username
  const getCustomerIdQuery = `SELECT id FROM customers WHERE username = ?`;

  db.get(getCustomerIdQuery, [customerUserName], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to retrieve customer ID' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const customerId = row.id;

    // Step 2: Insert into the 'orders' table
    const insertOrderQuery = `
      INSERT INTO orders (status, restaurants_id, customer_id)
      VALUES ('in Bearbeitung', ?, ?)
    `;

    db.run(insertOrderQuery, [restaurantId, customerId], function(err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Failed to create order' });
      }

      const orderId = this.lastID; // Retrieve the ID of the newly inserted order

      // Step 3: Insert items into the 'order_details' table
      const insertOrderDetailQuery = `
        INSERT INTO order_details (order_id, item_id, quantity, note)
        VALUES (?, ?, ?, ?)
      `;

      // Use a transaction to ensure all inserts succeed or fail together
      db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        items.forEach(item => {
          db.run(insertOrderDetailQuery, [orderId, item.itemId, item.quantity, item.specialRequests || ''], (err) => {
            if (err) {
              console.error(err.message);
              db.run("ROLLBACK");
              return; // Exit the forEach loop on error
            }
          });
        });
        db.run("COMMIT", (err) => {
          if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to commit transaction' });
          } else {
            res.json({ success: true, message: 'Order created successfully', orderId: orderId });
            io.emit('new-order', { orderId: orderId, message: 'New order received!' });
          }
        });
      });
    });
  });
});


app.get('/getDeliveryRadius', (req, res) => {
  const { restaurantId } = req.query;

  const selectQuery = `
    SELECT postal_code FROM delivery_radius WHERE restaurants_id = ?
  `;

  db.all(selectQuery, [restaurantId], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to fetch delivery radius' });
    } else {
      console.log('Delivery radius fetched successfully');
      res.json({ radius: rows.map(row => row.postal_code) });
    }
  });
});



app.post('/insertRadius', (req, res) => {
  console.log('insert Request received');

  const {restaurantId, radius} = req.body;

  const insertQuery = `
    INSERT INTO delivery_radius (postal_code, restaurants_id)
    VALUES (?, ?)
  `;

  db.run(
    insertQuery,
    [radius, restaurantId],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to insert radius' });
      } else {
        console.log('Radius added successfully');
        res.json({ success: true });
      }
    }
  );
});

app.post('/deleteRadius', (req, res) => {
  console.log('delete Request received');

  const {restaurantId, radius} = req.body;

  const insertQuery = `
    DELETE FROM delivery_radius WHERE postal_code=? AND restaurants_id=?
    
  `;

  db.run(
    insertQuery,
    [radius, restaurantId],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to delete radius' });
      } else {
        console.log('Radius delete successfully');
        res.json({ success: true });
      }
    }
  );
});


app.post('/insertHours', (req, res) => {
  console.log('insert Request received');

  const {restaurantId, day, opening, end} = req.body;
  

  const insertQuery = `
    INSERT INTO opening_hours (restaurant_id, day_of_week, opening_time, closing_time)
    VALUES (?, ?, ?, ?)
  `;

  db.run(
    insertQuery,
    [restaurantId, day, opening, end],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to insert hours' });
      } else {
        console.log('hours created successfully');
        res.json({ success: true });
      }
    }
  );
});

app.post('/deleteHours', (req, res) => {
  console.log('delete Request received');

  const {restaurantId, day} = req.body;

  const insertQuery = `
    DELETE FROM opening_hours WHERE day_of_week=? AND restaurant_id=?
    
  `;

  db.run(
    insertQuery,
    [day, restaurantId],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to delete radius' });
      } else {
        console.log('Radius delete successfully');
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
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

