const express = require('express');
const router = express.Router();
const db = require('../db'); // Configuración de conexión a MySQL


// GET - Obtener todos los horarios de funciones con información de películas y salas
router.get('/', (req, res) => {
    const sql = `
        SELECT s.*, m.title AS movie_title, h.name AS hall_name
        FROM showtimes s
        INNER JOIN movies m ON s.movie_id = m.id
        INNER JOIN halls h ON s.hall_id = h.id
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error al obtener horarios de funciones:', err);
            res.status(500).json({ error: 'Error al obtener horarios de funciones' });
            return;
        }
        res.json(result);
    });
});


// GET - Obtener todos los horarios de funciones
/*router.get('/', (req, res) => {
    const sql = 'SELECT * FROM showtimes';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error al obtener horarios de funciones:', err);
            res.status(500).json({ error: 'Error al obtener horarios de funciones' });
            return;
        }
        res.json(result);
    });
});*/



// POST - Agregar un nuevo horario de función
router.post('/', (req, res) => {
    const { movie_id, hall_id, show_time } = req.body;
    const sql = 'INSERT INTO showtimes (movie_id, hall_id, show_time) VALUES (?, ?, ?)';
    db.query(sql, [movie_id, hall_id, show_time], (err, result) => {
        if (err) {
            console.error('Error al agregar horario de función:', err);
            res.status(500).json({ error: 'Error al agregar horario de función' });
            return;
        }
        res.status(201).json({ message: 'Horario de función agregado exitosamente', id: result.insertId });
    });
});

// PUT - Actualizar un horario de función por ID
router.put('/:id', (req, res) => {
    const { movie_id, hall_id, show_time } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE showtimes SET movie_id=?, hall_id=?, show_time=? WHERE id=?';
    db.query(sql, [movie_id, hall_id, show_time, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar horario de función:', err);
            res.status(500).json({ error: 'Error al actualizar horario de función' });
            return;
        }
        res.json({ message: 'Horario de función actualizado exitosamente', affectedRows: result.affectedRows });
    });
});

// DELETE - Eliminar un horario de función por ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM showtimes WHERE id=?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar horario de función:', err);
            res.status(500).json({ error: 'Error al eliminar horario de función' });
            return;
        }
        res.json({ message: 'Horario de función eliminado exitosamente', affectedRows: result.affectedRows });
    });
});

// GET - Obtener un horario de función por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT s.*, m.title AS movie_title, h.name AS hall_name
        FROM showtimes s
        INNER JOIN movies m ON s.movie_id = m.id
        INNER JOIN halls h ON s.hall_id = h.id
        WHERE s.id = ?
    `;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al obtener horario de función:', err);
            res.status(500).json({ error: 'Error al obtener horario de función' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ error: 'Horario de función no encontrado' });
            return;
        }
        res.json(result[0]);
    });
});
module.exports = router;