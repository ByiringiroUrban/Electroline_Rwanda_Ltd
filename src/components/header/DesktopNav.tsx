
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
        onClick={() => onCategoryClick('Shoes')}
        className="text-gray-700 hover:text-violet-600 font-medium transition-colors"
      >
        Shoes
      </button>
      <button 
        onClick={() => onCategoryClick('Clothes')}
        className="text-gray-700 hover:text-violet-600 font-medium transition-colors"
      >
        Clothes
      </button>
      <button 
        onClick={() => onCategoryClick('Accessories')}
        className="text-gray-700 hover:text-violet-600 font-medium transition-colors"
      >
        Accessories
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
