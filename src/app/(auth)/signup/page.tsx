"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [pin, setPin] = useState("");
  const [role, setRole] = useState("HOUSEKEEPER");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, fullName, pin, role }),
      });

      const data = await res.json();

      if (res.ok) {
        // Automatically route to login upon successful account creation
        router.push("/login");
      } else {
        setError(data.error || "Signup failed.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <div className="w-full max-w-md px-8">
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-semibold text-center mb-8 text-zinc-900 dark:text-zinc-50">
            Create Account
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="fullName" 
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 focus:border-transparent outline-none bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 transition-colors"
                placeholder="e.g., John Doe"
              />
            </div>

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
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 focus:border-transparent outline-none bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 transition-colors"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label 
                htmlFor="pin" 
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                4-Digit PIN
              </label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                maxLength={4}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 focus:border-transparent outline-none bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 transition-colors"
                placeholder="Enter your 4-digit PIN"
              />
            </div>

            <div>
              <label 
                htmlFor="role" 
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                System Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 focus:border-transparent outline-none bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 transition-colors"
              >
                <option value="HOUSEKEEPER">Housekeeper</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="OPS_MANAGEMENT">Ops Manager</option>
                <option value="MAIN_MANAGER">Main Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 py-3 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          {error && (
            <div className="mt-4 text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link 
              href="/login" 
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}