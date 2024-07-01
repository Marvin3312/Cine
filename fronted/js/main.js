document.addEventListener('DOMContentLoaded', function() {
    fetchShowtimes();
});

function fetchShowtimes() {
    fetch('http://127.0.0.1:5000/api/showtimes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
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
                                <a href="salas.html?hall_id=${showtime.hall_id}&showtime_id=${showtime.id}" class="btn btn-primary">Seleccionar Asientos</a>
                            </div>
                        </div>
                    `;
                    showtimesContainer.appendChild(showtimeCard);
                });
            }
        })
        .catch(error => console.error('Error fetching showtimes:', error));
}
