// API URL
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : '/api';

// ---------- CART ----------
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = count;
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  saveCart(cart);
  showToast(`${product.name} added to cart!`);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = '✅ ' + message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// ---------- FETCH PRODUCTS ----------
async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    return await res.json();
  } catch (err) {
    console.error('Error:', err);
    return [];
  }
}

// ---------- PRODUCT CARD ----------
function productCard(p) {
  return `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}" />
      <div class="product-info">
        <div class="category">${p.category}</div>
        <h3>${p.name}</h3>
        <div class="price">$${p.price.toFixed(2)}</div>
        <button class="add-btn" data-id="${p.id}">Add to Cart</button>
      </div>
    </div>
  `;
}

// ---------- RENDER HOME / PRODUCTS ----------
async function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const products = await fetchProducts();
  grid.innerHTML = products.map(productCard).join('');

  // Attach add-to-cart listeners
  grid.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const product = products.find(p => p.id === id);
      if (product) addToCart(product);
    });
  });
}

// ---------- RENDER ADMIN TABLE ----------
async function renderAdmin() {
  const tbody = document.getElementById('admin-product-rows');
  if (!tbody) return;

  const products = await fetchProducts();
  tbody.innerHTML = products.map(p => `
    <tr>
      <td>#${p.id}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>$${p.price.toFixed(2)}</td>
      <td><button class="btn-danger">Delete</button></td>
    </tr>
  `).join('');
}
// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderProducts();
  renderAdmin();
});