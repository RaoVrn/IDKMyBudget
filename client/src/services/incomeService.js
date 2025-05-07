import axios from "axios";

const API_URL = "http://localhost:5000/api/incomes";

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
  throw error.response?.data?.message || error.message;
};

const getIncomes = async () => {
  try {
    const response = await axios.get(API_URL, getAuthConfig());
    return { data: response.data };
  } catch (error) {
    throw handleError(error);
  }
};

const addIncome = async (incomeData) => {
  try {
    const response = await axios.post(API_URL, incomeData, getAuthConfig());
    return { data: response.data };
  } catch (error) {
    throw handleError(error);
  }
};

const updateIncome = async (id, incomeData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, incomeData, getAuthConfig());
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

const deleteIncome = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    return {
      success: true,
      message: response.data.message || 'Income deleted successfully'
    };
  } catch (error) {
    throw handleError(error);
  }
};

const incomeService = {
  getIncomes,
  addIncome,
  updateIncome,
  deleteIncome,
};

export default incomeService;