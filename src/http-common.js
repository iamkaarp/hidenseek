import axios from 'axios';

export const http = axios.create({
    baseURL: 'https://192.168.0.143:5443/api/',
});
