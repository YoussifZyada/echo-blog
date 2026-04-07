import axiosInstance from './axiosInstance.js';

export const registerUser = async (userData) => {
  // Post to /auth/signup (which hits your 'register' controller)
  const { data } = await axiosInstance.post('/auth/signup', userData);

  // Based on your controller: res.status(201).json({ status, token, data: { user } })
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await axiosInstance.post('/auth/login', credentials);
  
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  
  return data;
};