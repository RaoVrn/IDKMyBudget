import { useState, useEffect } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import expenseService from "../services/expenseService";
import { toast } from "react-toastify";
import { Card, CardBody, Typography, Spinner } from "@material-tailwind/react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    avgPerDay: 0,
    categoryTotals: {},
  });

  // Calculate stats from expenses
  const calculateStats = (expenses) => {
    const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
      return acc;
    }, {});

    const dates = expenses.map(exp => new Date(exp.date));
    const daysDiff = dates.length > 0 
      ? (Math.max(...dates) - Math.min(...dates)) / (1000 * 60 * 60 * 24) + 1
      : 1;
    const avgPerDay = total / daysDiff;

    setStats({ total, avgPerDay, categoryTotals });
  };

  // Fetch all expenses
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await expenseService.getExpenses();
      if (response?.data) {
        const sortedExpenses = response.data.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        setExpenses(sortedExpenses);
        calculateStats(sortedExpenses);
      }
    } catch (error) {
      console.error("Fetch expenses error:", error);
      toast.error("Failed to fetch expenses. Please try refreshing the page.");
    } finally {
      setLoading(false);
    }
  };

  // Handle expense deletion
  const handleDelete = async (id) => {
    try {
      const result = await expenseService.deleteExpense(id);
      if (result.success) {
        const updatedExpenses = expenses.filter(exp => exp._id !== id);
        setExpenses(updatedExpenses);
        calculateStats(updatedExpenses);
        toast.success(result.message);
      }
    } catch (error) {
      throw error; // Propagate error to ExpenseItem component for UI handling
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Chart configurations
  const chartData = {
    labels: Object.keys(stats.categoryTotals),
    datasets: [{
      data: Object.values(stats.categoryTotals),
      backgroundColor: [
        '#0EA5E9',
        '#22C55E',
        '#EF4444',
        '#F59E0B',
        '#8B5CF6',
        '#EC4899',
        '#06B6D4',
        '#8B5CF6',
        '#64748B',
      ],
    }],
  };

  const barChartData = {
    labels: Object.keys(stats.categoryTotals),
    datasets: [{
      data: Object.values(stats.categoryTotals),
      backgroundColor: '#0EA5E9',
      borderColor: '#0EA5E9',
    }]
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardBody>
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Total Expenses
            </Typography>
            <Typography variant="h4" color="blue" className="font-bold">
              ₹{stats.total.toLocaleString()}
            </Typography>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Average Daily Spend
            </Typography>
            <Typography variant="h4" color="blue" className="font-bold">
              ₹{stats.avgPerDay.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </Typography>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Number of Expenses
            </Typography>
            <Typography variant="h4" color="blue" className="font-bold">
              {expenses.length}
            </Typography>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardBody>
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Expenses Distribution
            </Typography>
            <div className="h-[300px] flex justify-center">
              <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Category Breakdown
            </Typography>
            <div className="h-[300px]">
              <Bar 
                data={barChartData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }} 
              />
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ExpenseForm onExpenseAdded={fetchExpenses} />
        </div>
        <div className="lg:col-span-2">
          <ExpenseList expenses={expenses} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
