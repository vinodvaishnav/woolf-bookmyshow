import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from 'antd';
import { getMovieDetail } from "../redux/movieSlice";

import MovieHero from "../components/MovieHero";
import MovieInfo from "../components/MovieInfo";
import MovieShow from "../components/MovieShow";
import Loading from "../components/Loading";


const Movie = () => {
    const { id: movieId } = useParams();
    const [bookTicket, setBookTicket] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { movieDetail, loading } = useSelector(store => store.movieState);

    useEffect(() => {
        if (movieId) {
            dispatch(getMovieDetail(movieId));
        }
    }, [movieId, dispatch]);

    const handleBookTicket = () => {
        console.log("Book Ticket button clicked for movieId:", movieId);
        console.log("Current setBookTicket in state:", bookTicket);
        setBookTicket(true);
    }

    if (loading) {
        //@TODO: name loading variable to loadingMovieDetail to avoid confusion with loading states of shows and other entities
        return (
            <Loading message="Loading movie details..." />
        );
    }

    if (!movieDetail) {
        return (
            <div className="movie-detail-error">
                <h2>Movie not found</h2>
                <Button onClick={() => navigate('/')}>Back to Home</Button>
            </div>
        );
    }

    return (
        <div className="movie-detail-page">
            <MovieHero movieDetail={movieDetail} bookingHandler={handleBookTicket} />
            {
                bookTicket ?
                    <MovieShow movieId={movieId} />
                    :
                    <MovieInfo movieDetail={movieDetail} />
            }
        </div>
    );
};

export default Movie;