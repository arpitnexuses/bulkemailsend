'use client';

import React from 'react';

interface TimerDisplayProps {
  seconds: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ seconds }) => {
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(remainingSeconds)}`;
    }
    return `${pad(minutes)}:${pad(remainingSeconds)}`;
  };

  return (
    <div className="text-center p-2 bg-blue-100 rounded-md mb-4">
      <p className="text-lg font-semibold">Time remaining:</p>
      <p className="text-2xl font-bold text-blue-600">{formatTime(seconds)}</p>
    </div>
  );
};

export default TimerDisplay; 