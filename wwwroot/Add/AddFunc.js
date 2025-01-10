function goBack() {
    window.location.href = "../HomePage/Home.html"; 
}

document.getElementById('add-product-form').onsubmit = function (e) {
    e.preventDefault();

    const username = sessionStorage.getItem('username');
    const password = sessionStorage.getItem('password');

    if (!username || !password) {
        alert('You are not logged in.');
        window.location.href = '../LoginPage/Login.html';
        return;
    }

    const encodedCredentials = btoa(`${username}:${password}`);
    const name = document.getElementById('name').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const stock = parseInt(document.getElementById('stock').value);

    if (!name || isNaN(price) || isNaN(stock)) {
        alert('Please fill in all fields correctly.');
        console.error('Validation failed: Missing or invalid fields.');
        return;
    }

    const productData = {
        name,
        price,
        stock,
    };

    console.log('Sending product data:', productData);

    fetch('https://localhost:7176/api/Products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${encodedCredentials}`,
        },
        body: JSON.stringify(productData),
    })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`Failed to add product: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Product added successfully:', data);
            alert('Product added successfully');
            window.location.href = "../HomePage/Home.html"; 
        })
        .catch(error => {
            console.error('Error adding product:', error);
            alert('Failed to add product. Please try again.');
        });
};
