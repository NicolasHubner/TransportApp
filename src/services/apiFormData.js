import axios from 'axios';

const apiFormData = axios.create({
    baseURL: 'https://homoltrwbacking.trouw.com.br',
    // baseURL: 'https://f4d0-2804-11b0-4-8049-48ed-ccf9-1ae8-eccf.sa.ngrok.io',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 10000
});

export default apiFormData;