'use client';
import { useState } from 'react';
import HistoryModal from './HistoryModal';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/campaign-history');
      const data = await response.json();
      setHistory(data);
      setIsHistoryOpen(true);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'  // Add this to ensure cookies are included
      });

      if (response.ok) {
        // Redirect to login page after successful logout
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-transparent">
      <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8 flex justify-end items-center mt-4 space-x-4">
        <button
          onClick={fetchHistory}
          disabled={isLoading}
          className="group relative inline-flex items-center justify-center min-w-[140px] px-5 py-2.5 text-sm font-medium tracking-wide text-white bg-blue-500 overflow-hidden rounded-md transition-all duration-300 ease-out hover:scale-105 hover:bg-blue-600 active:scale-95 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
          <span className="relative flex items-center">
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              'View History'
            )}
          </span>
        </button>
        <button
          onClick={handleLogout}
          className="group relative inline-flex items-center justify-center min-w-[120px] px-5 py-2.5 text-sm font-medium tracking-wide text-white bg-gradient-to-br from-purple-600 to-blue-500 overflow-hidden rounded-md transition-all duration-300 ease-out hover:scale-105 hover:from-purple-700 hover:to-blue-600 active:scale-95 shadow-md"
        >
          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
          <span className="relative">Logout</span>
        </button>
      </div>
      <HistoryModal 
        isOpen={isHistoryOpen}
        closeModal={() => setIsHistoryOpen(false)}
        history={history}
      />
    </header>
  );
} 