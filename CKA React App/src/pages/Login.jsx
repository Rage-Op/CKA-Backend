import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login({ username, password });
      if (response.status === 200 || response.data) {
        navigate("/");
      }
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/content/login-wallpaper.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card className="w-full max-w-md p-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <img
                src="/content/logo.png"
                alt="CKA Logo"
                className="w-20 h-20 rounded-full"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Log in to CKA-Dashboard
            </h2>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full"
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;
