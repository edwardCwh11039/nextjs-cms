import { message } from 'antd';
import axios from 'axios';
import { AES } from 'crypto-js';
import storage from './storage';

const ApiServices = () => {
  const baseURL = 'http://localhost:3001/api';
  const axiosInstance = axios.create({ baseURL });

  axiosInstance.interceptors.request.use((config) => {
    if (!config.url.includes('logins') && !config.url.includes('countries')) {
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: 'Bearer ' + storage.getToken(),
        },
      };
    }
    return config;
  });

  async function get(path) {
    return axiosInstance
      .get(path)
      .then((res) => res.data)
      .catch((err) => {
        errorHandler(err);
      });
  }

  async function post(path, params) {
    return axiosInstance
      .post(path, params)
      .then((res) => res.data)
      .catch((err) => {
        errorHandler(err);
      });
  }

  async function remove(path) {
    return axiosInstance
      .delete(path)
      .then((res) => res.data)
      .catch((err) => {
        errorHandler(err);
      });
  }

  async function put(path, params) {
    return axiosInstance
      .put(path, params)
      .then((res) => res.data)
      .catch((err) => {
        errorHandler(err);
      });
  }

  function response(res, display = false) {
    const { code, msg } = res;
    const isError =
      !code.toString().startsWith('2') || code.toString().startsWith('3');

    if (isError) {
      message.error(msg);
    }
    if (!isError && display) {
      message.success(msg);
    }
  }

  function errorHandler(err) {
    const msg = err.response.data.msg;
    const code = err.response.status;

    return { msg, code };
  }

  return {
    getCountries: function () {
      return get('/countries').then((res) => {
        response(res);
        return res;
      });
    },
    login: function ({ password, ...values }) {
      return post('/login', {
        ...values,
        password: AES.encrypt(password, 'cms').toString(),
      }).then((res) => {
        response(res);
        return res;
      });
    },
    logout: function () {
      return post('/logout', {}).then((res) => {
        response(res);
        return res;
      });
    },
    getStudents: function (query, page, limit) {
      return get(`/students?query=${query}&page=${page}&limit=${limit}`).then(
        (res) => {
          response(res);
          return res;
        }
      );
    },
    deleteStudents: function (id) {
      return remove(`/students/${id}`).then((res) => {
        response(res, true);
        return res;
      });
    },
    editStudent: function (student) {
      return put('/students', student).then((res) => {
        response(res, true);
        return res;
      });
    },
    addStudent: function (student) {
      return post('/students', student).then((res) => {
        response(res, true);
        return res;
      });
    },
    getStudentsById: function (id) {
      return get(`/students/${id}`).then((res) => {
        response(res);
        return res;
      });
    },
  };
};

export const apiServices = ApiServices();

export default apiServices;
