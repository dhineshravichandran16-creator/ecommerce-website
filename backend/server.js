const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const products = require('./data/products.json');

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory users & orders
const users = [];
const orders = [];

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// ---------- PRODUCTS ----------
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// ---------- AUTH ----------
app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }
  const user = { id: users.length + 1, email, password };
  users.push(user);
  res.json({ success: true, message: 'Account created!', user: { id: user.id, email: user.email } });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  res.json({ success: true, message: 'Login successful!', user: { id: user.id, email: user.email } });
});

// ---------- CHECKOUT ----------
app.post('/api/checkout', (req, res) => {
  const { items, total, customer, payment } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }
  const orderId = 'ORD-' + Date.now();
  const order = { orderId, customer, items, total, payment, createdAt: new Date() };
  orders.push(order);
  console.log('📦 New Order:', orderId, '| Total: $' + total);
  res.json({ success: true, orderId, message: 'Order placed successfully!', total });
});

// ---------- ADMIN: ORDERS ----------
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// ---------- SERVE FRONTEND ----------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT);
});