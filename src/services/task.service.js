// src/services/taskService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/tasks'; // Adjust the URL based on your NestJS server

export const taskService = {
  async getTasks() {
    const response = await axios.get(API_URL);
    return response.data;
  },
  async createTask(task) {
    return await axios.post(API_URL, task);
  },
  async updateTask(taskId, updates) {
    return await axios.patch(`${API_URL}/${taskId}`, updates);
  },
  async deleteTask(taskId) {
    return await axios.delete(`${API_URL}/${taskId}`);
  },
  async getArchives() {
    const response = await axios.get(`${API_URL}/archives`);
    return response.data;
  },
  async completeTask(id, completed) {
    const response = await axios.patch(`${API_URL}/${id}/complete`, {
      completed: completed,
    });
    return response.data;
  },
};
