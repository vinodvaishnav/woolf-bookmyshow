import { createSlice } from "@reduxjs/toolkit";
import apiClient from "../util/api_client";

const showSlice = createSlice({
    name: 'showSlice',
    initialState: {
        movieShows: [],
        ShowDetail: null,
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
                ShowDetail: payload
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

    apiClient.get(`shows/movie/${movieId}`)
        .then(response => dispatch(actions.setMovieShows(response.data)))
        .catch(error => console.log(error))
        .finally(() => {
            dispatch(actions.setLoading(false));
        })
}

export const getShowDetail = (showId) => async (dispatch) => {
    const { actions } = showSlice;

    dispatch(actions.setLoading(true));

    apiClient.get(`shows/${showId}`)
        .then(response => dispatch(actions.setShowDetail(response.data)))
        .catch(error => console.log(error))
        .finally(() => {
            dispatch(actions.setLoading(false));
        })
}

export default showSlice;