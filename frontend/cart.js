// ---------- RENDER CART PAGE ----------
function renderCart() {
  const container = document.getElementById('cart-items');
  const summary = document.getElementById('cart-summary');
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart" style="text-align:center;padding:3rem;color:#888;">
        <div style="font-size:4rem;">🛒</div>
        <h3>Your cart is empty</h3>
        <p style="margin-bottom:1.5rem;">Add some products to get started!</p>
        <button class="btn-primary" onclick="location.href='products.html'">Shop Now</button>
      </div>
    `;
    summary.innerHTML = '';
    return;
  }

  let total = 0;
  container.innerHTML = cart.map(item => {
    total += item.price * item.quantity;
    return `
      <div class="cart-item" style="display:flex;align-items:center;gap:1rem;background:#fff;padding:1rem;border-radius:12px;margin-bottom:1rem;box-shadow:0 2px 6px rgba(0,0,0,0.05);">
        <img src="${item.image}" style="width:80px;height:80px;object-fit:cover;border-radius:10px;" />
        <div style="flex:1;">
          <h4 style="margin-bottom:0.3rem;">${item.name}</h4>
          <p style="color:#6c5ce7;font-weight:bold;">$${item.price.toFixed(2)}</p>
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <button onclick="changeQty(${item.id}, -1)" style="width:32px;height:32px;border:none;background:#6c5ce7;color:#fff;border-radius:8px;cursor:pointer;font-weight:bold;">−</button>
          <span style="min-width:24px;text-align:center;font-weight:600;">${item.quantity}</span>
          <button onclick="changeQty(${item.id}, 1)" style="width:32px;height:32px;border:none;background:#6c5ce7;color:#fff;border-radius:8px;cursor:pointer;font-weight:bold;">+</button>
        </div>
        <button onclick="removeItem(${item.id})" style="background:#e74c3c;color:#fff;border:none;padding:0.5rem 0.9rem;border-radius:8px;cursor:pointer;">Remove</button>
      </div>
    `;
  }).join('');

  summary.innerHTML = `
    <div style="background:#fff;padding:1.5rem;border-radius:12px;margin-top:1.5rem;text-align:right;box-shadow:0 2px 6px rgba(0,0,0,0.05);">
      <h3 style="color:#6c5ce7;margin-bottom:1rem;">Total: $${total.toFixed(2)}</h3>
      <button class="btn-primary" onclick="location.href='checkout.html'" style="background:#00b894;padding:0.9rem 2rem;">
        Proceed to Checkout →
      </button>
    </div>
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
  showToast('Item removed');
}

document.addEventListener('DOMContentLoaded', renderCart);