// Function to fetch products from the API and display them
async function fetchProducts() {
    const response = await fetch('https://dummyjson.com/products?limit=52');
    const data = await response.json();
    const products = data.products;

    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = '';
    products.forEach(product => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <button onclick="addToCart({ id: ${product.id}, name: '${product.title}', price: ${product.price} })">Add to Cart</button>

        `;
        menuContainer.appendChild(menuItem);
    });
}

let cart = []; // Array to store cart items

// Function to add item to cart
function addToCart(item) {
    const foundItem = cart.find(cartItem => cartItem.id === item.id);
    if (foundItem) {
        foundItem.quantity += 1; // Increment quantity if item already exists
    } else {
        cart.push({ ...item, quantity: 1 }); // Add new item with quantity 1
    }
    updateCart();
}

// Function to remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(cartItem => cartItem.id !== itemId);
    updateCart();
}

// Function to update quantity of items in the cart
function updateItemQuantity(itemId, action) {
    const cartItem = cart.find(item => item.id === itemId);
    if (cartItem) {
        if (action === 'increase') {
            cartItem.quantity += 1;
        } else if (action === 'decrease' && cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else if (action === 'decrease' && cartItem.quantity === 1) {
            removeFromCart(itemId);
        }
        updateCart();
    }
}

// Function to update cart display
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cart-total');

    // Clear current cart items
    cartItemsContainer.innerHTML = '';

    // Update cart count and total
    cartCount.textContent = cart.length;
    let total = 0;

    // Display each item in the cart
    cart.forEach(item => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <p>${item.name}</p>
                <p>$${item.price} x ${item.quantity}</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="updateItemQuantity(${item.id}, 'increase')">+</button>
                <span class="item-quantity">${item.quantity}</span> <!-- Display the quantity here -->
                <button onclick="updateItemQuantity(${item.id}, 'decrease')">-</button>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotal.textContent = total.toFixed(2);
}

// Function to toggle cart visibility
function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.classList.toggle('open');
}

// Example function to simulate adding a product to the cart (for demo purposes)
function addExampleItem() {
    const exampleItem = { id: 1, name: 'Burger', price: 9.99 };
    addToCart(exampleItem);
}

// Function for checkout (for demo purposes)
function checkout() {
    alert('Proceed to checkout');
}