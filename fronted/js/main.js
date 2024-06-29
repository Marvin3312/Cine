document.addEventListener('DOMContentLoaded', function() {
    fetchShowtimes();
    fetchHalls();
});

function fetchShowtimes() {
    fetch('http://127.0.0.1:5000/api/showtimes')
        .then(response => response.json())
        .then(data => {
            const showtimesContainer = document.getElementById('showtimes-container');
            if (showtimesContainer) {
                showtimesContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar los nuevos datos
                data.forEach(showtime => {
                    const showtimeCard = document.createElement('div');
                    showtimeCard.classList.add('col-md-4');
                    showtimeCard.innerHTML = `
                        <div class="card mb-4 shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">${showtime.movie_title}</h5>
                                <p class="card-text">Sala: ${showtime.hall_name}</p>
                                <p class="card-text">Horario: ${new Date(showtime.show_time).toLocaleString()}</p>
                            </div>
                        </div>
                    `;
                    showtimesContainer.appendChild(showtimeCard);
                });
            }
        })
        .catch(error => console.error('Error fetching showtimes:', error));
}

function fetchHalls() {
    fetch('http://127.0.0.1:5000/api/halls')
        .then(response => response.json())
        .then(data => {
            const hallsContainer = document.getElementById('halls-container');
            if (hallsContainer) {
                hallsContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar los nuevos datos
                data.forEach(hall => {
                    const hallCard = document.createElement('div');
                    hallCard.classList.add('col-md-4');
                    hallCard.innerHTML = `
                        <div class="card mb-4 shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">${hall.name}</h5>
                                <p class="card-text">Capacidad: ${hall.seat_capacity}</p>
                                <a href="salas.html?id=${hall.id}" class="btn btn-primary">Ver Sala</a>
                            </div>
                        </div>
                    `;
                    hallsContainer.appendChild(hallCard);
                });
            }
        })
        .catch(error => console.error('Error fetching halls:', error));
}
