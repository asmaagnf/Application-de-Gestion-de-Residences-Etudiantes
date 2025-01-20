import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const registerUser = (userData) => {
  return axios.post(`${API_URL}/auth/register`, userData);
};

export const loginUser = (loginData) => {
  return axios.post(`${API_URL}/auth/login`, loginData);
};

// Fetch payments by Resident ID
export const getPaymentsByResident = (residentId) => {
  return axios.get(`${API_URL}/payments/resident/${residentId}`);
};

// Add payment
export const addPayment = (paymentId, amountPaid) => {
  return axios.post(`${API_URL}/payments/${paymentId}/pay`, null, {
    params: {
      amountPaid: amountPaid,
    },
  });
};