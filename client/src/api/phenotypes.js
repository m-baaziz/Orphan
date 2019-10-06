import axios from 'axios';
import { API_URL } from '../config/config';

export async function findMainAreas() {
  try {
    const response = await axios.get(`${API_URL}/areas`);
    return response.data;
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function submitStatements(statements) {
  try {
    const response = await axios.post(`${API_URL}/statements`, {
      statements,
    });
    return response.data;
  } catch (e) {
    return Promise.reject(e);
  }
}
