import { createSlice } from '@reduxjs/toolkit';
import getApiClient from '../util/api_client';

const theaterSlice = createSlice({
    name: 'theaterSlice',
    initialState: {
        theaters: [],
        theaterDetail: null,
        regions: [],
        loading: false,
    },
    reducers: {
        setTheaters: (state, action) => {
            const { payload } = action;
            return {
                ...state,
                theaters: payload,
            }
        },
        setLoading: (state, action) => {
            const { payload } = action;
            return {
                ...state,
                loading: payload
            }
        },
        setTheaterDetail: (state, action) => {
            const { payload } = action;
            return {
                ...state,
                theaterDetail: payload
            }
        },
        setRegions: (state, action) => {
            const { payload } = action;
            return {
                ...state,
                regions: payload
            }
        }
    }
});

export const getTheaters = (params) => async (dispatch) => {
    const { actions } = theaterSlice;

    dispatch(actions.setLoading(true));

    getApiClient().get('theaters')
        .then(response => dispatch(actions.setTheaters(response.data)))
        .catch(error => console.log(error))
        .finally(() => {
            dispatch(actions.setLoading(false));
        })
}

export const getTheaterDetail = (theaterId) => async (dispatch) => {
    const { actions } = theaterSlice;

    dispatch(actions.setLoading(true));

    getApiClient().get(`theaters/${theaterId}`)
        .then(response => dispatch(actions.setTheaterDetail(response.data)))
        .catch(error => console.log(error))
        .finally(() => {
            dispatch(actions.setLoading(false));
        })
}

export const getRegions = () => async (dispatch) => {
    const { actions } = theaterSlice;

    getApiClient().get('regions')
        .then(response => dispatch(actions.setRegions(response.data)))
        .catch(error => console.log(error))
}

export const deleteTheater = (theaterId) => async (dispatch) => {
    const { actions } = theaterSlice;

    dispatch(actions.setLoading(true));

    getApiClient().delete(`theaters/${theaterId}`)
        .then(() => {
            dispatch(getTheaters());
        })
        .catch(error => console.log(error))
        .finally(() => {
            dispatch(actions.setLoading(false));
        })
}

export const updateTheater = (theaterId, theaterData) => async (dispatch) => {
    const { actions } = theaterSlice;

    dispatch(actions.setLoading(true));

    getApiClient().put(`theaters/${theaterId}`, theaterData)
        .then(() => {
            dispatch(getTheaters());
        })
        .catch(error => console.log(error))
        .finally(() => {
            dispatch(actions.setLoading(false));
        })
}

export const addTheater = (theaterData) => async (dispatch) => {
    const { actions } = theaterSlice;

    dispatch(actions.setLoading(true));

    getApiClient().post('theaters', theaterData)
        .then(() => {
            dispatch(getTheaters());
        })
        .catch(error => console.log(error))
        .finally(() => {
            dispatch(actions.setLoading(false));
        })
}

export const toggleTheaterStatus = (theaterId) => async (dispatch) => {
    const { actions } = theaterSlice;

    dispatch(actions.setLoading(true));

    getApiClient().patch(`theaters/${theaterId}/toggle-status`)
        .then(() => {
            dispatch(getTheaters());
        })
        .catch(error => console.log(error))
        .finally(() => {
            dispatch(actions.setLoading(false));
        })
}

export default theaterSlice;