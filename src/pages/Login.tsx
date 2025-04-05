
import LoginForm from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <div className="auth-pattern flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="bg-gray-900/90 backdrop-blur-sm p-8 rounded-lg border border-gray-800 shadow-xl">
            <div className="flex flex-col items-center mb-6 space-y-2">
              <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center mb-2">
                <ShieldCheck size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Sentinel.AI by DarkWave</h1>
              <p className="text-gray-400 text-center text-sm">
                AI-powered authentication that learns from user behavior
              </p>
            </div>
            
            <LoginForm />
            
            <div className="mt-6 flex flex-col space-y-4 text-center text-sm">
              <div className="text-gray-500">
                Don't have an account?{" "}
                <Button variant="link" className="text-teal-400 hover:text-teal-300 p-0">
                  Sign Up
                </Button>
              </div>
              
              <a href="#" className="text-gray-400 hover:text-gray-300 text-xs">
                Forgot password?
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-900 border-t border-gray-800 py-4 text-center text-gray-500 text-xs">
        © 2025 Sentinel.AI - DarkWave by Aritra Kundu. All rights reserved.
      </footer>
    </div>
  );
}
