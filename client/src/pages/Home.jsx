import React, { useState, useEffect } from "react";
import apiClient from "../util/api_client";
import MovieCard from "../components/MovieCard";
import { Flex, Carousel } from 'antd';

import { useSelector, useDispatch } from "react-redux";
import { getMovies } from "../redux/movieSlice";

const Home = () => {
    // const [movies, setMovies] = useState([]);
    // const [loading, setLoading] = useState(false);
    const [error, setError] = useState();

    const { loading, movies } = useSelector(store => store.movieState);
    const dispatch = useDispatch();
    console.log(movies);

    useEffect(() => {
        dispatch(getMovies());

        // setLoading(true);
        // apiClient.get('movies')
        //     .then(response => {
        //         setMovies(response?.data);
        //         console.log(response);
        //     })
        //     .catch(err => {
        //         console.log(err?.response?.data);
        //         setError(err?.response?.data?.error);
        //     })
        //     .finally(() => {
        //         setLoading(false)
        //     });
    }, []);

    const contentStyle = {
        color: '#fff',
        lineHeight: '160px',
        width: '100%',
        textAlign: 'center',
        background: '#364d79',
    }

    return <div className="home">
        <Carousel effect="fade">
            <div>
                <img style={contentStyle} alt="Latest Movies" src="https://assets-in.bmscdn.com/promotions/cms/creatives/1731329344693_anyasaindiatourwebshowcase1240x300bengaluru.jpg" />
            </div>
            <div>
                <img style={contentStyle} alt="Latest Movies" src="https://assets-in.bmscdn.com/promotions/cms/creatives/1730702092209_indiatourforweb1.jpg" />
            </div>
            <div>
                <img style={contentStyle} alt="Latest Movies" src="https://assets-in.bmscdn.com/promotions/cms/creatives/1726036566435_playcardnewweb.jpg" />
            </div>
        </Carousel>
        <div className="movies-container">
            <h2>Recommended Movies</h2>
            <Flex wrap gap='large' justify="center">
                {
                    loading ? <div className="loading">Loading...</div> :
                        error ? <div className="error">{error}</div> :
                            movies.map((movie, id) => <MovieCard movie={movie} key={id} />)
                }
            </Flex>
        </div>
    </div>
}

export default Home;