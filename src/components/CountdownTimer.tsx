"use client";

import { useEffect, useState } from "react";
import { parseAoEDeadline } from "@/lib/deadlines";

interface CountdownTimerProps {
  deadline: string;
  className?: string;
}

export default function CountdownTimer({ deadline, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    function update() {
      const target = parseAoEDeadline(deadline);
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Deadline passed");
        setIsUrgent(false);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setIsUrgent(days <= 7);

      if (days > 30) {
        setTimeLeft(`${days}d`);
      } else if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    }

    update();
    const interval = setInterval(update, 60000); // update every minute
    return () => clearInterval(interval);
  }, [deadline]);

  if (!timeLeft) return null;

  return (
    <span
      className={`font-mono tabular-nums ${isUrgent ? "text-orange-600 dark:text-orange-400 font-bold" : "text-gray-600 dark:text-gray-400"} ${className}`}
    >
      {timeLeft}
    </span>
  );
}
