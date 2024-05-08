const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const app = express();

// Importar rutas
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');

// Middleware para permitir todas las solicitudes CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Configuración de la sesión
app.use(session({
    secret: 'tu_secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Setear a true si estás usando HTTPS
}));

// Servir archivos estáticos desde la carpeta 'client'
app.use(express.static(path.join(__dirname, '../client')));

// Usar rutas con prefijos específicos
app.use('/api', apiRoutes);
app.use(authRoutes);

app.get('/home', (req, res) => {
    if (req.session.loggedIn) {
        res.sendFile(path.join(__dirname, '../client', 'home.html'));
    } else {
        res.redirect('/login');  // Redirigir a login si no está autenticado
    }
});

// Redirección inicial a la página de login
app.get('/', (req, res) => {
    res.redirect('/login');
});


// Manejador de errores generales
app.use((err, req, res, next) => {
    console.error('Uncaught error:', err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Configurar el puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
