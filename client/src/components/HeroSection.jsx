import { Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left opacity-0 animate-fade-in">
              <Typography
                variant="h1"
                className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl transition-all duration-300 ease-in-out"
              >
                <span className="block transform translate-y-4 animate-slide-up">Take Control of Your</span>
                <span className="block text-primary-600 transform translate-y-4 animate-slide-up delay-100">
                  Financial Future
                </span>
              </Typography>
              <Typography
                variant="lead"
                color="gray"
                className="mt-3 text-base sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 transform translate-y-4 animate-slide-up delay-200"
              >
                Simplify your expense tracking, gain insights into your spending habits, and make smarter financial decisions with IDKMyBudget.
              </Typography>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4 transform translate-y-4 animate-slide-up delay-300">
                <Link to="/signup">
                  <Button size="lg" color="blue" variant="gradient" className="w-full sm:w-auto">
                    Get Started - It's Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outlined" color="blue" className="mt-3 sm:mt-0 w-full sm:w-auto">
                    Login to Your Account
                  </Button>
                </Link>
              </div>
            </div>
          </main>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/3 opacity-0 animate-fade-in delay-500">
            <div className="text-[20rem] leading-none">💰</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
