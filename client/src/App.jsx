import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./utils/PrivateRoute";
import { ThemeProvider } from "@material-tailwind/react";

const theme = {
  button: {
    defaultProps: {
      variant: "filled",
      size: "lg",
      color: "blue",
      fullWidth: false,
      ripple: true,
    },
  },
  input: {
    defaultProps: {
      variant: "outlined",
      size: "lg",
      color: "blue",
    },
    styles: {
      variants: {
        outlined: {
          base: {
            input: {
              borderWidth: "2px",
              borderColor: "blue-gray-200",
            },
          },
        },
      },
    },
  },
};

function App() {
  return (
    <ThemeProvider value={theme}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
