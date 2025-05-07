import SignupForm from "../components/SignupForm";
import { Typography } from "@material-tailwind/react";

function Signup() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-b from-primary-50/50 to-white p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Typography variant="h2" color="blue-gray" className="mb-2">
            Create Your Account
          </Typography>
          <Typography variant="paragraph" color="gray">
            Start your journey to better financial management
          </Typography>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}

export default Signup;
