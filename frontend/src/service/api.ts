const BASE = import.meta.env.VITE_API_URL || "/api";

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
    const res = await fetch(`${BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

export const api = {
    createPoll: (body: { question: string, options: { text: string; isCorrect: boolean }[], duration: number }) =>
        request("/polls", { method: "POST", body: JSON.stringify(body) }),

    getHistory: () => request("/polls/history"),

    closePoll: (pollId: string) => 
        request(`/polls/${pollId}/close`, { method: "PATCH" }),
};

