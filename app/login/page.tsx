'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import nexusesLogo from './nexuseslogo.png';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Force a hard navigation to reload the page with the new auth state
        window.location.href = '/';
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EBF5FF] via-gray to-[#F0F7FF]">
      <div className="max-w-md w-full p-10 space-y-6 bg-white/95 rounded-2xl shadow-[0_8px_30px_rgb(53,146,235,0.12)] backdrop-blur-xl border border-[#3592EB]/30">
        <div className="text-center space-y-4">
          <div className="mx-auto w-[220px] h-[90px] relative transform transition-all duration-500 hover:scale-105">
            <Image
              src={nexusesLogo}
              alt="Nexuses Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-[#3592EB] to-[#6B8CEF] bg-clip-text text-transparent">
                Welcome 
              </span>
            </h2>
            <p className="text-gray-600 text-sm">
              Enter your credentials to send emails
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 animate-shake">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="group">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full px-4 py-3 rounded-xl border border-[#3592EB]/30 bg-white/50 text-gray-900 placeholder-gray-400 
                focus:ring-2 focus:ring-[#3592EB] focus:border-transparent 
                transition-all duration-300 ease-in-out hover:border-[#3592EB]/50 group-hover:translate-x-1"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="group">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full px-4 py-3 rounded-xl border border-[#3592EB]/30 bg-white/50 text-gray-900 placeholder-gray-400 
                focus:ring-2 focus:ring-[#3592EB] focus:border-transparent 
                transition-all duration-300 ease-in-out hover:border-[#3592EB]/50 group-hover:translate-x-1"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#3592EB] focus:ring-[#3592EB] border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 hover:text-[#3592EB] transition-colors duration-200 cursor-pointer">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm font-medium text-[#3592EB] hover:text-[#3592EB]/80 transition-all duration-200 hover:underline">
              Forgot password?
            </a>
          </div> */}

          <button
            type="submit"
            disabled={loading}
            className="relative w-full py-3.5 px-4 rounded-xl text-white font-medium 
            bg-gradient-to-r from-[#3592EB] to-[#3592EB]/90 hover:from-[#3592EB]/90 hover:to-[#3592EB]
            transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_8px_20px_rgb(53,146,235,0.3)]
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3592EB]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 
            disabled:hover:shadow-none"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              'Sign in'
            )}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{' '}
            <a 
              href="https://nexuses.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-medium text-[#3592EB] hover:text-[#3592EB]/80 transition-all duration-200 hover:underline"
            >
              Contact admin
            </a>
          </p>
        </form>
      </div>
    </div>
  );
} 