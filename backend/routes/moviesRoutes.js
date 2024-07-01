const express = require('express');
const router = express.Router();
const db = require('../db'); // Configuración de conexión a MySQL

// GET - Obtener todas las películas
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM movies';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error al obtener películas:', err);
            res.status(500).json({ error: 'Error al obtener películas' });
            return;
        }
        res.json(result);
    });
});

// POST - Agregar una nueva película
router.post('/', (req, res) => {
    const { title, description, duration, rating } = req.body;
    const sql = 'INSERT INTO movies (title, description, duration, rating) VALUES (?, ?, ?, ?)';
    db.query(sql, [title, description, duration, rating], (err, result) => {
        if (err) {
            console.error('Error al agregar película:', err);
            res.status(500).json({ error: 'Error al agregar película' });
            return;
        }
        res.status(201).json({ message: 'Película agregada exitosamente', id: result.insertId });
    });
});

// PUT - Actualizar una película por ID
router.put('/:id', (req, res) => {
    const { title, description, duration, rating } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE movies SET title=?, description=?, duration=?, rating=? WHERE id=?';
    db.query(sql, [title, description, duration, rating, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar película:', err);
            res.status(500).json({ error: 'Error al actualizar película' });
            return;
        }
        res.json({ message: 'Película actualizada exitosamente', affectedRows: result.affectedRows });
    });
});

// DELETE - Eliminar una película por ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM movies WHERE id=?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar película:', err);
            res.status(500).json({ error: 'Error al eliminar película' });
            return;
        }
        res.json({ message: 'Película eliminada exitosamente', affectedRows: result.affectedRows });
    });
});

module.exports = router;