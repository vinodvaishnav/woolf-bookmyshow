import axios from 'axios';

// @TODO: Move all the config parameters in 1 file it could be a .env
const API_BASE_URL = 'http://localhost:5500/api';

// const token = localStorage.getItem('token');
// console.log(token);

// localStorage.getItem('token') && (axios.defaults.headers.common['authorization'] = `Bearer ${localStorage.getItem('token')}`);
// axios.defaults.baseURL = API_BASE_URL;
// axios.defaults.timeout = 3000;

// const apiClient = axios.create();

// export default apiClient;

const getApiClient = () => {
    const token = localStorage.getItem('token');

    if (token) {
        axios.defaults.headers.common['authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['authorization'];
    }

    axios.defaults.baseURL = API_BASE_URL;
    axios.defaults.timeout = 3000;

    const apiClient = axios.create();
    return apiClient;
}

export default getApiClient;