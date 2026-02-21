'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Call the backend to delete the secure HTTP-only cookie
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // 2. Route the user back to the landing page
      router.push('/');
      router.refresh(); // Force Next.js to re-evaluate the auth state
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="relative flex h-20 items-center justify-between bg-[#cf5c5c] px-4 shadow-md">
        
        {/* Left Side: Avatar/Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#cf5c5c] bg-white shadow-sm">
          </div>
          <h1 className="font-serif text-lg tracking-widest text-white uppercase">
            Fairfield Hotel
          </h1>
        </div>

        {/* Right Side: Hamburger Menu Button & Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu" 
            className="rounded p-2 text-white hover:bg-white/20 focus:outline-none"
          >
            <svg 
              className="h-8 w-8" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* The Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
}