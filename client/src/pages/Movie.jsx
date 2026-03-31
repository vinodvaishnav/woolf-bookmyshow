import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Image } from 'antd';

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

    return loading ?
        <div className='movie-container'>Loading...</div> :
        <div className='movie-container'>
            {
                movieDetail ?
                    <div className='movie-detail'>
                        <div className="info" style={{ backgroundImage: `url(${movieDetail.poster})` }}>
                            <Image
                                width={200}
                                alt={movieDetail.name}
                                src={movieDetail.thumbnail}
                                preview={false}
                            >
                            </Image>
                            <div>
                                <h1>{movieDetail.name}</h1>
                            </div>
                        </div>
                        <div className="movie-detail2">
                            <h2>About Movie</h2>
                            <p>{movieDetail.description}</p>
                        </div>
                    </div>
                    : 'No Movie Found'
            }
        </div >
}

export default Movie;