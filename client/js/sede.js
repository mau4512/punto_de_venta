function selectSede(sede) {
    // Almacenar la sede en sessionStorage para uso local en el cliente
    sessionStorage.setItem('sede', sede);
    console.log('Sede seleccionada y almacenada en sessionStorage:', sede);

    // Opcionalmente hacer la solicitud al servidor si necesitas procesar algo allí
    fetch('/api/setSede', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sede })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al procesar la sede en el servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Sede procesada con éxito en el servidor');
            window.location.href = '/home.html'; // Redirigir a la página de ventas
        } else {
            alert('Error al seleccionar la sede: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error de conexión al seleccionar la sede: ' + error.message);
    });
}


function setSede(sede) {
    sessionStorage.setItem('sede', sede);
    window.location.href = '/home.html'; // Asegúrate que esta ruta es correcta y lleva a tu página de ventas
}
