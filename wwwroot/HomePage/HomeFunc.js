window.onload = function () {
    const username = sessionStorage.getItem('username');
    const password = sessionStorage.getItem('password');

    if (!username || !password) {
        // Redirect back to login page if not authenticated
        window.location.href = '/LoginPage/login.html';
        return;
    }

    const encodedCredentials = btoa(`${username}:${password}`);

    fetch('https://localhost:7176/api/Products', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${encodedCredentials}`,
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            return response.json();
        })
        .then(data => {
            displayProducts(data);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
};

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; 

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <h3>${product.name}</h3>
            <div class="product-details">
                <p class="price">₱${product.price}</p>
                <p class="stock">${product.stock} in stock</p>
            </div>
        `;
        productList.appendChild(productItem);
    });
}
function setupSearchBar(products) {
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', function () {
        const query = searchBar.value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query)
        );
        displayProducts(filteredProducts);
    });
    }
