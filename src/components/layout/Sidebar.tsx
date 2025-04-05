
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  AlertTriangle,
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className={cn(
      "h-screen fixed left-0 top-0 z-40 flex flex-col border-r border-gray-800 bg-gray-900/95",
      className
    )}>
      <div className="flex flex-col flex-grow p-4 space-y-4">
        <Link
          to="/dashboard"
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
            isActive("/dashboard") 
              ? "bg-teal-900/30 text-teal-400"
              : "text-gray-400 hover:text-white hover:bg-gray-800/50"
          )}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>
        
        <Link
          to="/users"
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
            isActive("/users") 
              ? "bg-teal-900/30 text-teal-400"
              : "text-gray-400 hover:text-white hover:bg-gray-800/50"
          )}
        >
          <Users size={18} />
          <span>Users</span>
        </Link>
        
        <Link
          to="/security"
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
            isActive("/security") 
              ? "bg-teal-900/30 text-teal-400"
              : "text-gray-400 hover:text-white hover:bg-gray-800/50"
          )}
        >
          <Shield size={18} />
          <span>Security Center</span>
          <div className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 flex items-center">
            3
          </div>
        </Link>
        
        <Link
          to="/alerts"
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
            isActive("/alerts") 
              ? "bg-teal-900/30 text-teal-400"
              : "text-gray-400 hover:text-white hover:bg-gray-800/50"
          )}
        >
          <AlertTriangle size={18} />
          <span>Alerts</span>
        </Link>
        
        <div className="mt-auto flex flex-col space-y-2">
          <Link
            to="/settings"
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
              isActive("/settings") 
                ? "bg-teal-900/30 text-teal-400"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            )}
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>
          
          <Button 
            variant="ghost" 
            className="justify-start px-3 py-2 h-auto text-gray-400 hover:text-white hover:bg-gray-800/50"
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-3" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
