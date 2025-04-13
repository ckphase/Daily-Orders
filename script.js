// Product Data
const products = [
    {
        id: 1,
        name: "Fresh Bread",
        price: 75,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=500",
        description: "Freshly baked artisan bread"
    },
    {
        id: 2,
        name: "Milk",
        price: 65,
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=500",
        description: "Farm fresh whole milk"
    },
    {
        id: 3,
        name: "Eggs",
        price: 120,
        image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=500",
        description: "Free-range organic eggs"
    },
    {
        id: 4,
        name: "Fresh Vegetables",
        price: 180,
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=500",
        description: "Seasonal organic vegetables"
    }
];

// State Management
let cart = [];

// DOM Elements
const productView = document.getElementById('productView');
const checkoutView = document.getElementById('checkoutView');
const productsGrid = document.getElementById('productsGrid');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const totalAmount = document.getElementById('totalAmount');
const cartBtn = document.getElementById('cartBtn');
const continueShoppingBtn = document.getElementById('continueShoppingBtn');
const checkoutForm = document.getElementById('checkoutForm');

// Initialize Products
function initializeProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">₹${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            removeFromCart(productId);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    // Update cart count
    cartCount.textContent = cart.length;

    // Update cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₹${item.price.toFixed(2)} each</p>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    // Update total amount
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = total.toFixed(2);
}

// View Management
function showCheckout() {
    productView.classList.add('hidden');
    checkoutView.classList.remove('hidden');
}

function showProducts() {
    checkoutView.classList.add('hidden');
    productView.classList.remove('hidden');
}

// Event Listeners
cartBtn.addEventListener('click', showCheckout);
continueShoppingBtn.addEventListener('click', showProducts);

checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(checkoutForm);
    
    const orderDetails = `
Order Details:
${cart.map(item => `- ${item.name} (${item.quantity}x) - ₹${(item.price * item.quantity).toFixed(2)}`).join('\n')}
Total: ₹${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}

Customer Information:
Name: ${formData.get('name')}
Email: ${formData.get('email')}
Phone: ${formData.get('phone')}
Address: ${formData.get('address')}
    `;

    const mailtoLink = `mailto:orders@dailyessentials.com?subject=New Order&body=${encodeURIComponent(orderDetails)}`;
    window.location.href = mailtoLink;
});

// Initialize the app
initializeProducts();