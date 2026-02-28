import { useDispatch, useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useSocket } from "@/hooks/useSocket";
import { usePollTimer } from "@/hooks/usePollTimer";
import { clearPoll } from "@/store/slices/pollslices";
import { TimerBar } from "@/components/shared";
import { styles } from "./styles";
import type { RootState } from "@/store/store";

const BAR_COLORS = ["#2563eb", "#7c3aed", "#0891b2", "#059669", "#d97706", "#dc2626"];

export const LiveResultsChart = () => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const poll = useSelector((s: RootState) => s.poll.currentPoll);
  const endsAt = useSelector((s: RootState) => s.poll.endsAt);
  const remaining = usePollTimer(endsAt);

  if (!poll) return null;

  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
  const isClosed = poll.status === "closed" || remaining === 0;
  const chartData = poll.options.map((opt) => ({
    name: opt.text, 
    votes: opt.votes, 
    pct: totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0
  }));

  const handleForceReset = () => {
    dispatch(clearPoll());
    if (poll.status === "active") {
      socket.emit("CLOSE_POLL", { pollId: poll._id });
    }
  };

  return (
    <div style={styles.resultsCard}>
      <div style={styles.resultsHeader}>
        <div>
          <h2 style={styles.cardTitle}>{isClosed ? "Final Results" : "Live Results"}</h2>
          <p style={styles.totalVotes}>{totalVotes} votes so far</p>
        </div>
        {!isClosed ? (
          <button style={styles.removeBtn} onClick={() => socket.emit("CLOSE_POLL", { pollId: poll._id })}>
            End Poll
          </button>
        ) : (
          <button 
            style={{ ...styles.primaryButton, marginTop: 0, width: "auto", padding: "12px 24px", backgroundColor: "#059669" }} 
            onClick={handleForceReset}
          >
            + New Question
          </button>
        )}
      </div>

      {!isClosed && <TimerBar remaining={remaining} duration={poll.duration} />}
      {isClosed && <div style={{ color: "#ef4444", fontWeight: 700, marginBottom: 16 }}>🏁 Poll Ended</div>}
      
      <p style={styles.questionLabel}>{poll.question}</p>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
          <Tooltip cursor={{ fill: "#f8fafc" }} />
          <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
            {chartData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div style={styles.breakdown}>
        {poll.options.map((opt, i) => (
          <div key={opt._id} style={styles.breakdownRow}>
            <span style={{ ...styles.breakdownDot, backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }} />
            <span style={styles.breakdownLabel}>{opt.text}</span>
            <span style={styles.breakdownPct}>{totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0}%</span>
            <span style={styles.breakdownCount}>({opt.votes})</span>
          </div>
        ))}
      </div>
    </div>
  );
};