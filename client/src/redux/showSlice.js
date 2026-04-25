import { createSlice } from "@reduxjs/toolkit";
import getApiClient from "../util/api_client";

const showSlice = createSlice({
    name: 'showSlice',
    initialState: {
        movieShows: [],
        showDetail: null,
        showSeats: [],
        loading: false
    },
    reducers: {
        setMovieShows: (state, action) => {
            const { payload } = action;
            return {
                ...state,
                movieShows: payload
            }
        },
        setShowDetail: (state, action) => {
            const { payload } = action;
            return {
                ...state,
                showDetail: payload
            }
        },
        setShowSeats: (state, action) => {
            const { payload } = action;
            return {
                ...state,
                showSeats: payload
            }
        },
        setLoading: (state, action) => {
            const { payload } = action;
            return {
                ...state,
                loading: payload
            }
        }
    }
});

export const getMovieShows = (movieId) => async (dispatch) => {
    const { actions } = showSlice;

    dispatch(actions.setLoading(true));

    getApiClient().get(`shows/movie/${movieId}`)
        .then(response => dispatch(actions.setMovieShows(response.data)))
        .catch(error => console.log(error))
        .finally(() => {
            dispatch(actions.setLoading(false));
        })
}

export const getShowDetail = (showId) => async (dispatch) => {
    const { actions } = showSlice;

    dispatch(actions.setLoading(true));

    getApiClient().get(`shows/${showId}`)
        .then(response => dispatch(actions.setShowDetail(response.data)))
        .catch(error => console.log(error))
        .finally(() => {
            dispatch(actions.setLoading(false));
        })
}

export const getShowSeats = (showId) => async (dispatch) => {
    const { actions } = showSlice;

    dispatch(actions.setLoading(true));

    getApiClient().get(`shows/${showId}/seats`)
        .then(response => dispatch(actions.setShowSeats(response.data)))
        .catch(error => console.log(error))
        .finally(() => {
            dispatch(actions.setLoading(false));
        })
}

export const { setMovieShows, setShowDetail, setShowSeats, setLoading } = showSlice.actions;

export default showSlice;