import { createSlice } from '@reduxjs/toolkit';
import apiClient from '../util/api_client';

const movieSlice = createSlice({
    name: 'movieSlice',
    initialState: {
        movies: [],
        movieDetail: null,
        loading: false,
        placeHolders: [
            // {
            //     "id": 1,
            //     "title": "The Shawshank Redemption",
            //     "rating": 9.2,
            //     "poster": "https://www.movieposters.com/cdn/shop/files/shawshank_eb84716b-efa9-44dc-a19d-c17924a3f7df_480x.progressive.jpg",
            //     "imdb_url": "https://www.imdb.com/title/tt0111161/"
            // },
            // {
            //     "id": 2,
            //     "title": "The Godfather",
            //     "rating": 9.2,
            //     "poster": "https://cdn.shopify.com/s/files/1/0057/3728/3618/products/the-godfather_lkfmijop_500x749.jpg?v=1645738174",
            //     "imdb_url": "https://www.imdb.com/title/tt0068646/"
            // },
            // {
            //     "id": 3,
            //     "title": "The Dark Knight",
            //     "rating": 9,
            //     "poster": "https://www.movieposters.com/cdn/shop/files/darkknight.building.24x36_20e90057-f673-4cc3-9ce7-7b0d3eeb7d83_480x.progressive.jpg?v=1707491191",
            //     "imdb_url": "https://www.imdb.com/title/tt0468569/"
            // },
            // {
            //     "id": 4,
            //     "title": "Pulp Fiction",
            //     "rating": 8.9,
            //     "poster": "https://www.movieposters.com/cdn/shop/files/ItemP2297_jpg_480x.progressive.jpg?v=1705609586",
            //     "imdb_url": "https://www.imdb.com/title/tt0110912/"
            // },
            // {
            //     "id": 5,
            //     "title": "The Lord of the Rings: The Return of the King",
            //     "rating": 9,
            //     "poster": "https://www.movieposters.com/cdn/shop/products/LOTR.85633_480x.progressive.jpg?v=1673638763",
            //     "imdb_url": "https://www.imdb.com/title/tt0167260/"
            // },
            // {
            //     "id": 6,
            //     "title": "Spider-Man: Far from Home",
            //     "rating": 8.8,
            //     "poster": "https://www.movieposters.com/cdn/shop/products/302d466fc7d098c5dd02b2b88061a54c_a8eaba60-f75b-45bf-9bb2-8b0060ab626f_480x.progressive.jpg?v=1573651362",
            //     "imdb_url": "https://www.imdb.com/title/tt0060196/"
            // }
        ]
    },
    reducers: {
        setMovies: (state, action) => {
            const { payload } = action;
            return {
                ...state,
                movies: payload,
            }
        },
        setLoading: (state, action) => {
            const { payload } = action;
            return {
                ...state,
                loading: payload
            }
        },
        setMovieDetail: (state, action) => {
            const { payload } = action;
            return {
                ...state,
                movieDetail: payload
            }
        }
    }
});

export const getMovies = (params) => async (dispatch) => {
    const { actions } = movieSlice;

    dispatch(actions.setLoading(true));

    apiClient.get('movies')
        .then(response => dispatch(actions.setMovies(response.data)))
        .catch(error => console.log(error))
        .finally(() => {
            dispatch(actions.setLoading(false));
        })
}

export const getMovieDetail = (movieId) => async (dispatch) => {
    const { actions } = movieSlice;

    dispatch(actions.setLoading(true));

    apiClient.get(`movies/${movieId}`)
        .then(response => dispatch(actions.setMovieDetail(response.data)))
        .catch(error => console.log(error))
        .finally(() => {
            dispatch(actions.setLoading(false));
        })
}

export default movieSlice;