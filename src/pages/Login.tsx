import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/dahab-masr-logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      if (email && password) {
        toast({
          title: "Welcome back",
          description: "Successfully logged in to Dahab Masr",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Error",
          description: "Please enter your credentials",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-gold/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-gold/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md mx-4 animate-fade-in">
        {/* Logo section */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Dahab Masr"
            className="h-24 mx-auto mb-6 drop-shadow-2xl"
          />
          <p className="text-gold-muted font-body text-sm tracking-widest uppercase">
            Internal Dashboard
          </p>
        </div>

        {/* Login card */}
        <div className="bg-card/5 backdrop-blur-sm border border-gold/20 rounded-lg p-8 shadow-elegant">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gold-light font-body text-sm">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@dahabmasr.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-sidebar-accent border-gold/20 text-sidebar-foreground placeholder:text-muted-foreground focus:border-gold focus:ring-gold/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gold-light font-body text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-sidebar-accent border-gold/20 text-sidebar-foreground placeholder:text-muted-foreground focus:border-gold focus:ring-gold/30"
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="#"
              className="text-gold-muted hover:text-gold text-sm font-body transition-colors"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gold-muted/50 text-xs mt-8 font-body">
          © 2025 Dahab Masr. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
