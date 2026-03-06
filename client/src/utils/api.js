import axios from 'axios';

// In production REACT_APP_API_URL = your Render backend URL.
// In dev, the CRA proxy forwards /api/* to localhost:5000.
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('mg_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const getMediaUrl = (mediaUrl) => {
    if (!mediaUrl) return '/images/placeholder.jpg';
    if (mediaUrl.startsWith('http')) return mediaUrl;
    const base = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    if (mediaUrl.startsWith('/uploads/')) return `${base}${mediaUrl}`;
    return mediaUrl;
};

export default api;