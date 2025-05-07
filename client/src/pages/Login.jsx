import LoginForm from "../components/LoginForm";
import { Typography } from "@material-tailwind/react";

function Login() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-b from-primary-50/50 to-white p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Typography variant="h2" color="blue-gray" className="mb-2">
            Welcome Back!
          </Typography>
          <Typography variant="paragraph" color="gray">
            Sign in to continue managing your expenses
          </Typography>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
