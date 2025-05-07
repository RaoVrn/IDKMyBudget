import axios from "axios";

const API_URL = "http://localhost:5000/api/expenses";

const getAuthConfig = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.token) {
    throw new Error("No authentication token found");
  }
  return {
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json'
    }
  };
};

const handleError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Session expired. Please login again.");
  }
  throw error;
};

const getExpenses = async () => {
  try {
    const response = await axios.get(API_URL, getAuthConfig());
    return response;
  } catch (error) {
    return handleError(error);
  }
};

const addExpense = async (expenseData) => {
  try {
    const response = await axios.post(API_URL, expenseData, getAuthConfig());
    return response;
  } catch (error) {
    return handleError(error);
  }
};

const deleteExpense = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete expense');
    }
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    handleError(error);
  }
};

const expenseService = {
  getExpenses,
  addExpense,
  deleteExpense,
};

export default expenseService;
