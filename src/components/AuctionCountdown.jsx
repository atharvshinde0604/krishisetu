import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const AuctionCountdown = ({ expiresAt, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const diff = Number(expiresAt) - Date.now();
      if (diff <= 0) {
        setTimeLeft('00h:00m:00s (Ended)');
        setIsExpired(true);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(
        `${String(hours).padStart(2, '0')}h:${String(mins).padStart(2, '0')}m:${String(secs).padStart(2, '0')}s left`
      );
      setIsExpired(false);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <span
      className={`inline-flex items-center space-x-1.5 font-mono text-xs font-bold px-2.5 py-1 rounded-full border transition-all ${
        isExpired
          ? 'bg-slate-100 text-slate-600 border-slate-300'
          : 'bg-red-50 text-red-700 border-red-300/80 animate-pulse'
      } ${className}`}
    >
      <Clock className="w-3.5 h-3.5 shrink-0" />
      <span>{timeLeft}</span>
    </span>
  );
};
