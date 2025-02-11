'use client';

import { useEffect, useState } from 'react';

interface TimerDisplayProps {
  totalEmails: number;
  currentEmail: number;
  isPaused: boolean;
  secondsLeft: number;
  delay: number;
}

export function TimerDisplay({ totalEmails, currentEmail, isPaused, secondsLeft, delay }: TimerDisplayProps) {
  const [timeString, setTimeString] = useState('00:00');
  
  // Calculate total time needed based on delay value (in minutes)
  const totalMinutesNeeded = Math.max(0, totalEmails - 1) * delay;
  const formattedTotalTime = totalMinutesNeeded > 0 
    ? `${Math.floor(totalMinutesNeeded / 60)}h ${totalMinutesNeeded % 60}m`
    : 'No delay';

  useEffect(() => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    setTimeString(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  }, [secondsLeft]);

  return (
    <div className="flex flex-col items-center space-y-2 p-4 rounded-lg border bg-card text-card-foreground shadow">
      <div className="text-2xl font-bold font-mono">{timeString}</div>
      <div className="text-sm text-muted-foreground">
        Email {currentEmail} of {totalEmails}
      </div>
      <div className="text-sm text-muted-foreground">
        Total time needed: {formattedTotalTime}
      </div>
      <div className="text-sm">
        {isPaused ? "Cooling down..." : "Sending..."}
      </div>
    </div>
  );
} 