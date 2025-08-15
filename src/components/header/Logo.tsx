
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <img 
        src="/lovable-uploads/5bbf9a34-bbbe-4f59-ba3a-3df875817a9e.png" 
        alt="Electroline Rwanda Ltd Logo" 
        className="w-8 h-8 object-contain"
      />
      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
        Electroline Rwanda Ltd.
      </span>
    </Link>
  );
};

export default Logo;
