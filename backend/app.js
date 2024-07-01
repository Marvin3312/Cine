const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');

const moviesRoutes = require('./routes/moviesRoutes');
const hallsRoutes = require('./routes/hallsRoutes'); 
const seatsRoutes = require('./routes/seatsRoutes');
const showtimesRoutes = require('./routes/showtimesRoutes'); 
const ticketsRoutes = require('./routes/ticketsRoutes'); // Añadir esta línea

// Configuración de conexión a MySQL
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'cine'
});

// Conectar a MySQL
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
        throw err;
    }
    console.log('Conexión exitosa a MySQL');
});

// Middleware para parsear JSON
app.use(express.json());

// Middleware CORS
app.use(cors());

// Rutas de películas, salas, asientos y horarios de funciones
app.use('/api/movies', moviesRoutes);
app.use('/api/halls', hallsRoutes);
app.use('/api/seats', seatsRoutes);
app.use('/api/showtimes', showtimesRoutes);
app.use('/api/tickets', ticketsRoutes); // Añadir esta línea

// Puerto de escucha
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor backend en ejecución en puerto ${PORT}`);
});