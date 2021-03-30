import axios from "axios";

const API_URL = "https://reqres.in/api/";

const login = (data) => {
  return axios
    .post(API_URL + "login", data)
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

// eslint-disable-next-line
export default {
  login,
  logout
};