import React, { useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { Flex, Carousel } from 'antd';

import { useSelector, useDispatch } from "react-redux";
import { getMovies } from "../redux/movieSlice";

const Home = () => {
    const { loading, movies } = useSelector(store => store.movieState);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getMovies());
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
                        !movies.length ? <div className="error">No Movie Show Available now.</div> :
                            movies.map((movie, id) => <MovieCard movie={movie} key={id} />)
                }
            </Flex>
        </div>
    </div>
}

export default Home;