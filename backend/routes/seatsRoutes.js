const express = require('express');
const router = express.Router();
const db = require('../db'); // Configuración de conexión a MySQL

// GET - Obtener todos los asientos de una sala específica
router.get('/:showtime_id', (req, res) => {
    const { showtime_id } = req.params;

    // Consulta para obtener todos los asientos de la sala específica
    const sqlSeats = 'SELECT * FROM seats WHERE hall_id IN (SELECT hall_id FROM showtimes WHERE id = ?)';
    db.query(sqlSeats, [showtime_id], (err, seatsResult) => {
        if (err) {
            console.error('Error al obtener asientos:', err);
            res.status(500).json({ error: 'Error al obtener asientos' });
            return;
        }

        // Consulta para obtener los IDs de asientos vendidos en tickets
        const sqlTickets = 'SELECT seat_id FROM tickets WHERE showtime_id = ?';
        db.query(sqlTickets, [showtime_id], (err, ticketResult) => {
            if (err) {
                console.error('Error al obtener tickets:', err);
                res.status(500).json({ error: 'Error al obtener tickets' });
                return;
            }

            // Crear un conjunto de IDs de asientos vendidos para rápida búsqueda
            const soldSeats = ticketResult.map(ticket => ticket.seat_id);

            // Marcar la disponibilidad de cada asiento
            seatsResult.forEach(seat => {
                seat.available = !soldSeats.includes(seat.id);
            });

            // Devolver los asientos con disponibilidad marcada
            res.json(seatsResult);
        });
    });
});


// PUT - Actualizar disponibilidad de un asiento por ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { available } = req.body;

    // Consulta para actualizar la disponibilidad de un asiento específico
    const sqlUpdateSeat = 'UPDATE seats SET available = ? WHERE id = ?';
    db.query(sqlUpdateSeat, [available, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar asiento:', err);
            res.status(500).json({ error: 'Error al actualizar asiento' });
            return;
        }
        res.json({ message: 'Asiento actualizado exitosamente', affectedRows: result.affectedRows });
    });
});

module.exports = router;