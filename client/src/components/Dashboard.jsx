import { useState, useEffect } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import IncomeForm from "./IncomeForm";
import IncomeList from "./IncomeList";
import BudgetForm from "./BudgetForm";
import BudgetStatus from "./BudgetStatus";
import expenseService from "../services/expenseService";
import incomeService from "../services/incomeService";
import budgetService from "../services/budgetService";
import { toast } from "react-toastify";
import { Card, CardBody, Typography, Spinner, Tabs, TabsHeader, Tab } from "@material-tailwind/react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBudget, setEditingBudget] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // overview, income, expenses, budgets
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    monthlySavings: 0,
    expensesByCategory: {},
    incomeByCategory: {},
  });

  // Calculate stats from transactions
  const calculateStats = (expenses, incomes) => {
    const totalIncome = incomes.reduce((sum, inc) => sum + Number(inc.amount), 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    
    const expensesByCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
      return acc;
    }, {});

    const incomeByCategory = incomes.reduce((acc, inc) => {
      acc[inc.category] = (acc[inc.category] || 0) + Number(inc.amount);
      return acc;
    }, {});

    // Calculate monthly savings (use current month's data)
    const now = new Date();
    const currentMonthIncomes = incomes.filter(inc => {
      const incDate = new Date(inc.date);
      return incDate.getMonth() === now.getMonth() && 
             incDate.getFullYear() === now.getFullYear();
    });
    const currentMonthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === now.getMonth() && 
             expDate.getFullYear() === now.getFullYear();
    });

    const monthlyIncome = currentMonthIncomes.reduce((sum, inc) => sum + Number(inc.amount), 0);
    const monthlyExpenses = currentMonthExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const monthlySavings = monthlyIncome - monthlyExpenses;

    setStats({
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      monthlySavings,
      expensesByCategory,
      incomeByCategory,
    });
  };

  // Fetch all transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const [expenseRes, incomeRes] = await Promise.all([
        expenseService.getExpenses(),
        incomeService.getIncomes()
      ]);

      const sortedExpenses = expenseRes.data.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      const sortedIncomes = incomeRes.data.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );

      setExpenses(sortedExpenses);
      setIncomes(sortedIncomes);
      calculateStats(sortedExpenses, sortedIncomes);
    } catch (error) {
      console.error("Fetch transactions error:", error);
      toast.error("Failed to fetch transactions. Please try refreshing the page.");
    } finally {
      setLoading(false);
    }
  };

  // Handle expense deletion
  const handleDeleteExpense = async (id) => {
    try {
      const result = await expenseService.deleteExpense(id);
      if (result.success) {
        const updatedExpenses = expenses.filter(exp => exp._id !== id);
        setExpenses(updatedExpenses);
        calculateStats(updatedExpenses, incomes);
        toast.success(result.message);
      }
    } catch (error) {
      throw error;
    }
  };

  // Handle income deletion
  const handleDeleteIncome = async (id) => {
    try {
      const result = await incomeService.deleteIncome(id);
      if (result.success) {
        const updatedIncomes = incomes.filter(inc => inc._id !== id);
        setIncomes(updatedIncomes);
        calculateStats(expenses, updatedIncomes);
        toast.success(result.message);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Chart configurations
  const expenseChartData = {
    labels: Object.keys(stats.expensesByCategory),
    datasets: [{
      data: Object.values(stats.expensesByCategory),
      backgroundColor: [
        '#EF4444', // red
        '#F59E0B', // amber
        '#10B981', // emerald
        '#3B82F6', // blue
        '#8B5CF6', // purple
        '#EC4899', // pink
        '#6366F1', // indigo
        '#14B8A6', // teal
        '#64748B', // blue-gray
      ],
    }],
  };

  const incomeChartData = {
    labels: Object.keys(stats.incomeByCategory),
    datasets: [{
      data: Object.values(stats.incomeByCategory),
      backgroundColor: [
        '#10B981', // emerald
        '#3B82F6', // blue
        '#8B5CF6', // purple
        '#F59E0B', // amber
        '#6366F1', // indigo
        '#64748B', // blue-gray
      ],
    }],
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
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardBody>
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Total Income
            </Typography>
            <Typography variant="h4" color="green" className="font-bold">
              ₹{stats.totalIncome.toLocaleString()}
            </Typography>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Total Expenses
            </Typography>
            <Typography variant="h4" color="red" className="font-bold">
              ₹{stats.totalExpenses.toLocaleString()}
            </Typography>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Net Income
            </Typography>
            <Typography
              variant="h4"
              color={stats.netIncome >= 0 ? "green" : "red"}
              className="font-bold"
            >
              ₹{stats.netIncome.toLocaleString()}
            </Typography>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Monthly Savings
            </Typography>
            <Typography
              variant="h4"
              color={stats.monthlySavings >= 0 ? "green" : "red"}
              className="font-bold"
            >
              ₹{stats.monthlySavings.toLocaleString()}
            </Typography>
          </CardBody>
        </Card>
      </div>

      <Tabs value={activeTab} className="mb-6">
        <TabsHeader>
          <Tab value="overview" onClick={() => setActiveTab("overview")}>
            Overview
          </Tab>
          <Tab value="income" onClick={() => setActiveTab("income")}>
            Income
          </Tab>
          <Tab value="expenses" onClick={() => setActiveTab("expenses")}>
            Expenses
          </Tab>
          <Tab value="budgets" onClick={() => setActiveTab("budgets")}>
            Budgets
          </Tab>
        </TabsHeader>
      </Tabs>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardBody>
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Income Distribution
              </Typography>
              <div className="h-[300px] flex justify-center">
                <Doughnut
                  data={incomeChartData}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Expense Distribution
              </Typography>
              <div className="h-[300px] flex justify-center">
                <Doughnut
                  data={expenseChartData}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </CardBody>
          </Card>
          <Card className="lg:col-span-2">
            <CardBody>
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Monthly Overview
              </Typography>
              <div className="h-[300px]">
                <Bar
                  data={{
                    labels: ["Income", "Expenses", "Savings"],
                    datasets: [{
                      data: [stats.totalIncome, stats.totalExpenses, stats.monthlySavings],
                      backgroundColor: ['#10B981', '#EF4444', '#3B82F6'],
                    }],
                  }}
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
      )}

      {activeTab === "income" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <IncomeForm onIncomeAdded={fetchTransactions} />
          </div>
          <div className="lg:col-span-2">
            <IncomeList
              incomes={incomes}
              onDelete={handleDeleteIncome}
              onRefresh={fetchTransactions}
            />
          </div>
        </div>
      )}

      {activeTab === "expenses" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ExpenseForm onExpenseAdded={fetchTransactions} />
          </div>
          <div className="lg:col-span-2">
            <ExpenseList
              expenses={expenses}
              onDelete={handleDeleteExpense}
            />
          </div>
        </div>
      )}

      {activeTab === "budgets" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <BudgetForm
              onBudgetAdded={() => {
                setEditingBudget(null);
                fetchTransactions();
              }}
              editingBudget={editingBudget}
              onCancelEdit={() => setEditingBudget(null)}
            />
          </div>
          <div className="lg:col-span-2">
            <BudgetStatus
              onEdit={setEditingBudget}
              onRefresh={fetchTransactions}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
