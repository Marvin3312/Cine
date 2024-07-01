// ticketsRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Configuración de conexión a MySQL

router.post('/', (req, res) => {
    const { showtime_id, seats, price } = req.body;
    const soldAt = new Date().toISOString();

    // Validar que se hayan seleccionado asientos
    if (!Array.isArray(seats) || seats.length === 0) {
        return res.status(400).json({ error: 'No se han seleccionado asientos' });
    }

    const hall_id = req.body.hall_id; // Obtener hall_id de req.body si es necesario

    // Verificar que los seat_ids proporcionados existan en la tabla seats
    const sqlCheckSeats = 'SELECT id FROM seats WHERE hall_id = ? AND id IN (?)';
    db.query(sqlCheckSeats, [hall_id, seats], (err, results) => {
        if (err) {
            console.error('Error al verificar los seat_ids:', err);
            return res.status(500).json({ error: 'Error interno al verificar los asientos' });
        }

        // Obtener un arreglo de seat_ids válidos
        const validSeatIds = results.map(row => row.id);

        // Verificar que todos los seat_ids sean válidos
//        const invalidSeats = seats.filter(seat => !validSeatIds.includes(seat));
  //      if (invalidSeats.length > 0) {
    //        return res.status(400).json({ error: 'Uno o más asientos seleccionados no son válidos' });
      //  }

        // Construir el query para insertar los tickets
        const sqlInsertTicket = 'INSERT INTO tickets (showtime_id, seat_id, price, sold_at) VALUES ?';
        const values = seats.map(seat => [showtime_id, seat, price, soldAt]);

        // Insertar los tickets en la base de datos
        db.query(sqlInsertTicket, [values], (err, result) => {
            if (err) {
                console.error('Error al insertar tickets:', err);
                return res.status(500).json({ error: 'Error al insertar tickets' });
            }
            res.status(201).json({ message: 'Tickets comprados exitosamente', insertedRows: result.affectedRows });
        });
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

// DELETE - Eliminar un ticket para un asiento específico
router.delete('/delete/:seat_id', (req, res) => {
    const { seat_id } = req.params;

    const sqlDeleteTicket = 'DELETE FROM tickets WHERE seat_id = ?';
    db.query(sqlDeleteTicket, [seat_id], (err, result) => {
        if (err) {
            console.error('Error al eliminar ticket:', err);
            res.status(500).json({ error: 'Error al eliminar ticket' });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({ message: 'Ticket cancelado exitosamente' });
        } else {
            res.status(404).json({ error: 'No se encontró ningún ticket con el ID de asiento proporcionado' });
        }
    });
});

// POST - Liberar asientos seleccionados
router.post('/release', (req, res) => {
    const { seats, showtime_id } = req.body;

    // Validar que se hayan seleccionado asientos
    if (!Array.isArray(seats) || seats.length === 0) {
        return res.status(400).json({ error: 'No se han seleccionado asientos' });
    }

    // Construir el query para eliminar los tickets de los asientos seleccionados
    const sqlDeleteTickets = 'DELETE FROM tickets WHERE showtime_id = ? AND seat_id IN (?)';
    const values = [showtime_id, seats];

    // Eliminar los tickets de la base de datos
    db.query(sqlDeleteTickets, values, (err, result) => {
        if (err) {
            console.error('Error al liberar asientos en la base de datos:', err);
            return res.status(500).json({ error: 'Error al liberar asientos en la base de datos' });
        }
        res.status(200).json({ message: 'Asientos liberados exitosamente', deletedRows: result.affectedRows });
    });
});


// GET - Obtener todas las tickets
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM tickets';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error al obtener tickets:', err);
            res.status(500).json({ error: 'Error al obtener ticket' });
            return;
        }
        res.json(result);
    });
});

// DELETE - Eliminar todos los tickets de una sala específica
router.delete('/delete/all/:showtime_id', (req, res) => {
    const { showtime_id } = req.params;

    const sqlDeleteTickets = 'DELETE FROM tickets WHERE showtime_id = ?';
    db.query(sqlDeleteTickets, [showtime_id], (err, result) => {
        if (err) {
            console.error('Error al eliminar todos los tickets:', err);
            res.status(500).json({ error: 'Error al eliminar todos los tickets' });
            return;
        }

        res.json({ message: `Todos los tickets del showtime_id ${showtime_id} han sido eliminados exitosamente`, deletedRows: result.affectedRows });
    });
});

module.exports = router;