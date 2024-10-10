// Function to fetch products from the API and display them
async function fetchProducts() {
    const response = await fetch('https://dummyjson.com/products'); // Limit to 8 products
    const data = await response.json();
    const products = data.products;

    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = '';
    products.forEach(product => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <h3><span>★</span> ${product.rating}</h3>
            <img src="${product.thumbnail}" alt="${product.images}">
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <h6>Rp. ${product.price}</h6>
        `;
        menuContainer.appendChild(menuItem);
    });
}

// Call the function to fetch products on page load
fetchProducts();
