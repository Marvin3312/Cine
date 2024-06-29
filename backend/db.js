const mysql = require('mysql');

// Configuración de conexión a MySQL
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '', // Reemplaza 'your_password' con la contraseña correcta
    database: 'cine'
});

// Conectar a MySQL
db.connect(err => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
        throw err;
    }
    console.log('Conexión exitosa a MySQL');
});

module.exports = db;
