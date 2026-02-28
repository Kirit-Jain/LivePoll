import { useState, useEffect } from "react";
import { api } from "@/service/api";
import { Spinner } from "@/components/shared";
import { styles } from "./styles";
import type { IPoll } from "@/types/poll.types";

export const PollHistoryView = () => {
  const [history, setHistory] = useState<IPoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api.getHistory().then((data) => setHistory(data as IPoll[])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.historyCard}><Spinner message="Loading history..." /></div>;

  return (
    <div style={styles.historyCard}>
      <h2 style={styles.cardTitle}>Poll History</h2>
      {history.map((poll) => {
        const totalVotes = poll.options.reduce((s, o) => s + o.votes, 0);
        const isWin = (votes: number) => votes > 0 && votes === Math.max(...poll.options.map(o => o.votes));
        return (
          <div key={poll._id} style={styles.historyItem}>
            <div style={styles.historyHeader} onClick={() => setExpanded(expanded === poll._id ? null : poll._id)}>
              <div><p style={{ fontWeight: 700 }}>{poll.question}</p><p style={{ fontSize: 12, color: "#94a3b8" }}>{new Date(poll.createdAt).toLocaleDateString()}</p></div>
              <span>{expanded === poll._id ? "▲" : "▼"}</span>
            </div>
            {expanded === poll._id && (
              <div style={styles.historyBody}>
                {poll.options.map((opt) => (
                  <div key={opt._id} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}>
                      <span>{opt.text}</span><span>{opt.votes} votes</span>
                    </div>
                    <div style={styles.historyTrack}>
                      <div style={{ ...styles.historyFill, width: `${(opt.votes / (totalVotes || 1)) * 100}%`, backgroundColor: isWin(opt.votes) ? "#2563eb" : "#e2e8f0" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};