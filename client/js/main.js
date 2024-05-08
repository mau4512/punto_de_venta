function processSale() {
    calculateTotal();
    generateReceipt();
}

function calculateTotal() {
    var pricePerTicket = 5; // Precio por entrada
    var count = document.getElementById('ticketCount').value;
    var total = pricePerTicket * count;
    document.getElementById('totalCost').value = 'S./' + total.toFixed(2);
}

function cancelReceipt() {
    var receiptElement = document.getElementById('receipt');
    receiptElement.style.display = 'none';
}

function generateReceipt() {
    // Obtenemos el número de entradas y calculamos el costo total
    var count = document.getElementById('ticketCount').value;
    var total = 5 * count; // Asumiendo que 5 es el precio por entrada
    var formattedDate = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });

    // Actualizamos la interfaz con la información recogida
    document.getElementById('date').textContent = 'Fecha: ' + formattedDate;
    document.getElementById('quantity').textContent = 'Cantidad de Entradas: ' + count;
    document.getElementById('total').textContent = 'Costo Total: S./' + total.toFixed(2);

    // Muestra el recibo en la interfaz
    var receiptElement = document.getElementById('receipt');
    receiptElement.style.display = 'block';
    setTimeout(() => {
        receiptElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function confirmSale() {
    var date = new Date().toISOString().slice(0, 10); // Fecha en formato YYYY-MM-DD
    var quantity = document.getElementById('ticketCount').value;
    var total = document.getElementById('totalCost').value.replace('S./', '');
    var sede = sessionStorage.getItem('sede'); // Recuperando la sede almacenada en sessionStorage
    console.log('Sede antes de enviar:', sede);

    fetch('/api/registerSale', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, quantity, total, sede }) // Incluyendo sede en el cuerpo de la solicitud
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Venta registrada con éxito') {
            alert('Venta registrada con éxito! Código generado: ' + data.code);
            document.getElementById('code').textContent = 'Código Único: ' + data.code;
            document.getElementById('receipt').style.display = 'none';
        } else {
            alert('Error al registrar la venta: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al registrar la venta: ' + error.message);
    });
}






function printReceipt() {
    var receiptWindow = window.open('', '_blank', 'width=200,height=600');
    receiptWindow.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Comprobante de Venta</title>
            <style>
                body {
                    width: 7.5cm;
                    font-family: 'Arial', sans-serif;
                    font-size: 12px;
                    line-height: 1.5;
                    text-align: center;
                    padding: 5mm;
                }
            </style>
        </head>
        <body>
            <h2>Comprobante de Venta</h2>
            <p><strong>Fecha:</strong> ${document.getElementById('date').textContent.split(': ')[1]}</p>
            <p><strong>Cantidad:</strong> ${document.getElementById('quantity').textContent.split(': ')[1]}</p>
            <p><strong>Total:</strong> ${document.getElementById('total').textContent.split(': ')[1]}</p>
            <p><strong>Código:</strong> ${document.getElementById('code').textContent.split(': ')[1]}</p>
        </body>
        </html>
    `);
    receiptWindow.document.close(); 
    receiptWindow.print(); 
    receiptWindow.onfocus = function () { setTimeout(function () { receiptWindow.close(); }, 1000); }
}

function generateDailyReport() {
    const today = new Date().toISOString().slice(0, 10); // Formato YYYY-MM-DD
    fetch('/api/generateDailyReport?date=' + today)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al generar el reporte diario: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            printDailyReport(data.report);
        } else {
            alert('Error al generar el reporte diario');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error de conexión al generar el reporte');
    });
}

function printDailyReport(report) {
    var receiptWindow = window.open('', '_blank', 'width=200,height=600');

    if (!receiptWindow) {
        alert("La ventana emergente fue bloqueada. Por favor, permita las ventanas emergentes para esta aplicación.");
        return;
    }

    var content = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reporte Diario</title>
            <style>
                body {
                    width: 7.5cm;
                    font-family: 'Arial', sans-serif;
                    font-size: 12px;
                    line-height: 1.5;
                    text-align: center;
                    padding: 5mm;
                }
            </style>
        </head>
        <body>
            <h2>Reporte Diario</h2>
            <p><strong>Fecha:</strong> ${report.date}</p>
            ${report.sections.map(section => `
                <h3>Sede: ${section.sede}</h3>
                <p>Total Entradas: ${section.total_tickets}</p>
                <p>Ingresos Totales: S/.${section.total_income.toFixed(2)}</p>
            `).join('')}
        </body>
        </html>
    `;

    receiptWindow.document.write(content);
    receiptWindow.document.close(); // Finish writing to the new window
    receiptWindow.focus(); // Focus on the new window to bring it to the front
    receiptWindow.print(); // Open the print dialog
    receiptWindow.onfocus = function() {
        setTimeout(function() {
            receiptWindow.close();
        }, 1000);
    };
}






