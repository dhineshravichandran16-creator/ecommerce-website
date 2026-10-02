function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cart-items');
  const summary = document.getElementById('cart-summary');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart">Your cart is empty 🛒</p>';
    summary.innerHTML = '';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p class="price">$${item.price.toFixed(2)}</p>
      </div>
      <div class="qty-controls">
        <button onclick="changeQty(${item.id}, -1)">−</button>
        <span>${item.quantity}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>
      <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
    </div>
  `).join('');

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  summary.innerHTML = `
    <h3>Total: $${total.toFixed(2)}</h3>
    <button class="checkout-btn" onclick="checkout()">Proceed to Checkout</button>
  `;
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    saveCart(cart.filter(i => i.id !== id));
  } else {
    saveCart(cart);
  }
  renderCart();
}

function removeItem(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

async function checkout() {
  const cart = getCart();
  if (cart.length === 0) return;
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  
  try {
    const res = await fetch(`${API_URL}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart, total })
    });
    const data = await res.json();
    if (data.success) {
      alert(`✅ ${data.message}\nOrder ID: ${data.orderId}\nTotal: $${total.toFixed(2)}`);
      localStorage.removeItem('cart');
      updateCartCount();
      renderCart();
    }
  } catch (err) {
    alert('Checkout failed. Please try again.');
  }
}

document.addEventListener('DOMContentLoaded', renderCart);