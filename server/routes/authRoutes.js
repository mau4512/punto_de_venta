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

module.exports = router;
