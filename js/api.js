// Mock API to simulate fetching products from a backend

const DELAY = 500; // Simulate network delay in ms

// Cache for products to avoid recreating them on each call
let productsCache = null;

// Generate mock product data
function generateMockProducts() {
  const categories = ['Guns', 'Missiles', 'Rockets', 'Drones/UAVs'];
 
  const products = [];
  
  // Guns
   products.push({
    id: '1',
    title: 'Desert Eagle',
    price: 105,
    category: 'Guns',
    thumbnail: '/Desert-Eagle.webp',
    rating: 4.8,
    stock: 100,
  });
  products.push({
    id: '2',
    title: 'Uzi',
    price: 115,
    category: 'Guns',
    thumbnail: '/Uzi.jpg',
    rating: 4.8,
    stock: 100,
  });
  products.push({
    id: '3',
    title: 'AK-47',
    price: 200,
    category: 'Guns',
    thumbnail: '/Ak-47.jpg',
    rating: 4.8,
    stock: 100,
  });
   products.push({
    id: '4',
    title: 'M4A1',
    price: 220,
    category: 'Guns',
    thumbnail: '/M4A1.jpeg',
    rating: 4.8,
    stock: 100,
  });
  products.push({
    id: '5',
    title: 'MP5',
    price: 225,
    category: 'Guns',
    thumbnail: '/MP5.jpg',
    rating: 4.8,
    stock: 100,
  });
  products.push({
    id: '6',
    title: 'FN SCAR',
    price: 235,
    category: 'Guns',
    thumbnail: '/FN-SCAR.jpg',
    rating: 4.8,
    stock: 100,
  });



  // Missiles
  products.push({
    id: '7',
    title: 'AGM-114 Hellfire Missile',
    price: 1199,
    category: 'Missiles',
    thumbnail: '/AGM-114-Hellfire.jpg',
    rating: 4.9,
    stock: 20,
  });
   products.push({
    id: '8',
    title: 'Javelin Missile',
    price: 1210,
    category: 'Missiles',
    thumbnail: '/Javelin.jpg',
    rating: 4.7,
    stock: 20,
  });
    products.push({
    id: '9',
    title: 'Stinger Missile',
    price: 1160.00,
    category: 'Missiles',
    thumbnail: '/Stinger.jpg',
    rating: 4.5,
    stock: 20,
  });
    products.push({
    id: '10',
    title: 'PL-15 Missile',
    price: 2200.00,
    category: 'Missiles',
    thumbnail: '/PL-15.webp',
    rating: 5.0,
    stock: 20,
  });
    products.push({
    id: '11',
    title: 'Tomahawk Missile',
    price: 1900.00,
    category: 'Missiles',
    thumbnail: '/Tomahawk1.jpeg',
    rating: 4.9,
    stock: 20,
  });
   products.push({
    id: '12',
    title: 'Exocet Missile',
    price: 2500.00,
    category: 'Missiles',
    thumbnail: '/Exocet.jpg',
    rating: 4.9,
    stock: 20,
  });

  // Rockets
  products.push({
    id: '13',
    title: 'RPG-7',
    price: 1400.00,
    category: 'Rockets',
    thumbnail: '/RPG-7.jpg',
    rating: 4.8,
    stock: 25,
  });
  products.push({
    id: '14',
    title: 'Qassam Rocket',
    price: 1250.00,
    category: 'Rockets',
    thumbnail: '/Qassam-Rocket1.jpg',
    rating: 4.9,
    stock: 25,
  });
  products.push({
    id: '15',
    title: 'J-80',
    price: 1100.00,
    category: 'Rockets',
    thumbnail: '/J-80.png',
    rating: 4.9,
    stock: 25,
  });
  
  // Drones/UAVs
  products.push({
    id: '16',
    title: 'Bayraktar TB2',
    price: 1800.00,
    category: 'Drones/UAVs',
    thumbnail: '/Bayraktar-TB2.jpg',
    rating: 4.9,
    stock: 30,
  });
  products.push({
    id: '17',
    title: 'MQ-9 Reaper',
    price: 2500.00,
    category: 'Drones/UAVs',
    thumbnail: '/MQ-9-Reaper.webp',
    rating: 4.8,
    stock: 30,
  });
   products.push({
    id: '18',
    title: 'Shahed-136',
    price: 2100.00,
    category: 'Drones/UAVs',
    thumbnail: '/Shahed-136.jpg',
    rating: 4.8,
    stock: 30,
  });
  
  return products;
}

// Fetch all products
export async function fetchProducts() {
  // Simulate network request
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate products if not cached
      if (!productsCache) {
        productsCache = generateMockProducts();
      }
      resolve(productsCache);
    }, DELAY);
  });
}

// Fetch product by ID
export async function fetchProductById(id) {
  // Simulate network request
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate products if not cached
      if (!productsCache) {
        productsCache = generateMockProducts();
      }
      
      const product = productsCache.find(p => p.id === id);
      resolve(product || null);
    }, DELAY);
  });
}

// Fetch products by category
export async function fetchProductsByCategory(category) {
  // Simulate network request
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate products if not cached
      if (!productsCache) {
        productsCache = generateMockProducts();
      }
      
      const products = productsCache.filter(p => p.category.toLowerCase() === category.toLowerCase());
      resolve(products);
    }, DELAY);
  });
}

// Search products
export async function searchProducts(query) {
  // Simulate network request
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate products if not cached
      if (!productsCache) {
        productsCache = generateMockProducts();
      }
      
      const lowerQuery = query.toLowerCase();
      const products = productsCache.filter(p => 
        p.title.toLowerCase().includes(lowerQuery) || 
        p.description.toLowerCase().includes(lowerQuery) || 
        p.category.toLowerCase().includes(lowerQuery) || 
        p.brand.toLowerCase().includes(lowerQuery)
      );
      
      resolve(products);
    }, DELAY);
  });
}