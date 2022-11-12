import axios from 'axios';

const api = axios.create({
    baseURL: 'https://vision.googleapis.com',
    // baseURL: 'https://423a-2804-14c-47-847c-9537-6129-f24f-81df.sa.ngrok.io/',
    // headers: { Authorization: token},
    timeout: 15000
});

export default api;