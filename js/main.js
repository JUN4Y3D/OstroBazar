import { fetchProducts, fetchProductById } from './api.js';
import { initSlider } from './slider.js';
import { 
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity, 
  getCart, 
  initCartListeners, 
  updateCartUI 
} from './cart.js';

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const startShopping = document.getElementById('start-shopping');
const navbar = document.querySelector('.navbar');

// Initialize app
document.addEventListener('DOMContentLoaded', async function() {
  // Initialize slider
  initSlider();
  
  // Load products
  await loadProducts();
  
  // Initialize cart
  initCartListeners();
  updateCartUI();
  
  // Initialize event listeners
  initEventListeners();
  
  // Initialize navbar scroll effect
  initNavbarScroll();
});

// Load products
async function loadProducts(category = 'all') {
  try {
    // Show loading spinner
    productsGrid.innerHTML = `
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading products...</p>
      </div>
    `;
    
    // Fetch products
    const products = await fetchProducts();
    
    // Filter products by category if needed
    const filteredProducts = category === 'all' 
      ? products 
      : products.filter(product => product.category.toLowerCase() === category.toLowerCase());
    
    // Render products
    renderProducts(filteredProducts);
  } catch (error) {
    console.error('Error loading products:', error);
    productsGrid.innerHTML = `
      <div class="error-message">
        <p>Failed to load products. Please try again later.</p>
      </div>
    `;
  }
}

// Render products
function renderProducts(products) {
  if (products.length === 0) {
    productsGrid.innerHTML = `
      <div class="no-products">
        <p>No products found in this category.</p>
      </div>
    `;
    return;
  }
  
  productsGrid.innerHTML = products.map(product => {
    const discountPercent = product.discountPercentage ? Math.round(product.discountPercentage) : 0;
    const hasDiscount = discountPercent > 0;
    const originalPrice = hasDiscount 
      ? (product.price / (1 - discountPercent / 100)).toFixed(2) 
      : null;
    
    return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-image">
          ${hasDiscount ? `<div class="product-badge">-${discountPercent}%</div>` : ''}
          <img src="${product.thumbnail}" alt="${product.title}" loading="lazy">
        </div>
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <h3 class="product-title">${product.title}</h3>
          <div class="product-price">
            BDT: ${product.price.toFixed(2)}
            ${hasDiscount ? `<span class="original-price">BDT: ${originalPrice}</span>` : ''}
          </div>
          <div class="product-rating">
            <div class="stars">
              ${generateStars(product.rating)}
            </div>
            <span class="count">(${(product.rating)})</span>
          </div>
          <div class="product-actions">
            <button class="add-to-cart-btn" data-id="${product.id}">
              <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // Add event listeners to Add to Cart buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      const productId = e.currentTarget.dataset.id;
      const product = await fetchProductById(productId);
      
      if (product) {
        addToCart(product);
        
        // Visual feedback
        button.innerHTML = '<i class="fas fa-check"></i> Added';
        button.classList.add('added');
        
        setTimeout(() => {
          button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
          button.classList.remove('added');
        }, 1500);
      }
    });
  });
}

// Generate star rating HTML
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  return `
    ${Array(fullStars).fill('<i class="fas fa-star"></i>').join('')}
    ${halfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
    ${Array(emptyStars).fill('<i class="far fa-star"></i>').join('')}
  `;
}

// Initialize event listeners
function initEventListeners() {
  // Category filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Load products by category
      loadProducts(category);
    });
  });
  
  // Cart toggle
  cartIcon.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    overlay.style.opacity = '1';
    overlay.style.visibility = 'visible';
  });
  
  closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
  });
  
  overlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
  });
  
  if (startShopping) {
    startShopping.addEventListener('click', () => {
      cartSidebar.classList.remove('active');
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';
    });
  }
  
  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navbarMenu = document.getElementById('navbar-menu');
  
  if (menuToggle && navbarMenu) {
    menuToggle.addEventListener('click', () => {
      navbarMenu.classList.toggle('active');
      overlay.style.opacity = navbarMenu.classList.contains('active') ? '1' : '0';
      overlay.style.visibility = navbarMenu.classList.contains('active') ? 'visible' : 'hidden';
    });
    
    overlay.addEventListener('click', () => {
      navbarMenu.classList.remove('active');
    });
  }
}

// Initialize navbar scroll effect
function initNavbarScroll() {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}