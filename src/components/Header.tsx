
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/header/Logo";
import DesktopNav from "@/components/header/DesktopNav";
import UserMenu from "@/components/header/UserMenu";
import HeaderActions from "@/components/header/HeaderActions";
import MobileMenu from "@/components/header/MobileMenu";

const Header = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    console.log('Header: Auth state changed:', { user: !!user, loading, userName: user?.name });
  }, [user, loading]);

  const handleShopNowClick = () => {
    navigate('/products');
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/products?category=${category}`);
  };

  const handleSearchClick = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <div className="hidden md:flex items-center space-x-4">
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />

          <DesktopNav 
            onCategoryClick={handleCategoryClick}
            onShopNowClick={handleShopNowClick}
          />

          <div className="hidden md:flex items-center space-x-4">
            <HeaderActions 
              user={user}
              onSearchClick={handleSearchClick}
            />
            <UserMenu user={user} onLogout={logout} />
          </div>

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

        <MobileMenu 
          isOpen={isMenuOpen}
          user={user}
          onCategoryClick={handleCategoryClick}
          onSearchClick={handleSearchClick}
          onLogout={logout}
        />
      </div>
    </header>
  );
};

export default Header;
