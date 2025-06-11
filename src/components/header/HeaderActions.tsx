
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import CartDrawer from "@/components/CartDrawer";

interface User {
  name?: string;
  isAdmin?: boolean;
}

interface HeaderActionsProps {
  user: User | null;
  onSearchClick: () => void;
}

const HeaderActions = ({ user, onSearchClick }: HeaderActionsProps) => {
  return (
    <div className="hidden md:flex items-center space-x-4">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onSearchClick}
        className="hover:bg-violet-50 hover:text-violet-600"
      >
        <Search className="h-4 w-4" />
      </Button>
      
      {user && <CartDrawer />}
      {user && <NotificationBell />}
    </div>
  );
};

export default HeaderActions;
