
import { Link } from "react-router-dom";
import CartDrawer from "@/components/CartDrawer";

interface User {
  name?: string;
  isAdmin?: boolean;
}

interface MobileMenuProps {
  isOpen: boolean;
  user: User | null;
  onCategoryClick: (category: string) => void;
  onSearchClick: () => void;
  onLogout: () => void;
}

const MobileMenu = ({ isOpen, user, onCategoryClick, onSearchClick, onLogout }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden py-4 border-t">
      <div className="flex flex-col space-y-2">
        <Link to="/" className="text-gray-700 hover:text-violet-600 font-medium py-2">
          Home
        </Link>
        <button 
          onClick={() => onCategoryClick('CCTV Cameras & Security Systems')}
          className="text-left text-gray-700 hover:text-primary font-medium py-2"
        >
          CCTV & Security
        </button>
        <button 
          onClick={() => onCategoryClick('Electrical Installations & Maintenance')}
          className="text-left text-gray-700 hover:text-primary font-medium py-2"
        >
          Electrical Services
        </button>
        <button 
          onClick={() => onCategoryClick('Networking & Telecommunications')}
          className="text-left text-gray-700 hover:text-primary font-medium py-2"
        >
          Networking
        </button>
        <button 
          onClick={() => onCategoryClick('IT Services & Consultancy')}
          className="text-left text-gray-700 hover:text-primary font-medium py-2"
        >
          IT Services
        </button>
        
        <button 
          onClick={onSearchClick}
          className="text-left text-gray-700 hover:text-violet-600 font-medium py-2"
        >
          Search Products
        </button>
        {user && (
          <div className="py-2">
            <CartDrawer />
          </div>
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
            <button onClick={onLogout} className="text-left text-gray-700 hover:text-violet-600 font-medium py-2">
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
  );
};

export default MobileMenu;
