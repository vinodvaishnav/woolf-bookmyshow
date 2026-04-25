import { createSlice } from '@reduxjs/toolkit';
import getApiClient from '../util/api_client';

const userSlice = createSlice({
    name: 'userSlice',
    initialState: {
        loading: false,
        isLoggedIn: false,
        userData: null, // User data
    },
    reducers: {
        setUserData: (state, action) => {
            const { payload } = action;
            return {
                ...state,
                userData: payload
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
                userData: null
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

export const getUserProfile = () => async dispatch => {
    const { actions } = userSlice;
    dispatch(actions.setLoading(true));
    getApiClient().get('user/profile')
        .then(response => {
            dispatch(actions.setUserData(response.data.data));
        })
        .catch(err => console.log(err))
        .finally(() => {
            dispatch(actions.setLoading(false));
        });
}

export const getLoggedin = params => async dispatch => {
    const { email, password } = params;
    const { actions } = userSlice;

    dispatch(actions.setLoading(true));

    getApiClient().post('user/login', {
        email,
        password
    })
        .then(response => {
            const authToken = response?.data?.authToken;
            console.log(response?.data?.authToken);
            localStorage.setItem('token', authToken);
            dispatch(actions.login());
            dispatch(getUserProfile());
            console.log(response);
        })
        .catch(err => console.log(err))
        .finally(() => {
            dispatch(actions.setLoading(false));
        })

}

export const logout = () => async dispatch => {
    const { actions } = userSlice;
    dispatch(actions.logout());
    dispatch(actions.setUserData(null));
    localStorage.removeItem('token');
}

export default userSlice;
