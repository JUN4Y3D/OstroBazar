// Cart functionality

// Cart data
let cart = [];

/*
// Shipping cost calculation thresholds
const FREE_SHIPPING_THRESHOLD = 100; // Free shipping for orders over $100
const BASE_SHIPPING_COST = 9.99;
*/
 
// Add discount codes
const DISCOUNT_CODES = {
JN4YD: 0.2  // 20% discount
};

// Fixed shipping charge
const FIXED_SHIPPING_COST = 10;

// Initialize cart from localStorage
export function initCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (e) {
      console.error('Error parsing cart from localStorage:', e);
      cart = [];
    }
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Get current cart
export function getCart() {
  return [...cart];
}

// Add item to cart
export function addToCart(product, quantity = 1) {
  // Check if product is already in cart
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    // Update quantity
    existingItem.quantity += quantity;
  } else {
    // Add new item
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: quantity
    });
  }
  
  // Save and update UI
  saveCart();
  updateCartUI();
  
  // Animate cart icon
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.classList.add('bump');
    setTimeout(() => {
      cartCount.classList.remove('bump');
    }, 300);
  }
}

// Remove item from cart
export function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  
  // Save and update UI
  saveCart();
  updateCartUI();
}

// Update cart item quantity
export function updateCartItemQuantity(productId, quantity) {
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    // Ensure quantity is at least 1
    item.quantity = Math.max(1, quantity);
    
    // Save and update UI
    saveCart();
    updateCartUI();
  }
}

// Calculate cart subtotal
export function calculateSubtotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Calculate shipping cost (always fixed)
export function calculateShipping() {
  return FIXED_SHIPPING_COST;
}

// Calculate total
export function calculateTotal() {
  const subtotal = calculateSubtotal();
  const shipping = calculateShipping();
  return subtotal + shipping;
}

// Update cart UI
export function updateCartUI() {
  const cartCount = document.getElementById('cart-count');
  const cartBody = document.getElementById('cart-body');
  const subtotalAmount = document.getElementById('subtotal-amount');
  const shippingAmount = document.getElementById('shipping-amount');
  const totalAmount = document.getElementById('total-amount');
  const cartFooter = document.getElementById('cart-footer');
  
  // Update cart count
  if (cartCount) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Show/hide count based on items
    if (totalItems > 0) {
      cartCount.style.display = 'flex';
    } else {
      cartCount.style.display = 'none';
    }
  }
  
  // Update cart body
  if (cartBody) {
    if (cart.length === 0) {
      cartBody.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <p>Your cart is empty</p>
          <a href="#products" class="btn" id="start-shopping">Start Shopping</a>
        </div>
      `;
      
      // Add event listener to the new start shopping button
      const startShopping = document.getElementById('start-shopping');
      if (startShopping) {
        startShopping.addEventListener('click', () => {
          document.getElementById('cart-sidebar').classList.remove('active');
          document.getElementById('overlay').style.opacity = '0';
          document.getElementById('overlay').style.visibility = 'hidden';
        });
      }
    } else {
      cartBody.innerHTML = cart.map(item => `
  <div class="cart-item" data-id="BDT{item.id}">
    <div class="cart-item-image">
      <img src="${item.thumbnail}" alt="${item.title}">
    </div>
    <div class="cart-item-content">
      <div class="cart-item-title">${item.title}</div>
      <div class="cart-item-price">BDT: ${(item.price * item.quantity).toFixed(2)}</div>
      <div class="cart-item-actions">
        <div class="quantity-control">
          <button class="quantity-btn decrease" data-id="${item.id}">-</button>
          <input type="text" class="quantity-input" value="${item.quantity}" data-id="${item.id}">
          <button class="quantity-btn increase" data-id="${item.id}">+</button>
        </div>
        <button class="remove-item" data-id="${item.id}">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  </div>
`).join('');
;
      // Add event listeners to new buttons
      initCartItemListeners();
    }
  }
  
  // Update cart totals
  const subtotal = calculateSubtotal();
  const shipping = calculateShipping();
  const total = subtotal + shipping;
  
  if (subtotalAmount) {
    subtotalAmount.textContent = `BDT: ${subtotal.toFixed(2)}`;

  }
  
  if (shippingAmount) {
    if (shipping === 0) {
      shippingAmount.textContent = 'FREE';
      shippingAmount.style.color = 'var(--color-success)';
    } else {
      shippingAmount.textContent = `BDT: ${shipping.toFixed(2)}`;
      shippingAmount.style.color = '';
    }
  }
  
  if (totalAmount) {
    totalAmount.textContent = `BDT: ${total.toFixed(2)}`;
  }
  
  // Show/hide cart footer
  if (cartFooter) {
    cartFooter.style.display = cart.length > 0 ? 'block' : 'none';
  }
}

// Initialize event listeners for cart items
function initCartItemListeners() {
  // Decrease quantity buttons
  document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.id;
      const quantityInput = document.querySelector(`.quantity-input[data-id="${productId}"]`);
      const currentQuantity = parseInt(quantityInput.value);
      
      if (currentQuantity > 1) {
        updateCartItemQuantity(productId, currentQuantity - 1);
      }
    });
  });
  
  // Increase quantity buttons
  document.querySelectorAll('.quantity-btn.increase').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.id;
      const quantityInput = document.querySelector(`.quantity-input[data-id="${productId}"]`);
      const currentQuantity = parseInt(quantityInput.value);
      
      updateCartItemQuantity(productId, currentQuantity + 1);
    });
  });
  
  // Quantity input fields
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', () => {
      const productId = input.dataset.id;
      let quantity = parseInt(input.value);
      
      // Validate quantity
      if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
        input.value = '1';
      }
      
      updateCartItemQuantity(productId, quantity);
    });
  });
  
  // Remove item buttons
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.id;
      const cartItem = button.closest('.cart-item');
      
      // Animate removal
      cartItem.style.opacity = '0';
      cartItem.style.transform = 'translateX(20px)';
      
      setTimeout(() => {
        removeFromCart(productId);
      }, 300);
    });
  });
}

// Apply discount code
export function applyDiscountCode(code) {
  const discount = DISCOUNT_CODES[code.toUpperCase()];
  const discountMessage = document.getElementById('discount-message');

  if (discount) {
    const subtotal = calculateSubtotal();
    const discountedSubtotal = subtotal * (1 - discount);
    const total = discountedSubtotal + FIXED_SHIPPING_COST;

    // Update UI
    const subtotalAmount = document.getElementById('subtotal-amount');
    const totalAmount = document.getElementById('total-amount');
    const shippingAmount = document.getElementById('shipping-amount');

  if (subtotalAmount) subtotalAmount.textContent = `BDT: ${discountedSubtotal.toFixed(2)}`;
if (shippingAmount) shippingAmount.textContent = `BDT: ${FIXED_SHIPPING_COST.toFixed(2)}`;
if (totalAmount) totalAmount.textContent = `BDT: ${total.toFixed(2)}`;


    // Show success message
    if (discountMessage) {
      const discountAmount = subtotal * discount;
discountMessage.textContent = `Discount applied: ${code.toUpperCase()} (${discount * 100}% = BDT: ${discountAmount.toFixed(2)})`;

      discountMessage.style.color = 'green';
    }
  } else {
    // Show error message
    if (discountMessage) {
      discountMessage.textContent = 'Invalid discount code';
      discountMessage.style.color = 'red';
    }
  }
}

// Connect discount functionality to the HTML
export function initDiscountListener() {
  const applyDiscountButton = document.getElementById('apply-discount');
  if (applyDiscountButton) {
    applyDiscountButton.addEventListener('click', () => {
      const discountCodeInput = document.getElementById('discount-code');
      if (discountCodeInput) {
        const code = discountCodeInput.value.trim();
        applyDiscountCode(code);
      }
    });
  }
}

// Initialize all cart listeners
export function initCartListeners() {
  // Initialize cart data
  initCart();
  initDiscountListener(); // Initialize discount listener
  
  // Add checkout button listener
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      alert('Checkout functionality would be implemented here in a real e-commerce site!');
    });
  }
}