import { key } from '../constant/config';

const Storage = () => {
  return {
    setStorage: function (info) {
      localStorage.setItem(key, JSON.stringify(info));
    },
    getStorage: function () {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch (err) {
        return null;
      }
    },
    getToken: function () {
      return this.getStorage()?.token;
    },
    getRole: function () {
      return this.getStorage()?.role;
    },
    getUserId: function () {
      return this.getStorage()?.userId;
    },
    deleteStorage: function () {
      localStorage.removeItem(key);
    },
  };
};
export const storage = Storage();
export default storage;
