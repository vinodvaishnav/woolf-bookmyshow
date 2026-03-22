const movieService = require('../services/movie.service');

const getCarouselData = async (req, res) => {
    try {
        const carouselData = await movieService.getMovieCarouselData();
        res.send(carouselData);
    } catch (error) {
        console.error('Error fetching carousel data:', error);
        res.status(500).send({ message: 'Error fetching carousel data' });
    }
}

const getMovies = async (req, res) => {
    try {
        const movies = await movieService.getMovies();
        res.send(movies);
    } catch (error) {
        // Log the error for debugging purposes 
        // @TODO: Use a proper logging mechanism instead of console.error in production
        console.error('Error fetching movies:', error);
        res.status(500).send({ message: 'Error fetching movies' });
    }

    return;
}

const getMovieDetail = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const movie = await movieService.getMovieDetail(movieId);
        if (!movie) {
            return res.status(404).send({ message: 'Movie not found' });
        }
        res.send(movie);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        res.status(500).send({ message: 'Error fetching movie details' });
    }
}

const addMovie = async (req, res) => {
    let inputData = req.body;

    // login required to add a movie.
    // only admin can add a movie

    res.send({
        message: `Movie: ${inputData.title} - Added`
    });
}

module.exports = {
    getMovies,
    getMovieDetail,
    addMovie,
    getCarouselData
}