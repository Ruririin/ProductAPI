const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        errorMessage.textContent = "Please fill in both fields.";
        return;
    }

    // Call the login API
    fetch('https://localhost:7176/api/User/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Invalid credentials");
            }
            return response.json();
        })
        .then(data => {
            // Store credentials for future API calls
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('password', password);

            // Redirect to homepage
            window.location.href = '/HomePage/Home.html';
        })
        .catch(err => {
            errorMessage.textContent = err.message;
        });
});
