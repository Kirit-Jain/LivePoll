import type React from 'react';

interface TimerBarProps {
    remaining: number;
    duration: number;
}

const TimerBar: React.FC<TimerBarProps> = ({ remaining, duration }) => {
    const pct = duration > 0 ? Math.min(100, (remaining / duration) * 100) : 0;

    const color = remaining > duration * 0.5 ? '#22c55e' : remaining > duration * 0.2 ? '#f59e0b' : '#ef4444';

    return (
    <div style={styles.wrapper}>
      {/* Track */}
      <div style={styles.track}>
        <div
          style={{
            ...styles.fill,
            width: `${pct}%`,
            backgroundColor: color,
            transition: "width 1s linear, background-color 0.5s ease",
          }}
        />
      </div>

      {/* Labels */}
      <div style={styles.labels}>
        <span style={{ ...styles.remaining, color }}>
          {remaining}s remaining
        </span>
        <span style={styles.total}>{duration}s total</span>
      </div>
    </div>
  );
};


const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    width: "100%",
    marginBottom: 16,
  },
  track: {
    width: "100%",
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 6,
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
  labels: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  remaining: {
    fontSize: 13,
    fontWeight: 700,
  },
  total: {
    fontSize: 13,
    color: "#9ca3af",
  },
};

export default TimerBar;