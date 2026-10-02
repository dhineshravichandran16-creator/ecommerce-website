// API URL - change this after deployment
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : '/api';

// Get cart from localStorage
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
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
}

// Fetch products
async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    return await res.json();
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
}

// Create product card HTML
function createProductCard(product) {
  return `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="price">$${product.price.toFixed(2)}</p>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      </div>
    </div>
  `;
}

// Add to cart
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  showToast(`${product.name} added to cart!`);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// Attach add-to-cart listeners
function attachCartListeners() {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.id);
      const products = await fetchProducts();
      const product = products.find(p => p.id === id);
      if (product) addToCart(product);
    });
  });
}

// Load home page
async function loadHome() {
  const grid = document.getElementById('featured-products');
  if (!grid) return;
  const products = await fetchProducts();
  grid.innerHTML = products.slice(0, 4).map(createProductCard).join('');
  attachCartListeners();
}

// Load products page
async function loadProducts() {
  const grid = document.getElementById('all-products');
  if (!grid) return;
  const products = await fetchProducts();
  
  function render(items) {
    grid.innerHTML = items.map(createProductCard).join('');
    attachCartListeners();
  }
  
  render(products);
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      render(cat === 'all' ? products : products.filter(p => p.category === cat));
    });
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  loadHome();
  loadProducts();
});