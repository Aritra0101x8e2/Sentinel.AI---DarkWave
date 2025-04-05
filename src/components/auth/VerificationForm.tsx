
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ShieldCheck, AlertTriangle } from "lucide-react";

export default function VerificationForm() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple validation
    if (!code || code.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit code",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo, we'll accept any 6-digit code
    if (code === "123456") {
      toast({
        title: "Verification successful",
        description: "Your identity has been verified",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Verification failed",
        description: "The verification code is incorrect",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleVerify} className="space-y-6">
      <div className="bg-amber-900/20 border border-amber-800 rounded-md p-4 mb-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="text-amber-500 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-amber-400">Additional Verification Required</h3>
            <p className="text-sm text-gray-300 mt-1">
              We've detected unusual activity with this login attempt. Please enter the verification code sent to your registered email.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="code" className="text-sm font-medium">
          Verification Code
        </Label>
        <Input
          id="code"
          type="text"
          placeholder="123456"
          className="bg-gray-800/40 border-gray-700 text-center text-lg tracking-widest"
          value={code}
          onChange={(e) => {
            // Only allow digits and max 6 characters
            const filtered = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
            setCode(filtered);
          }}
          disabled={isLoading}
          maxLength={6}
        />
        <p className="text-xs text-gray-400 text-center pt-1">
          For demo, use code: 123456
        </p>
      </div>
      
      <Button
        type="submit"
        className="w-full bg-teal-600 hover:bg-teal-500 text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            <span>Verifying...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <ShieldCheck size={18} />
            <span>Verify Identity</span>
          </div>
        )}
      </Button>
      
      <div className="text-center mt-4">
        <Button
          type="button"
          variant="link"
          className="text-gray-400 hover:text-gray-300 text-sm"
          onClick={() => navigate("/login")}
        >
          Return to login
        </Button>
      </div>
    </form>
  );
}
