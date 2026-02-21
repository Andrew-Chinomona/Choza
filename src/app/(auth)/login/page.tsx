"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setegid } from "process";

export default function Home() {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    /*
    try{
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: 'testuser', 
          pin: '1234', 
          mockRole: 'MAIN_MANAGER' // Change this to test different dashboards! [cite: 45-55]
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/'); // Redirect to root, middleware will handle sending them to the right dashboard based on their role
        router.refresh(); // Refresh to update the UI based on new auth state
      } else {
        setError(data.error || "Login failed, please check your credentials and try again.");
      }
    } catch (err){
      setError("Error logging in: " + (err as any).message);
    } finally {
      setIsLoading(false);
    }
    */
    router.push(`/management`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <div className="w-full max-w-md px-8">
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-semibold text-center mb-8 text-zinc-900 dark:text-zinc-50">
            Welcome to Choza
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 focus:border-transparent outline-none bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 transition-colors"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label 
                htmlFor="pin" 
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                PIN
              </label>
              <input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 focus:border-transparent outline-none bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 transition-colors"
                placeholder="Enter your PIN"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 py-3 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 focus:ring-offset-2"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a 
              href="#" 
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              Forgot password?
            </a>
          </div>
          {error && (
            <div className="mt-4 text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
