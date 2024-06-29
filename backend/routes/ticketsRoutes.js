const express = require('express');
const router = express.Router();
const db = require('../db'); // Configuración de conexión a MySQL

// POST - Crear tickets para los asientos seleccionados
router.post('/', (req, res) => {
    const { hall_id, seats, showtime_id, price } = req.body;
    const soldAt = new Date();

    if (!Array.isArray(seats) || seats.length === 0) {
        return res.status(400).json({ error: 'No se han seleccionado asientos' });
    }

    const sqlInsertTicket = 'INSERT INTO tickets (showtime_id, seat_id, price, sold_at) VALUES ?';
    const values = seats.map(seat => [showtime_id, seat, price, soldAt]);

    db.query(sqlInsertTicket, [values], (err, result) => {
        if (err) {
            console.error('Error al insertar tickets:', err);
            res.status(500).json({ error: 'Error al insertar tickets' });
            return;
        }
        res.status(201).json({ message: 'Tickets comprados exitosamente', insertedRows: result.affectedRows });
    });
});

// GET - Obtener asientos vendidos para un horario específico
router.get('/sold/:showtime_id', (req, res) => {
    const showtime_id = req.params.showtime_id;

    const sqlGetSoldSeats = 'SELECT seat_id FROM tickets WHERE showtime_id = ?';
    db.query(sqlGetSoldSeats, [showtime_id], (err, result) => {
        if (err) {
            console.error('Error al obtener asientos vendidos:', err);
            res.status(500).json({ error: 'Error al obtener asientos vendidos' });
            return;
        }
        const soldSeats = result.map(row => row.seat_id);
        res.json({ soldSeats });
    });
});

// DELETE - Eliminar un asiento vendido
router.delete('/delete/:ticket_id', (req, res) => {
    const ticket_id = req.params.ticket_id;

    const sqlDeleteTicket = 'DELETE FROM tickets WHERE id = ?';
    db.query(sqlDeleteTicket, [ticket_id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el ticket:', err);
            res.status(500).json({ error: 'Error al eliminar el ticket' });
            return;
        }
        res.status(200).json({ message: 'Ticket eliminado exitosamente', affectedRows: result.affectedRows });
    });
});

module.exports = router;
