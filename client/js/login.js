document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login fallido: Usuario o contraseña incorrectos');
        }
        return response.json();
    })
    .then(data => {
        console.log('Login exitoso:', data);
        // Redireccionar a la página de ventas (home.html)
        window.location.href = '/sede';  // Asegúrate de que este es el camino correcto para tu página de ventas
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
});
