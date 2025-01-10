window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        alert('No product ID specified. Redirecting back.');
        window.location.href = "../HomePage/Home.html";
        return;
    }

    const username = sessionStorage.getItem('username');
    const password = sessionStorage.getItem('password');

    if (!username || !password) {
        alert('You are not logged in.');
        window.location.href = '../LoginPage/Login.html';
        return;
    }

    const encodedCredentials = btoa(`${username}:${password}`);

    fetch(`https://localhost:7176/api/Products/${productId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${encodedCredentials}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }
            return response.json();
        })
        .then(product => {
            displayProduct(product);
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
            alert('Failed to load product details.');
            window.location.href = "../HomePage/Home.html";
        });
};

function displayProduct(product) {
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = `₱${product.price.toFixed(2)}`;
    document.getElementById('product-stock').textContent = `Stock: ${product.stock}`;
}

function goBack() {
    window.location.href = "../HomePage/Home.html"; 
}

function editProduct() {
    const productId = getProductId();
    window.location.href = `../Edit/EditProduct.html?id=${productId}`; 
}

function deleteProduct() {
    const productId = getProductId();
    const username = sessionStorage.getItem('username');
    const password = sessionStorage.getItem('password');
    const encodedCredentials = btoa(`${username}:${password}`);

    if (confirm('Are you sure you want to delete this product?')) {
        fetch(`https://localhost:7176/api/Products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Basic ${encodedCredentials}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete product');
                }
                alert('Product deleted successfully');
                window.location.href = "../HomePage/Home.html"; 
            })
            .catch(error => {
                console.error('Error deleting product:', error);
                alert('Failed to delete product.');
            });
    }
}

function getProductId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}
