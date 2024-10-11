// Global cart object to store items
let cart = {};

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Fungsi untuk menyimpan cart ke Local Storage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Fungsi untuk mengambil produk dari API
async function fetchProducts() {
    try {
        const response = await fetch("https://dummyjson.com/products?limit=52");
        const data = await response.json();
        const products = data.products;

        // Tambah event listener untuk setiap tombol filter kategori
        const btnFilters = document.querySelectorAll('.btn-filter');
        btnFilters.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault(); // Mencegah default action dari <a> element
                
                // Hapus kelas active dari semua tombol
                btnFilters.forEach(btn => btn.classList.remove('active'));
                
                // Tambah kelas active ke tombol yang diklik
                button.classList.add('active');
                
                // Dapatkan kategori dari tombol
                const category = button.getAttribute('href').substring(1).toLowerCase();
                
                // Tampilkan produk berdasarkan kategori yang dipilih
                if (category === 'all') {
                    displayProducts(products);
                } else {
                    filterByCategory(category, products);
                }
            });
        });

        // Tampilkan semua produk saat pertama kali halaman dimuat
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Fungsi untuk memfilter produk berdasarkan kategori
function filterByCategory(category, products) {
    const filteredProducts = products.filter(product => product.category.toLowerCase() === category);
    displayProducts(filteredProducts);
}

// Fungsi untuk menampilkan produk pada halaman
function displayProducts(products) {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = ''; // Bersihkan konten sebelumnya

    products.forEach(product => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <h3><span>★</span> ${product.rating}</h3>
            <img src="${product.thumbnail}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <h6>Rp. ${product.price}</h6>
            <div class="cart-controls">
                <button class="decrease-quantity" data-id="${product.id}">-</button>
                <span class="quantity" data-id="${product.id}">${cart[product.id]?.quantity || 0}</span>
                <button class="increase-quantity" data-id="${product.id}">+</button>
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        `;
        menuContainer.appendChild(menuItem);
    });

    // Add event listeners to cart buttons
    addCartEventListeners();
}

// add cart event listeners
function addCartEventListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const increaseButtons = document.querySelectorAll('.increase-quantity');
    const decreaseButtons = document.querySelectorAll('.decrease-quantity');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    increaseButtons.forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });

    decreaseButtons.forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
}


// Fungsi untuk menambah kuantitas item di UI
function increaseQuantity(event) {
    const productId = event.target.dataset.id;
    const quantitySpan = document.querySelector(`.quantity[data-id="${productId}"]`);
    let currentQuantity = parseInt(quantitySpan.textContent);

    // Tambah kuantitas di UI
    quantitySpan.textContent = currentQuantity + 1;
}

// Fungsi untuk mengurangi kuantitas item di UI
function decreaseQuantity(event) {
    const productId = event.target.dataset.id;
    const quantitySpan = document.querySelector(`.quantity[data-id="${productId}"]`);
    let currentQuantity = parseInt(quantitySpan.textContent);

    // Kurangi kuantitas di UI, tapi tidak kurang dari 0
    if (currentQuantity > 0) {
        quantitySpan.textContent = currentQuantity - 1;
    }
}

// Fungsi untuk menambahkan item ke cart berdasarkan kuantitas yang dipilih
function addToCart(event) {
    const productId = event.target.dataset.id;

    // Ambil kuantitas dari tampilan UI
    const quantitySpan = document.querySelector(`.quantity[data-id="${productId}"]`);
    const selectedQuantity = parseInt(quantitySpan.textContent);

    if (selectedQuantity === 0) return;

    const productElement = event.target.closest('.menu-item');
    const productName = productElement.querySelector('h2').textContent;
    const productPrice = parseFloat(productElement.querySelector('h6').textContent.replace('Rp. ', ''));
    const productImage = productElement.querySelector('img').src;

    if (!cart[productId]) {
        cart[productId] = {
            name: productName,
            price: productPrice,
            quantity: selectedQuantity,
            image: productImage
        };
    } else {
        cart[productId].quantity += selectedQuantity;
    }

    quantitySpan.textContent = 0;

    saveCartToLocalStorage(); // Simpan cart ke Local Storage
    updateCart();
    updateCartDisplay();
}

// Fungsi untuk menghapus item dari cart
function removeFromCart(productId) {
    delete cart[productId];
    saveCartToLocalStorage(); // Simpan cart ke Local Storage
    updateCart();
    updateCartDisplay();
}

// Function to update quantity of items in the cart
function updateItemQuantity(productId, action) {
    if (cart[productId]) {
        if (action === 'increase') {
            cart[productId].quantity += 1;
        } else if (action === 'decrease') {
            cart[productId].quantity -= 1;

            if (cart[productId].quantity === 0) {
                removeFromCart(productId);
                return;
            }
        }
        saveCartToLocalStorage(); // Simpan cart ke Local Storage
        updateCart();
        updateCartDisplay();
    }
}

// Function to update cart display
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartTotalItems = document.getElementById('cart-total-items');

    // Bersihkan item cart yang ada saat ini
    cartItemsContainer.innerHTML = '';

    // Variabel untuk menyimpan total harga
    let total = 0;
    let totalItems = 0;

    // Periksa apakah ada item di cart
    const cartEntries = Object.entries(cart);
    if (cartEntries.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        // Loop melalui setiap item di cart
        cartEntries.forEach(([productId, item]) => {
            total += item.price * item.quantity;
            totalItems += item.quantity;
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <p>${item.name}</p>
                    <p>Rp. ${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="increase-quantity" onclick="updateItemQuantity(${productId}, 'increase')">+</button>
                    <span class="item-quantity">${item.quantity}</span> 
                    <button class="decrease-quantity" onclick="updateItemQuantity(${productId}, 'decrease')">-</button> 
                    <button class="remove-btn" onclick="removeFromCart(${productId})">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
            cartTotalItems.textContent = `Total Items: ${totalItems}`; 
        });
    }

    // Update total harga di footer
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

// akhir coba coba ------------



// Fungsi untuk memperbarui tampilan cart
function updateCartDisplay() {
    const cartIcon = document.getElementById('cart-icon');
    const totalItems = Object.values(cart).reduce((total, item) => total + item.quantity, 0);
    cartIcon.textContent = totalItems;
}



// Panggil fetchProducts() saat halaman pertama kali dimuat
fetchProducts();

document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    updateCart();
    updateCartDisplay();
    fetchProducts();
});

