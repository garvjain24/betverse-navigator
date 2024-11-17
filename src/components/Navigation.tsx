import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              Bet.io
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/startups" className="text-gray-600 hover:text-primary transition-colors">
              Startups
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/auth" >
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors">
              Start Betting
            </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg animate-slide-in">
            <Link
              to="/startups"
              className="block px-3 py-2 text-gray-600 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Startups
            </Link>
            <Link
              to="/dashboard"
              className="block px-3 py-2 text-gray-600 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link to="auth">
            <button 
              className="w-full text-left px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Start Betting
            </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;