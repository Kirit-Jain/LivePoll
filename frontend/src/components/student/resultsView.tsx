import { useSelector } from "react-redux";
import { styles } from "./styles";
import type { RootState } from "@/store/store";

export const ResultsView = () => {
  const poll = useSelector((s: RootState) => s.poll.currentPoll);
  if (!poll) return null;

  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
  const isClosed = poll.status === "closed";

  return (
    <div style={styles.resultsCard}>
      <h3 style={styles.resultsTitle}>{isClosed ? "Final Results" : "Results so far"}</h3>
      <p style={styles.resultsQuestion}>{poll.question}</p>

      <div style={styles.resultsList}>
        {poll.options.map((opt) => {
          const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          const isWinner = pct === Math.max(...poll.options.map(o => totalVotes > 0 ? Math.round((o.votes / totalVotes) * 100) : 0)) && pct > 0;
          
          return (
            <div key={opt._id} style={styles.resultRow}>
              <div style={styles.resultLabelRow}>
                <span style={styles.resultLabel}>{opt.text}</span>
                <span style={styles.resultPct}>{pct}%</span>
              </div>
              <div style={styles.resultTrack}>
                <div style={{ ...styles.resultFill, width: `${pct}%`, backgroundColor: isWinner ? "#2563eb" : "#94a3b8" }} />
              </div>
              <span style={styles.resultCount}>{opt.votes} vote{opt.votes !== 1 ? "s" : ""}</span>
            </div>
          );
        })}
      </div>
      {isClosed && <p style={styles.waitingNext}>Waiting for the next question…</p>}
    </div>
  );
};