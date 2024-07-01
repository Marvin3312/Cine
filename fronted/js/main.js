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
                                <button class="btn btn-info mt-2" onclick="openUpdateModal(${showtime.id}, '${showtime.movie_title}', '${showtime.show_time}')">Actualizar</button>
                            </div>
                        </div>
                    `;
                    showtimesContainer.appendChild(showtimeCard);
                });
            }
        })
        .catch(error => console.error('Error fetching showtimes:', error));
}

function openUpdateModal(showtimeId, movieTitle, showtime) {
    const movieTitleInput = document.getElementById('movieTitleInput');
    const showtimeInput = document.getElementById('showtimeInput');
    const showtimeIdInput = document.getElementById('showtimeIdInput');

    if (movieTitleInput && showtimeInput && showtimeIdInput) {
        movieTitleInput.value = movieTitle;
        showtimeInput.value = new Date(showtime).toLocaleString();
        showtimeIdInput.value = showtimeId;

        $('#updateShowtimeModal').modal('show');
    }
}

function saveShowtimeChanges() {
    const movieTitle = document.getElementById('movieTitleInput').value;
    const showtimeId = document.getElementById('showtimeIdInput').value;

    const url = `http://127.0.0.1:5000/api/showtimes/${showtimeId}`;
    const formData = {
        movie_title: movieTitle,
        // Aquí puedes agregar otros campos que desees actualizar (por ejemplo, show_time)
    };

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Cambios guardados exitosamente:', data);
        $('#updateShowtimeModal').modal('hide');
        fetchShowtimes(); // Actualizar la lista de horarios después de guardar los cambios
    })
    .catch(error => {
        console.error('Error al guardar cambios:', error);
    });
}
