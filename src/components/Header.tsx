import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, User, Menu, Heart, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 mr-3 animate-pulse-soft">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 10.87V12h2v15.87c5.16-1.13 9-5.32 9-10.87V7L12 2z"/>
                </svg>
              </div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                RwandaStyle
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-700 hover:text-violet-600 transition-all duration-300 font-medium relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/shoes" className="text-slate-700 hover:text-violet-600 transition-all duration-300 font-medium relative group">
              Shoes
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/clothes" className="text-slate-700 hover:text-violet-600 transition-all duration-300 font-medium relative group">
              Clothes
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/accessories" className="text-slate-700 hover:text-violet-600 transition-all duration-300 font-medium relative group">
              Accessories
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search for shoes, clothes, accessories..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-slate-50/80 backdrop-blur-sm transition-all duration-300 hover:bg-white"
              />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative hover:bg-violet-50 transition-all duration-300 group">
              <Heart className="h-5 w-5 group-hover:text-violet-600 transition-colors duration-300" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-violet-500 to-purple-500 animate-pulse">
                0
              </Badge>
            </Button>
            <Button variant="ghost" size="sm" className="relative hover:bg-violet-50 transition-all duration-300 group">
              <ShoppingCart className="h-5 w-5 group-hover:text-violet-600 transition-colors duration-300" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-violet-500 to-purple-500 animate-pulse">
                0
              </Badge>
            </Button>
            
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600 hidden md:block">
                  Welcome, {user.name.split(' ')[0]}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-red-50 transition-all duration-300 group"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 group-hover:text-red-600 transition-colors duration-300" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="hover:bg-violet-50 transition-all duration-300 group">
                  <User className="h-5 w-5 group-hover:text-violet-600 transition-colors duration-300" />
                </Button>
              </Link>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-violet-50 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 animate-fade-in bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50/80 backdrop-blur-sm transition-all duration-300"
                />
              </div>
              <nav className="flex flex-col space-y-2">
                <Link to="/" className="text-slate-700 hover:text-violet-600 py-2 px-4 rounded-lg hover:bg-violet-50 transition-all duration-300">
                  Home
                </Link>
                <Link to="/shoes" className="text-slate-700 hover:text-violet-600 py-2 px-4 rounded-lg hover:bg-violet-50 transition-all duration-300">
                  Shoes
                </Link>
                <Link to="/clothes" className="text-slate-700 hover:text-violet-600 py-2 px-4 rounded-lg hover:bg-violet-50 transition-all duration-300">
                  Clothes
                </Link>
                <Link to="/accessories" className="text-slate-700 hover:text-violet-600 py-2 px-4 rounded-lg hover:bg-violet-50 transition-all duration-300">
                  Accessories
                </Link>
              </nav>
            </div>
            {user && (
              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-2">
                  Welcome, {user.name}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
