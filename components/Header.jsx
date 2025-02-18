'use client';
import { useState } from 'react';
import HistoryModal from './HistoryModal';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/campaign-history');
      const data = await response.json();
      setHistory(data);
      setIsHistoryOpen(true);
    } catch (error) {
      console.error('Error fetching history:', error);
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
          className="group relative inline-flex items-center justify-center min-w-[140px] px-5 py-2.5 text-sm font-medium tracking-wide text-white bg-blue-500 overflow-hidden rounded-md transition-all duration-300 ease-out hover:scale-105 hover:bg-blue-600 active:scale-95 shadow-md"
        >
          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
          <span className="relative">View History</span>
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