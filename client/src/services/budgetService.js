import axios from "axios";

const API_URL = "http://localhost:5000/api/budgets";

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

const getBudgets = async () => {
  try {
    const response = await axios.get(API_URL, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getBudgetStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/status`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const addBudget = async (budgetData) => {
  try {
    const response = await axios.post(API_URL, budgetData, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const updateBudget = async (id, budgetData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, budgetData, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const deleteBudget = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const budgetService = {
  getBudgets,
  getBudgetStatus,
  addBudget,
  updateBudget,
  deleteBudget
};

export default budgetService;