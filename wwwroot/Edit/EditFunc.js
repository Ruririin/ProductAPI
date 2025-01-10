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
            populateForm(product);
        })
        .catch(error => {
            console.error('Error fetching product:', error);
            alert('Failed to load product details. Redirecting back.');
            window.location.href = "../HomePage/Home.html";
        });

    document.getElementById('edit-product-form').onsubmit = function (e) {
        e.preventDefault();
        updateProduct(productId, encodedCredentials);
    };
};

function populateForm(product) {
    document.getElementById('name').value = product.name;
    document.getElementById('price').value = product.price;
    document.getElementById('stock').value = product.stock;
}

function updateProduct(productId, encodedCredentials) {
    const name = document.getElementById('name').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const stock = parseInt(document.getElementById('stock').value);

    if (!name || isNaN(price) || isNaN(stock)) {
        alert('Please fill in all fields correctly.');
        return;
    }

    const updatedProduct = {
        id:productId,
        name,
        price,
        stock,
    };

    fetch(`https://localhost:7176/api/Products`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${encodedCredentials}`,
        },
        body: JSON.stringify(updatedProduct),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update product');
            }
            alert('Product updated successfully');
            window.location.href = `../View/ViewProduct.html?id=${productId}`;
        })
        .catch(error => {
            console.error('Error updating product:', error);
            alert('Failed to update product. Please try again later.');
        });
}

function goBack() {
    const productId = new URLSearchParams(window.location.search).get('id');
    window.location.href = `../View/ViewProduct.html?id=${productId}`; 
}
