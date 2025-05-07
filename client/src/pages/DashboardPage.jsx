import Dashboard from "../components/Dashboard";
import { Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";

function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-primary-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Typography variant="h2" color="blue-gray">
            Welcome, {user?.name || 'User'}! 👋
          </Typography>
          <Typography variant="lead" color="gray">
            Here's an overview of your expenses
          </Typography>
        </div>
        <Dashboard />
      </div>
    </div>
  );
}

export default DashboardPage;
