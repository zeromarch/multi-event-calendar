const express = require('express');
const db = require('./database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;
const SECRET_KEY = '12345'; // Use a secure key for production

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3001', // React app URL
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('Calendar App API');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Middleware function to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log('No token provided');
    return res.status(401).send('Access Denied');
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    console.log('Token verified:', verified);
    req.admin = verified;
    next();
  } catch (err) {
    console.log('Token verification failed:', err.message);
    res.status(400).send('Invalid Token');
  }
}

// Admin Signup Route
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run('INSERT INTO Admins (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(201).send('Admin created successfully');
  });
});

// Admin Login Route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM Admins WHERE username = ?', [username], (err, admin) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, SECRET_KEY);
    res.status(200).send({ token });
  });
});

// Create Availability
app.post('/availability', authenticateToken, (req, res) => {
  const { date, start_time, end_time } = req.body;
  const admin_id = req.admin.id;

  db.run('INSERT INTO Availability (admin_id, date, start_time, end_time) VALUES (?, ?, ?, ?)', [admin_id, date, start_time, end_time], function (err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(201).send('Availability added successfully');
  });
});

// Make the Availability Endpoint Public
app.get('/availability', (req, res) => {
  db.all('SELECT * FROM Availability', [], (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).json(rows);
  });
});

// Update Availability
app.put('/availability/:id', authenticateToken, (req, res) => {
  const { date, start_time, end_time } = req.body;
  const id = req.params.id;

  db.run('UPDATE Availability SET date = ?, start_time = ?, end_time = ? WHERE id = ?', [date, start_time, end_time, id], function (err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send('Availability updated successfully');
  });
});

// Delete Availability
app.delete('/availability/:id', authenticateToken, (req, res) => {
  const id = req.params.id;

  db.run('DELETE FROM Availability WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).send('Availability deleted successfully');
  });
});

// Create Booking
app.post('/bookings', (req, res) => {
  const { user_name, user_email, user_linkedin, slots } = req.body;

  if (!slots || !Array.isArray(slots) || slots.length === 0) {
    return res.status(400).send('No slots provided');
  }

  const placeholders = slots.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
  const values = [];
  
  slots.forEach(slot => {
    values.push(user_name, user_email, user_linkedin, slot.date, slot.start_time, slot.end_time);
  });

  const sql = `INSERT INTO Bookings (user_name, user_email, user_linkedin, date, start_time, end_time) VALUES ${placeholders}`;

  db.run(sql, values, function (err) {
    if (err) {
      console.error('Error inserting booking:', err.message);
      return res.status(500).send('Server error while creating booking');
    }
    res.status(201).send('Booking created successfully');
  });
});


// Get Bookings
app.get('/bookings', (req, res) => {
  db.all('SELECT * FROM Bookings', [], (err, rows) => {
    if (err) {
      console.error('Error fetching bookings:', err.message);
      return res.status(500).send('Server error while fetching bookings');
    }
    res.status(200).json(rows);
  });
});

// Update Booking
app.put('/bookings/:id', authenticateToken, (req, res) => {
  const { user_name, user_email, user_linkedin, date, start_time, end_time } = req.body;
  const id = req.params.id;

  db.run('UPDATE Bookings SET user_name = ?, user_email = ?, user_linkedin = ?, date = ?, start_time = ?, end_time = ? WHERE id = ?', [user_name, user_email, user_linkedin, date, start_time, end_time, id], function (err) {
    if (err) {
      console.error('Error updating booking:', err.message);
      return res.status(500).send('Server error while updating booking');
    }
    res.status(200).send('Booking updated successfully');
  });
});

// Delete Booking
app.delete('/bookings/:id', authenticateToken, (req, res) => {
  const id = req.params.id;

  db.run('DELETE FROM Bookings WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Error deleting booking:', err.message);
      return res.status(500).send('Server error while deleting booking');
    }
    res.status(200).send('Booking deleted successfully');
  });
});


// Test Signup Route
app.post('/test-signup', (req, res) => {
  const { username, password } = req.body;
  res.status(200).send(`Signup test received: ${username}, ${password}`);
});

// Test Login Route
app.post('/test-login', (req, res) => {
  const { username, password } = req.body;
  res.status(200).send(`Login test received: ${username}, ${password}`);
});

const shutdownHandler = (signal) => {
  console.log(`Received ${signal}. Closing server...`);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

// Endpoint to generate iframe link for user calendar
app.get('/generate-iframe', authenticateToken, (req, res) => {
  const iframeLink = `<iframe src="http://localhost:3001/user-calendar" width="600" height="400"></iframe>`;
  res.status(200).send({ iframeLink });
});


process.on('SIGINT', shutdownHandler); // Handles Ctrl+C
process.on('SIGTERM', shutdownHandler); // Handles kill commands
