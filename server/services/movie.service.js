const MovieModel = require('../models/movieModel');

const getMovies = async (where = null, limit = 20, orderBy = "_id", direction = 1) => {
    // Return list of movies based on filter criteria, pagination and sorting.
    // Return limited details of movies (id, title, release date, timestamp, thumbnail) for admin listing page.
    // Manage Movie Listings.
    const movies = await MovieModel
        .find(where)
        .select('id name release_date thumbnail poster')
        .limit(limit)
        .sort({
            [orderBy]: direction
        });

    return movies;
}

const getScheduledMovies = async () => {
    // @TODO: Return movies those have scheduled shows in future.
    // Get all the theaters in selected region.
    // Get all the future shows grouped bby movie and return the movie details for those movies.
    const currentDate = new Date();
    const scheduledMovies = await MovieModel.find({ releaseDate: { $gt: currentDate } });
    return scheduledMovies;
}

const getLatestMovies = async (where = null, limit = 20, orderBy = "_id", direction = 1) => {
    //Return latest movies based on release date. Support pagination and sorting.
    // Return limited details of movies (id, title, release date) for listing page.
    // and Top Carousel on home page.
    const latestMovies = await MovieModel.find(where).sort({
        releaseDate: -1, [
            orderBy
        ]: direction
    }).limit(limit);

    return latestMovies;
}

const getMovieCarouselData = async () => {
    // Return movies for carousel on home page. Support pagination and sorting.
    // Return limited details of movies (id, title, release date, timestamp, thumbnail) for carousel on home page.
    const carouselMovies = await MovieModel
        .find({ status: 'active' })
        .select('id name release_date poster')
        .sort({ releaseDate: -1 })
        .limit(10);

    return carouselMovies;
}

const getMovieDetail = async (movieId) => {
    const movie = await MovieModel.findById(movieId);
    return movie;
}

const addMovie = async (req, res) => {
    try {
        let { title, description, releaseDate, posterUrl, thumbnailUrl } = req.body;

        const newMovie = new MovieModel({
            title: title,
            description: description,
            release_date: releaseDate,
            poster: posterUrl,
            thumbnail: thumbnailUrl,

        });

        await newMovie.save();

        res.send({
            message: `Movie: ${inputData.title} - Added`
        });
    } catch (error) {
        res.status(500).send({ message: 'Error adding movie' });
    }
}

const updateMovie = async (movieId, updateData) => {
    // Update movie details. Only admin can update a movie.
    const updatedMovie = await MovieModel.findByIdAndUpdate(movieId, updateData);
    return updatedMovie;
}

module.exports = {
    getMovies,
    getMovieDetail,
    getLatestMovies,
    getMovieCarouselData,
    updateMovie,
    addMovie
}
