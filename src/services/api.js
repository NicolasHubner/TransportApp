import axios from "axios";

export const api = axios.create({
   baseURL: 'https://homoltrwapp.trouw.com.br',
  // baseURL: 'https://trwapp-service.trouw.com.br',
  // baseURL: 'https://ac62-2804-11b0-4-8049-1699-ffa7-28bd-c707.sa.ngrok.io',
  // headers: {Authorization: `bearer ${token}`},
  timeout: 15000,
});

export const apiFormData = axios.create({
   baseURL: 'https://homoltrwapp.trouw.com.br',
  // baseURL: 'https://trwapp-service.trouw.com.br',
  // baseURL: 'https://ac62-2804-11b0-4-8049-1699-ffa7-28bd-c707.sa.ngrok.io',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 10000
});

export const apiOcr = axios.create({
  baseURL: 'https://vision.googleapis.com',
  timeout: 15000
});
