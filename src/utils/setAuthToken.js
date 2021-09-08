import instance from '../axios-instance';

const setAuthToken = (token) => {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default setAuthToken;
