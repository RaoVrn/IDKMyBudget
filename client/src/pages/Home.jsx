import HeroSection from "../components/HeroSection";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const features = [
  {
    title: "Easy Expense Tracking",
    description: "Log your daily expenses with just a few clicks. Categorize and manage your spending effortlessly.",
    icon: "📝",
  },
  {
    title: "Visual Analytics",
    description: "Get insights into your spending patterns with beautiful charts and detailed breakdowns.",
    icon: "📊",
  },
  {
    title: "Smart Categories",
    description: "Organize expenses into categories to better understand where your money goes.",
    icon: "🏷️",
  },
  {
    title: "Secure & Private",
    description: "Your financial data is encrypted and stored securely. We prioritize your privacy.",
    icon: "🔒",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-white">
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Typography variant="h2" color="blue-gray" className="mb-4">
            Features that Make Budgeting Easy
          </Typography>
          <Typography variant="lead" color="gray" className="mx-auto max-w-2xl">
            Take control of your finances with our intuitive expense tracking features
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="mt-6">
              <CardBody className="text-center">
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  {feature.title}
                </Typography>
                <Typography color="gray">
                  {feature.description}
                </Typography>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-blue-gray-50/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Typography variant="h3" color="blue-gray" className="mb-4">
                Why Choose IDKMyBudget?
              </Typography>
              <Typography variant="paragraph" color="gray" className="mb-6">
                Managing your expenses shouldn't be complicated. We've created a simple yet powerful tool that helps you track your spending, understand your habits, and make better financial decisions.
              </Typography>
              <div className="space-y-4">
                {[
                  "✨ Beautiful, intuitive interface",
                  "📱 Access from any device",
                  "🚀 Get started in minutes",
                  "💰 Always free to use",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-2">
                    <Typography variant="paragraph" color="blue-gray">
                      {point}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl transform rotate-6 opacity-20"></div>
                <Card className="relative">
                  <CardBody>
                    <div className="space-y-4">
                      <Typography variant="h6" color="blue" className="flex items-center gap-2">
                        <span className="text-2xl">💡</span> Did You Know?
                      </Typography>
                      <Typography color="gray">
                        People who track their expenses regularly are more likely to achieve their financial goals and save more money each month.
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Start your journey to financial freedom today!
                      </Typography>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
