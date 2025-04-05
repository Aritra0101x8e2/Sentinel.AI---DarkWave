
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/30 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Button 
          asChild
          className="bg-teal-600 hover:bg-teal-500"
        >
          <a href="/">Return to Login Page</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
