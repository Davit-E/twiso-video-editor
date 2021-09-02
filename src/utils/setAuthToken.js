import instance from '../axios-instance-auth';

const setAuthToken = (token) => {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default setAuthToken;
