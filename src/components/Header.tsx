
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, User, Menu, Heart, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import CartDrawer from "@/components/CartDrawer";

const Header = () => {
  const { user, logout, loading } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    console.log('Header: Auth state changed:', { user: !!user, loading, userName: user?.name });
  }, [user, loading]);

  const handleShopNowClick = () => {
    navigate('/products');
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/products?category=${category}`);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleSearchClick = () => {
    // Navigate to products page to enable search functionality
    navigate('/products');
  };

  const handleCartClick = () => {
    if (!user) {
      toast.error('Please login to view cart');
      return;
    }
    setIsCartOpen(true);
  };

  if (loading) {
    return (
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RS</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                RwandaStyle
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RS</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                RwandaStyle
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-violet-600 font-medium transition-colors">
                Home
              </Link>
              <button 
                onClick={() => handleCategoryClick('Shoes')}
                className="text-gray-700 hover:text-violet-600 font-medium transition-colors"
              >
                Shoes
              </button>
              <button 
                onClick={() => handleCategoryClick('Clothes')}
                className="text-gray-700 hover:text-violet-600 font-medium transition-colors"
              >
                Clothes
              </button>
              <button 
                onClick={() => handleCategoryClick('Accessories')}
                className="text-gray-700 hover:text-violet-600 font-medium transition-colors"
              >
                Accessories
              </button>
              <button 
                onClick={handleShopNowClick}
                className="text-gray-700 hover:text-violet-600 font-medium transition-colors"
              >
                All Products
              </button>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSearchClick}
                className="hover:bg-violet-50 hover:text-violet-600"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleCartClick}
                className="hover:bg-violet-50 hover:text-violet-600 relative"
              >
                <ShoppingCart className="h-4 w-4" />
                {user && cartCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
              
              {user && <NotificationBell />}
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    {user.isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                    Login
                  </Button>
                  <Button size="sm" onClick={() => navigate('/signup')} className="bg-violet-600 hover:bg-violet-700">
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-2">
                <Link to="/" className="text-gray-700 hover:text-violet-600 font-medium py-2">
                  Home
                </Link>
                <button 
                  onClick={() => handleCategoryClick('Shoes')}
                  className="text-left text-gray-700 hover:text-violet-600 font-medium py-2"
                >
                  Shoes
                </button>
                <button 
                  onClick={() => handleCategoryClick('Clothes')}
                  className="text-left text-gray-700 hover:text-violet-600 font-medium py-2"
                >
                  Clothes
                </button>
                <button 
                  onClick={() => handleCategoryClick('Accessories')}
                  className="text-left text-gray-700 hover:text-violet-600 font-medium py-2"
                >
                  Accessories
                </button>
                
                {/* Mobile Search and Cart */}
                <button 
                  onClick={handleSearchClick}
                  className="text-left text-gray-700 hover:text-violet-600 font-medium py-2"
                >
                  Search Products
                </button>
                {user && (
                  <button 
                    onClick={handleCartClick}
                    className="text-left text-gray-700 hover:text-violet-600 font-medium py-2 flex items-center"
                  >
                    Shopping Cart
                    {cartCount > 0 && (
                      <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {cartCount}
                      </Badge>
                    )}
                  </button>
                )}
                
                {user ? (
                  <>
                    <Link to="/profile" className="text-gray-700 hover:text-violet-600 font-medium py-2">
                      Profile
                    </Link>
                    {user.isAdmin && (
                      <Link to="/admin" className="text-gray-700 hover:text-violet-600 font-medium py-2">
                        Admin Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="text-left text-gray-700 hover:text-violet-600 font-medium py-2">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-gray-700 hover:text-violet-600 font-medium py-2">
                      Login
                    </Link>
                    <Link to="/signup" className="text-gray-700 hover:text-violet-600 font-medium py-2">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
