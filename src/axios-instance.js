import axios from 'axios';

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL_TEST}/api/v1`,
});

export default instance;
