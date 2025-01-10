window.onload = function () {
    const username = sessionStorage.getItem('username');
    const password = sessionStorage.getItem('password');

    if (!username || !password) {
        alert('You are not logged in.');
        window.location.href = '../LoginPage/Login.html';
        return;
    }

    const encodedCredentials = btoa(`${username}:${password}`);
    fetchAllProducts(encodedCredentials); 
    setupSearchListener(encodedCredentials); 
};

function fetchAllProducts(encodedCredentials) {
    fetch('https://localhost:7176/api/Products', {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${encodedCredentials}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            return response.json();
        })
        .then(products => {
            displayProducts(products);
            window.allProducts = products; 
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            alert('Failed to load products. Please check your connection or try again later.');
        });
}

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; 

    if (products.length === 0) {
        productList.innerHTML = '<p>No products available.</p>';
        return;
    }

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <h3>${product.name}</h3>
            <p class="price">₱${product.price.toFixed(2)}</p>
        `;

        productItem.onclick = function () {
            window.location.href = `../View/ViewProduct.html?id=${product.id}`;
        };

        productList.appendChild(productItem);
    });
}

function setupSearchListener(encodedCredentials) {
    const searchButton = document.getElementById('search-button');
    const searchBar = document.getElementById('search-bar');

    searchButton.onclick = function () {
        const searchQuery = searchBar.value.trim().toLowerCase();

        if (!searchQuery) {
            displayProducts(window.allProducts);
            return;
        }

        const filteredProducts = window.allProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery)
        );

        if (filteredProducts.length === 0) {
            alert('No products found with the given name.');
        }

        displayProducts(filteredProducts);
    };
}
