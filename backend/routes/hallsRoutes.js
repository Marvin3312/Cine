const express = require('express');
const router = express.Router();
const db = require('../db'); // Configuración de conexión a MySQL

// GET - Obtener todas las salas
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM halls';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error al obtener salas:', err);
            res.status(500).json({ error: 'Error al obtener salas' });
            return;
        }
        res.json(result);
    });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM halls WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al obtener sala:', err);
            res.status(500).json({ error: 'Error al obtener sala' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ error: 'Sala no encontrada' });
            return;
        }
        res.json(result[0]); // Devuelve solo el primer resultado (debería ser único por ID)
    });
});

// POST - Agregar una nueva sala
router.post('/', (req, res) => {
    const { name, seat_capacity } = req.body;
    const sql = 'INSERT INTO halls (name, seat_capacity) VALUES (?, ?)';
    db.query(sql, [name, seat_capacity], (err, result) => {
        if (err) {
            console.error('Error al agregar sala:', err);
            res.status(500).json({ error: 'Error al agregar sala' });
            return;
        }
        res.status(201).json({ message: 'Sala agregada exitosamente', id: result.insertId });
    });
});

// PUT - Actualizar una sala por ID
router.put('/:id', (req, res) => {
    const { name, seat_capacity } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE halls SET name=?, seat_capacity=? WHERE id=?';
    db.query(sql, [name, seat_capacity, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar sala:', err);
            res.status(500).json({ error: 'Error al actualizar sala' });
            return;
        }
        res.json({ message: 'Sala actualizada exitosamente', affectedRows: result.affectedRows });
    });
});

// DELETE - Eliminar una sala por ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM halls WHERE id=?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar sala:', err);
            res.status(500).json({ error: 'Error al eliminar sala' });
            return;
        }
        res.json({ message: 'Sala eliminada exitosamente', affectedRows: result.affectedRows });
    });
});

module.exports = router;