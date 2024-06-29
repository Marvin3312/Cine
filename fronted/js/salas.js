document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const hallId = urlParams.get('id');
    const showtimeId = urlParams.get('showtime_id'); // Obtener showtime_id de la URL
    if (hallId && showtimeId) {
        fetchHallDetails(hallId, showtimeId);
    } else {
        console.error('No se encontraron hallId o showtimeId en los parámetros de la URL');
    }

    // Añadir evento al botón de compra
    document.getElementById('purchase-button').addEventListener('click', function() {
        purchaseTickets(hallId, showtimeId);
    });

    // Añadir evento al botón de cancelación
    document.getElementById('cancel-button').addEventListener('click', function() {
        cancelTickets(hallId, showtimeId);
    });

    // Añadir evento al botón de volver
    document.getElementById('back-button').addEventListener('click', function() {
        window.history.back();
    });
});

let selectedSeats = [];

function fetchHallDetails(hallId, showtimeId) {
    fetch(`http://127.0.0.1:5000/api/halls/${hallId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const seatCapacity = data.seat_capacity;
            fetchSoldSeats(showtimeId, seatCapacity);
        })
        .catch(error => console.error('Error fetching hall details:', error));
}

function fetchSoldSeats(showtimeId, seatCapacity) {
    fetch(`http://127.0.0.1:5000/api/tickets/sold/${showtimeId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const soldSeats = data.soldSeats;
            createSeats(seatCapacity, soldSeats);
        })
        .catch(error => console.error('Error fetching sold seats:', error));
}

function createSeats(seatCapacity, soldSeats) {
    const seatsContainer = document.getElementById('seats-container');
    if (seatsContainer) {
        seatsContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar los nuevos datos

        for (let seatNumber = 1; seatNumber <= seatCapacity; seatNumber++) {
            const seatButton = document.createElement('button');
            seatButton.classList.add('btn', 'btn-seat', 'm-1');
            seatButton.innerHTML = `Asiento ${seatNumber}`;
            seatButton.dataset.seatNumber = seatNumber;

            if (soldSeats.includes(seatNumber)) {
                seatButton.classList.add('btn-success'); // Asiento vendido
                seatButton.disabled = true;
            } else {
                seatButton.classList.add('btn-danger'); // Asiento disponible
                seatButton.addEventListener('click', function() {
                    toggleSeatSelection(seatButton);
                });
            }

            seatsContainer.appendChild(seatButton);
        }
    } else {
        console.error('No se encontró el contenedor de asientos (seats-container) en el DOM.');
    }
}

function toggleSeatSelection(button) {
    const seatNumber = button.dataset.seatNumber;
    button.classList.toggle('btn-success');
    button.classList.toggle('btn-danger');

    if (button.classList.contains('btn-success')) {
        selectedSeats.push(seatNumber);
    } else {
        selectedSeats = selectedSeats.filter(seat => seat !== seatNumber);
    }
}

function purchaseTickets(hallId, showtimeId) {
    if (selectedSeats.length === 0) {
        alert('Por favor, seleccione al menos un asiento.');
        return;
    }

    const requestData = {
        hall_id: hallId,
        seats: selectedSeats,
        showtime_id: showtimeId,
        price: 100 // Este es un ejemplo, puedes cambiarlo según tus requerimientos
    };

    fetch('http://127.0.0.1:5000/api/tickets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert('¡Compra realizada con éxito!');
        console.log('Respuesta del servidor:', data);
        fetchHallDetails(hallId, showtimeId); // Refrescar la lista de asientos
    })
    .catch(error => console.error('Error al realizar la compra:', error));
}

function cancelTickets(hallId, showtimeId) {
    const seatNumber = selectedSeats.pop();
    if (!seatNumber) {
        alert('No hay asientos seleccionados para cancelar.');
        return;
    }

    fetch(`http://127.0.0.1:5000/api/tickets/delete/${seatNumber}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert('¡Cancelación realizada con éxito!');
        console.log('Respuesta del servidor:', data);
        fetchHallDetails(hallId, showtimeId); // Refrescar la lista de asientos
    })
    .catch(error => console.error('Error al realizar la cancelación:', error));
}
