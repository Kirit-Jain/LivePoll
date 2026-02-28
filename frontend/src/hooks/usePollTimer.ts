import { useState, useEffect } from "react";

export const usePollTimer = (endsAt: string | null) => {
    const calculateRemaining = (target: string | null) => {
        if (!target) return 0;
        const diff = new Date(target).getTime() - Date.now();
        return Math.max(0, Math.ceil(diff / 1000));
    }

    const [remaining, setRemaining] = useState(() => calculateRemaining(endsAt));
    const [prevEndsAt, setPrevEndsAt] = useState(endsAt);

    if (endsAt !== prevEndsAt) {
        setPrevEndsAt(endsAt);
        setRemaining(calculateRemaining(endsAt));
    }

    useEffect(() => {
        if (!endsAt) {
            return;
        }

        const id = setInterval(() => {
            setRemaining(calculateRemaining(endsAt));
        }, 1000);

        return () => clearInterval(id);
    }, [endsAt]);

    return remaining;
}