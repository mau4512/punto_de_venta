document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío del formulario automáticamente

    // Recuperar valores del formulario
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const dni = document.getElementById('dni').value;

    // Generar el nombre de usuario a partir de las dos primeras letras del nombre y apellido
    const username = (firstName.slice(0, 2) + lastName.slice(0, 2)).toLowerCase();
    const password = dni; // Usar DNI como contraseña

    // Envía estos detalles al servidor para registrar al usuario
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, firstName, lastName, dni })
    })
    .then(response => {
        if (!response.ok) {  // Verificar primero si la respuesta fue exitosa
            throw new Error('La solicitud falló con el estado: ' + response.status);
        }
        return response.json();  // Solo intenta parsear como JSON si la respuesta fue exitosa
    })
    .then(data => {
        if (data.message === 'Usuario registrado con éxito') {
            alert('Registro exitoso');
            window.location.href = '/login'; // Redirige al usuario al login tras un registro exitoso
        } else {
            alert('Error en el registro: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al procesar la solicitud de registro: ' + error.message);
    });
});

