
import { Link } from "react-router-dom";

interface DesktopNavProps {
  onCategoryClick: (category: string) => void;
  onShopNowClick: () => void;
}

const DesktopNav = ({ onCategoryClick, onShopNowClick }: DesktopNavProps) => {
  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link to="/" className="text-gray-700 hover:text-violet-600 font-medium transition-colors">
        Home
      </Link>
      <button 
        onClick={() => onCategoryClick('CCTV Cameras & Security Systems')}
        className="text-gray-700 hover:text-primary font-medium transition-colors"
      >
        Cameras
      </button>
      <button 
        onClick={() => onCategoryClick('Electrical Installations & Maintenance')}
        className="text-gray-700 hover:text-primary font-medium transition-colors"
      >
        Electrical
      </button>
     
      <button 
        onClick={() => onCategoryClick('IT Services & Consultancy')}
        className="text-gray-700 hover:text-primary font-medium transition-colors"
      >
        IT Services
      </button>
      <button 
        onClick={onShopNowClick}
        className="text-gray-700 hover:text-violet-600 font-medium transition-colors"
      >
        All Products
      </button>
    </nav>
  );
};

export default DesktopNav;
