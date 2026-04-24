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

const updateMovie = async (req, res) => {
    try {
        const movieId = req.params.movieId;
        const inputData = req.body;

        // @TODO: Add authorization check - only admin can update a movie

        const updatedMovie = await movieService.updateMovie(movieId, inputData);
        if (!updatedMovie) {
            return res.status(404).send({ message: 'Movie not found' });
        }

        res.send({
            message: `Movie: ${inputData.title} - Updated successfully`,
            data: updatedMovie
        });
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).send({ message: 'Error updating movie' });
    }
}

const deleteMovie = async (req, res) => {
    try {
        const movieId = req.params.movieId;

        // @TODO: Add authorization check - only admin can delete a movie

        const result = await movieService.deleteMovie(movieId);
        if (!result) {
            return res.status(404).send({ message: 'Movie not found' });
        }

        res.send({ message: `Movie deleted successfully` });
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).send({ message: 'Error deleting movie' });
    }
}

module.exports = {
    getMovies,
    getMovieDetail,
    addMovie,
    updateMovie,
    deleteMovie,
    getCarouselData
}