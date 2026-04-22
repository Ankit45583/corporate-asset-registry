import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
    const userData = localStorage.getItem('car_user');

    if (userData) {
        const user = JSON.parse(userData); // ✅ IMPORTANT

        if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
    }

    return config;
});

export default api;