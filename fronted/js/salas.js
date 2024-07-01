document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const hallId = urlParams.get('hall_id');
    const showtimeId = urlParams.get('showtime_id');
    
    if (hallId && showtimeId) {
        fetchHallDetails(hallId);
        fetchSoldSeats(showtimeId);
    } else {
        console.error('No se encontraron hallId o showtimeId en los parámetros de la URL');
    }

    document.getElementById('purchase-button').addEventListener('click', function() {
        purchaseTickets(hallId, showtimeId);
    });

    document.getElementById('cancel-button').addEventListener('click', function() {
        resetSeatSelection();
    });
});

let selectedSeats = [];

function fetchHallDetails(hallId) {
    fetch(`http://127.0.0.1:5000/api/halls/${hallId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const hallDetailsContainer = document.getElementById('hall-details-container');
            if (hallDetailsContainer) {
                hallDetailsContainer.innerHTML = `
                    <div class="col-md-6">
                        <div class="card mb-4 shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">${data.name}</h5>
                                <p class="card-text">Capacidad: ${data.seat_capacity}</p>
                            </div>
                        </div>
                    </div>
                `;
            }
        })
        .catch(error => console.error('Error fetching hall details:', error));
}

function fetchSoldSeats(showtimeId) {
    fetch(`http://127.0.0.1:5000/api/tickets/sold/${showtimeId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const soldSeats = data.soldSeats;
            const hallCapacity = document.getElementById('hall-details-container').querySelector('.card-text');
            createSeats(hallCapacity, soldSeats);
        })
        .catch(error => console.error('Error fetching sold seats:', error));
}

function createSeats(hallCapacity, soldSeats) {
    const seatsContainer = document.getElementById('seats-container');
    const capacity = parseInt(hallCapacity.textContent.split(": ")[1]);
    
    if (seatsContainer) {
        seatsContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar los nuevos datos

        for (let seatNumber = 1; seatNumber <= capacity; seatNumber++) {
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
        showtime_id: parseInt(showtimeId),
        seats: selectedSeats.map(seat => parseInt(seat)),
        price: 100, // Puedes ajustar el precio según tus requerimientos
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
        resetSeatSelection(); // Reiniciar selección de asientos
        fetchSoldSeats(showtimeId); // Actualizar asientos vendidos
    })
    .catch(error => console.error('Error al realizar la compra:', error));
}



function resetSeatSelection() {
    const seatButtons = document.querySelectorAll('.btn-seat');
    seatButtons.forEach(button => {
        button.classList.remove('btn-success');
        button.classList.add('btn-danger');
        button.disabled = false;
    });
    selectedSeats = [];
}
