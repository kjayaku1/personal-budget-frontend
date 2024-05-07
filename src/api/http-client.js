import axios from 'axios';
import Logout from '../utils/logout';

const httpClient = axios.create({
  // baseURL: "http://localhost:4000",
  baseURL: "https://personal-budget-backend-5j0q.onrender.com",
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
});

const onSuccess = (response) => Promise.resolve(response);
const onError = async ({ response }) => {
  const { data } = response || {};
  const { message } = data;
  if (message === 'Token has expired' || message === 'You must be logged in' || response.status === 422) {
    // If token expired or user not logged in, request new access token using refresh token
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const refreshResponse = await httpClient.post('/refresh/token', { refreshToken });
        const { access_token } = refreshResponse.data;
        localStorage.setItem('authToken', access_token);
        // localStorage.setItem("countdownSeconds", 60);
        window.location.reload();
        // Retry the original request with the new access token
        const originalRequest = response.config;
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        return axios(originalRequest);
      } else {
        // If no refresh token available, logout
        Logout();
      }
    } catch (error) {
      // If error occurred while refreshing token, logout
      Logout();
    }
  }
  return Promise.reject(response)
};

httpClient.interceptors.request.use((req) => {
  if (req.url === '/refresh/token') {
    req.headers['Authorization'] = `Bearer ${localStorage.getItem('refreshToken')}`
  } else {
    req.headers['Authorization'] = `Bearer ${localStorage.getItem('authToken')}`
  }
  return req
}
);
httpClient.interceptors.response.use(onSuccess, onError);

export default httpClient;
