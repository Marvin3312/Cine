// models/Movie.js
class Movie {
    constructor(id, title, description, duration, rating) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.rating = rating;
    }
}

module.exports = Movie;
