
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const [isStaffLogin, setIsStaffLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would validate and authenticate here
    // For demo, we'll just navigate to the respective dashboard
    if (isStaffLogin) {
      navigate("/staff/dashboard");
    } else {
      navigate("/owner/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        
        {/* Portal Type Indicator */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isStaffLogin ? "Staff Portal" : "Owner Portal"}
          </h2>
          <p className="text-muted-foreground mt-2">
            Sign in to access your {isStaffLogin ? "staff" : "owner"} account
          </p>
        </div>
        
        {/* Login Form */}
        <div className="auth-card">
          <form onSubmit={handleLogin}>
            <h3 className="text-xl font-semibold mb-6">Sign In</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">Sign in</Button>
            </div>
          </form>
          
          {/* Toggle between staff and owner login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isStaffLogin 
                ? "Are you an owner?" 
                : "Are you a staff member?"
              }
              {" "}
              <button 
                type="button"
                onClick={() => setIsStaffLogin(!isStaffLogin)} 
                className="text-primary font-medium hover:underline"
              >
                {isStaffLogin 
                  ? "Switch to Owner Login" 
                  : "Switch to Staff Login"
                }
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
