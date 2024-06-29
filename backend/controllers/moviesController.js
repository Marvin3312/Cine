// controllers/moviesController.js
const Movie = require('../models/Movie');
const mysql = require('mysql');

// función para obtener todas las películas
exports.getAllMovies = (req, res) => {
    // lógica para consultar todas las películas en la base de datos
    const sql = 'SELECT * FROM movies';

    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
};
