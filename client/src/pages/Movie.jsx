import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { getMovieDetail } from "../redux/movieSlice";

const Movie = () => {
    const { id: movieId } = useParams();
    const dispatch = useDispatch();
    const { movieDetail, loading } = useSelector(store => store.movieState);

    useEffect(() => {
        if (movieId) {
            dispatch(getMovieDetail(movieId));
        }

    }, [movieId]);

    return loading ? <div className='movie-container'>Loading...</div> : <div className='movie-container'>
        Movie Detail: {movieDetail ? <div>
            <h1>{movieDetail.name}</h1>
            <img src={movieDetail.poster} alt={movieDetail.name} />
        </div> : 'No Movie Found'}
    </div>
}

export default Movie;