import { createSlice } from '@reduxjs/toolkit';
import apiClient from '../util/api_client';

const userSlice = createSlice({
    name: 'userSlice',
    initialState: {
        loading: false,
        isLoggedIn: false,
        data: null, // User data
    },
    reducers: {
        getUserData: (state, action) => {
            const { payload } = action;
            return {
                ...state
            }
        },

        login: (state, action) => {
            const { payload } = action;
            return {
                ...state,
                isLoggedIn: true,
            }
        },

        logout: (state, action) => {
            const { payload } = action;
            return {
                ...state,
                isLoggedIn: false,
                data: null
            }
        },

        setLoading: (state, action) => {
            const { payload: loading } = action;
            return {
                ...state,
                loading
            }
        }
    }
});

export const getLoggedin = params => async dispatch => {
    const { email, password } = params;
    const { actions } = userSlice;
    dispatch(actions.setLoading(true));
    apiClient.post('user/login', {
        email,
        password
    })
        .then(response => {
            dispatch(actions.login());
            // set token into localstorage
            console.log(response);
        })
        .catch(err => console.log(err))
        .finally(() => {
            dispatch(actions.setLoading(false));
        })

}

export const logout = () => async dispatch => {
    // const { actions } = userSlice;
    // dispatch(actions.logout());
    // remove token from localstorage
}

export default userSlice;
