
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Bell, Settings, User, LogOut, ChevronDown } from "lucide-react";
import { Badge } from "../ui/badge";
import { currentUser } from "@/lib/mockData";

export default function Header() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-background/50 backdrop-blur-sm border-b border-gray-800 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-6">
          <a href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-teal-600 flex items-center justify-center">
              <span className="font-bold text-lg text-white">S</span>
            </div>
            <span className="font-bold text-xl">Sentinel.AI</span>
          </a>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-300 hover:text-white hover:bg-gray-800/50"
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center space-x-2 hover:bg-gray-800/50"
              >
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <User size={16} className="text-gray-300" />
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-1">
                    {currentUser.username}
                  </span>
                  <ChevronDown size={14} />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
