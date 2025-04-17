
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulating API call
    setTimeout(() => {
      toast({
        title: "Welcome to StudySpark!",
        description: "You have successfully logged in",
      });
      setIsLoading(false);
      onLogin();
      navigate("/study-type");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">
              Study<span className="text-study-purple">Spark</span>
            </h1>
            <p className="text-gray-500 mt-2">
              Boost your productivity and achieve your study goals
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-study-purple">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-study-purple hover:bg-opacity-90"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              Don't have an account?{" "}
              <a href="#" className="text-study-purple font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} StudySpark. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
