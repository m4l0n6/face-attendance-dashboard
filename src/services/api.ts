import axios from 'axios';
import { APP_CONFIG_API_URL } from '../utils/constant';

export async function login(email: string, password: string) {
    return axios.post(`${APP_CONFIG_API_URL}/auth/login`, { email, password }).then(response => response.data);
}

export async function getMe(token: string) {
  return axios
    .get(`${APP_CONFIG_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}

export async function logout() {
    return axios.post(`${APP_CONFIG_API_URL}/auth/logout`).then(response => response.data);
}

export async function getAllClasses(token: string) {
  return axios
    .get(`${APP_CONFIG_API_URL}/classes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data);
}