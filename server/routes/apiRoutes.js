const express = require('express');
const router = express.Router();
const connection = require('../config/database');
const bcrypt = require('bcryptjs');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Ruta para registrar usuarios
router.post('/register', async (req, res) => {
    const { username, password, firstName, lastName, dni } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8); 

    connection.query('INSERT INTO users (username, password, firstName, lastName, dni) VALUES (?, ?, ?, ?, ?)', 
    [username, hashedPassword, firstName, lastName, dni], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al registrar el usuario.');
        }
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    });
});

// Ruta para el login de los usuarios
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            return res.status(500).send('Error en el servidor');
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Usuario no existente' });
        }
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Contraseña errónea' });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        res.json({ message: 'Login exitoso', user: user });
    });
});

router.post('/setSede', (req, res) => {
    if (req.session && req.body.sede) {
        req.session.sede = req.body.sede; // Guardar la sede en la sesión
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false, message: 'Sede no proporcionada o sesión no iniciada' });
    }
});


function generateNewCodeForSale(sede, date, lastCode) {
    const newCodeNumber = lastCode ? parseInt(lastCode.split('-')[1]) + 1 : 1;
    const formattedCodeNumber = newCodeNumber.toString().padStart(2, '0');
    return `${sede}${date.replace(/-/g, '').slice(4)}-${formattedCodeNumber}`;
}

// Ruta para registrar ventas
router.post('/registerSale', (req, res) => {
    console.log('Sede recibida en el backend:', req.body.sede);
    const { quantity, total, sede, date } = req.body; // Asegúrate de recibir 'sede'
    if (!sede) {
        return res.status(400).json({ message: 'La sede no fue proporcionada.' });
    }
    // Generación y registro de la venta con la sede
    connection.query(
        'SELECT codigo_unico FROM ventas WHERE sede = ? AND DATE(fecha) = ? ORDER BY id DESC LIMIT 1',
        [sede, date],
        (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error al consultar el último código.', error: err.message });
            }

            let lastCode = 0;
            if (results.length > 0) {
                lastCode = parseInt(results[0].codigo_unico.split('-')[1]);
            }
            const newCode = lastCode + 1;
            const uniqueCode = `${sede}${date.replace(/-/g, '').slice(4)}-${newCode.toString().padStart(2, '0')}`;

            connection.query(
                'INSERT INTO ventas (fecha, cantidad, total, codigo_unico, sede) VALUES (?, ?, ?, ?, ?)',
                [date, quantity, total, uniqueCode, sede],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error al registrar la venta.', error: err.message });
                    }
                    res.json({ message: 'Venta registrada con éxito', code: uniqueCode });
                }
            );
        }
    );
});

//generar el reporte diario de ventas
router.get('/generateDailyReport', (req, res) => {
    const { date } = req.query;

    connection.query(
        'SELECT sede, COUNT(*) as total_tickets, SUM(total) as total_income FROM ventas WHERE DATE(fecha) = ? GROUP BY sede',
        [date],
        (err, results) => {
            if (err) {
                console.error('Error al obtener datos de ventas:', err);
                return res.status(500).json({ success: false, message: 'Error al generar el reporte.' });
            }

            const reportData = {
                date: date,
                sections: results
            };

            res.json({ success: true, report: reportData });
        }
    );
});









module.exports = router;



