import axios from 'axios';

// Axios instance — the CRA proxy forwards /api/* to localhost:5000
const api = axios.create();

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('mg_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

/**
 * Resolves a mediaUrl from the DB to a fully-qualified URL:
 *  /uploads/* → served by Express on port 5000
 *  /images/*  → served from client/public by CRA dev server
 *  http*      → already absolute, return as-is
 */
export const getMediaUrl = (mediaUrl) => {
    if (!mediaUrl) return '/images/placeholder.jpg';
    if (mediaUrl.startsWith('http')) return mediaUrl;
    if (mediaUrl.startsWith('/uploads/')) return `http://localhost:5000${mediaUrl}`;
    return mediaUrl; // /images/... served by CRA public folder
};

export default api;