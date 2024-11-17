import { ArrowRight, TrendingUp, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Bet on the Next Big Thing
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Place virtual bets on promising startups, trade your positions, and earn rewards for spotting unicorns early.
            </p>
            <Link
              to="/startups"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              Explore Startups
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Bet with Us?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of users who are already betting on the future of technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp className="w-8 h-8 text-primary" />,
                title: "Track Record",
                description: "Our users have successfully predicted multiple unicorn startups"
              },
              {
                icon: <Shield className="w-8 h-8 text-primary" />,
                title: "Safe Betting",
                description: "Use virtual currency to learn without risking real money"
              },
              {
                icon: <Users className="w-8 h-8 text-primary" />,
                title: "Community",
                description: "Join a community of startup enthusiasts and investors"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-accent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Ready to Start Betting?
          </h2>
          <Link
            to="/startups"
            className="inline-flex items-center px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-50 transition-colors"
          >
            Get Started
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;