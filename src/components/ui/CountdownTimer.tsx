"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
    deadline: Date;
    compact?: boolean;
}

export function CountdownTimer({ deadline, compact = false }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = new Date(deadline).getTime() - new Date().getTime();

        if (difference <= 0) {
            return { expired: true, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            expired: false,
            hours: Math.floor(difference / (1000 * 60 * 60)),
            minutes: Math.floor((difference / (1000 * 60)) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [deadline]);

    if (timeLeft.expired) {
        return (
            <div className={`flex items-center gap-2 ${compact ? 'text-sm' : 'text-base'} text-red-500`}>
                <Clock className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
                <span className="font-medium">Expired</span>
            </div>
        );
    }

    const isUrgent = timeLeft.hours < 1;

    if (compact) {
        return (
            <div className={`flex items-center gap-1.5 text-sm font-medium ${isUrgent ? 'text-red-500' : 'text-gold'}`}>
                <Clock className="w-4 h-4" />
                <span>
                    {timeLeft.hours > 0 && `${timeLeft.hours}h `}
                    {timeLeft.minutes}m
                </span>
            </div>
        );
    }

    return (
        <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border ${isUrgent
                ? 'bg-red-500/10 border-red-500/30 text-red-500'
                : 'bg-gold/10 border-gold/30 text-gold'
            }`}>
            <Clock className="w-5 h-5" />
            <div className="flex items-center gap-2 font-mono font-bold">
                {timeLeft.hours > 0 && (
                    <>
                        <span className="text-2xl">{String(timeLeft.hours).padStart(2, '0')}</span>
                        <span className="text-white/50">:</span>
                    </>
                )}
                <span className="text-2xl">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-white/50">:</span>
                <span className="text-2xl">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
            <span className="text-xs uppercase tracking-wider opacity-70">
                {isUrgent ? 'Hurry!' : 'Left to Join'}
            </span>
        </div>
    );
}
