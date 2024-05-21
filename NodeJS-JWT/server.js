require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authenticateToken = require('./middleware/authenticateToken');
const authorizeRole = require('./middleware/allowRoles');

const app = express();
const PORT = 3000;
const secretKey = process.env.JWT_SECRET_KEY;

if (!secretKey) {
  console.error('JWT secret key not provided. Set JWT_SECRET_KEY environment variable.');
  process.exit(1);
}

app.use(bodyParser.json());

const users = [
  { id: 1, username: 'user1', password: 'password1', role: 'user' },
  { id: 2, username: 'user2', password: 'password2', role: 'admin' }
];

app.get('/', (req, res) => {
  res.send('Welcome to my application!');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

//   const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
  const token = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});

app.post('/register', (req, res) => {
  const { username, password, role } = req.body;
  
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ message: 'Error hashing password' });
    }
    
    const newUser = { id: users.length + 1, username, password: hash, role: role || 'user' };
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully' });
  });
});

app.get('/admin', authenticateToken, authorizeRole('admin'), (req, res) => {
  res.json({ message: 'Admin route accessed successfully' });
});

app.get('/user', authenticateToken, (req, res) => {
  res.json({ message: 'User route accessed successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
