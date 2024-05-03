const mysql = require('mysql');

// Configuración de la conexión a la base de datos MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'tickets'
});

connection.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos MySQL:', err.message);
        process.exit(1);  // Terminar la ejecución si hay un error de conexión
    }
    console.log('Conectado a la base de datos MySQL.');
});

module.exports = connection;
