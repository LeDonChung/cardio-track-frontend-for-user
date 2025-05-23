import axios, { AxiosInstance } from "axios";


const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}:8888`,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
    }
})

// Add an interceptor to include the authorization token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); 
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        return Promise.reject(error);
    }
);

export { axiosInstance };