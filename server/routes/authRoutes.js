const express = require('express');
const router = express.Router();
const path = require('path');

// Rutas para servir páginas HTML
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client', 'login.html'));
});

router.get('/sede', (req, res) => {
    if (req.session.loggedIn) {
        res.sendFile(path.join(__dirname, '../../client', 'sede.html'));
    } else {
        res.redirect('/login');
    }
});

router.get('/home', (req, res) => {
    if (req.session.loggedIn && req.session.sede) {
        res.sendFile(path.join(__dirname, '../../client', 'home.html'));
    } else {
        res.redirect('/login'); // Redirigir a login si no está autenticado o no se ha seleccionado una sede
    }
});


router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client', 'register.html'));
});

router.get('/ventas', (req, res) => {
    if (req.session.loggedIn) {
        res.sendFile(path.join(__dirname, '../../client', 'sede.html'));
    } else {
        res.redirect('/login');
    }
});

router.get('/printResponse', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const response = {
        entries: [
            { text: "Comprobante de Venta", bold: true, align: "center", format: "double-height" },
            { text: "Fecha: " + new Date().toLocaleDateString('es-ES'), bold: false, align: "center", format: "normal" },
            { text: "Cantidad de Entradas: 3", bold: false, align: "left", format: "normal" },
            { text: "Costo Total: S./" + (5 * 3).toFixed(2), bold: false, align: "left", format: "normal" },
            { text: "Código: ABC123", bold: true, align: "center", format: "double-width" }
        ]
    };
    res.json(response);
});




module.exports = router;
