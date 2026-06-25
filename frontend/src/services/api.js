import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

export const getNotes = () => api.get('/notes').then(res => res.data);
export const createNote = (data) => api.post('/notes', data).then(res => res.data);
export const updateNote = (id, data) => api.put(`/notes/${id}`, data).then(res => res.data);
export const deleteNote = (id) => api.delete(`/notes/${id}`).then(res => res.data);

export default api;