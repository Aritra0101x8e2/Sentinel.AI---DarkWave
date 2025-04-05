
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, ShieldCheck, Fingerprint } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      // First login check
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Now simulate AI behavior analysis
      setIsAnalyzing(true);
      
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (email === "admin@sentinel.com" && password === "password") {
        toast({
          title: "Login successful",
          description: "Welcome back, Admin!",
        });
        navigate("/dashboard");
      } else if (email === "threat@example.com") {
        // Simulate detected threat
        toast({
          title: "Security Alert",
          description: "Suspicious behavior detected. Additional verification required.",
          variant: "destructive",
        });
        navigate("/verification");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="admin@sentinel.com"
            className="bg-gray-800/40 border-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || isAnalyzing}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="bg-gray-800/40 border-gray-700 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading || isAnalyzing}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading || isAnalyzing}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      
      {isAnalyzing && (
        <div className="py-2 px-3 bg-teal-900/20 border border-teal-800 rounded-md flex items-center space-x-2">
          <div className="ripple text-teal-500">
            <Fingerprint size={20} />
          </div>
          <span className="text-sm text-teal-300">AI analyzing behavior patterns...</span>
        </div>
      )}
      
      <Button
        type="submit"
        className="w-full bg-teal-600 hover:bg-teal-500 text-white"
        disabled={isLoading || isAnalyzing}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            <span>Logging in...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <ShieldCheck size={18} />
            <span>{isAnalyzing ? "Verifying Identity..." : "Login Securely"}</span>
          </div>
        )}
      </Button>
      
      <div className="text-xs text-gray-400 text-center pt-2">
        <p>Demo credentials:</p>
        <p className="text-gray-500">Email: admin@sentinel.com / Password: password</p>
      </div>
    </form>
  );
}
