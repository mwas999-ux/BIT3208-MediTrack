document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    document.getElementById('usernameError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('loginError').textContent    = '';

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    let isValid    = true;

    if (username === '') {
        document.getElementById('usernameError').textContent = 'Username is required';
        isValid = false;
    }
    if (password === '') {
        document.getElementById('passwordError').textContent = 'Password is required';
        isValid = false;
    }
    if (!isValid) return;

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            window.location.href = data.redirect;
        } else {
            document.getElementById('loginError').textContent = '❌ ' + data.message;
        }
    });
});