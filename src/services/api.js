import React from "react";
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Reports API
export const reportsApi = {
  getAll: () => api.get('/reports'),
  getUserReports: () => api.get('/reports/user'),
  createReport: (formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    return axios.post(`${API_URL}/reports`, formData, config);
  },
  updateReport: (id, data) => api.put(`/reports/${id}`, data),
  deleteReport: async (id) => {
    try {
      const response = await api.delete(`/reports/${id}`);
      console.log('Delete response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to delete report');
    }
  },
};  

// Stations API (for police stations)
export const stationsApi = {
  getAll: () => api.get('/stations'),
  getNearby: (lat, lng, radius = 5000) => 
    api.get(`/stations/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
};

// Alerts API
export const alertsApi = {
  getAll: () => api.get('/alerts'),
  getNearby: (lat, lng, radius = 5000) => 
    api.get(`/alerts/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
  createAlert: (data) => api.post('/alerts', data),
};

export default api;