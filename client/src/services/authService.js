import axios from "axios";

const API_URL = "http://localhost:5000/api/users/";

const signup = (userData) => axios.post(`${API_URL}signup`, userData);

const login = (userData) => axios.post(`${API_URL}login`, userData);

const authService = {
  signup,
  login,
};

export default authService;
