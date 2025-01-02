import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const registerUser = (userData) => {
  return axios.post(`${API_URL}/auth/register`, userData);
};

export const loginUser = (loginData) => {
  return axios.post(`${API_URL}/auth/login`, loginData);
};

export const getPaymentsByResident = async (residentId) => {
  const response = await axios.get(`${API_URL}/payments/resident/${residentId}`);
  return response.data;
};

export const getPaymentsByRoom = async (roomId) => {
  const response = await axios.get(`${API_URL}/payments/room/${roomId}`);
  return response.data;
};

export const addPayment = async (roomId, residentId, amountPaid) => {
  const response = await axios.post(`${API_URL}/payments`, null, {
    params: { roomId, residentId, amountPaid },
  });
  return response.data;
};