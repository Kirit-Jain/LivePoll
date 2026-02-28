import type React from "react";

interface SpinnerProps {
    message?: string;
    dotSize?: number;
}

const Spinner: React.FC<SpinnerProps> = ({
    message = "Please wait...",
    dotSize = 8,
}) => {
    return (
        <div style={styles.wrapper}>
          <div style={styles.dotsRow}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  ...styles.dot,
                  width: dotSize,
                  height: dotSize,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
          {message && <p style={styles.message}>{message}</p>}

          
          <style>{`
            @keyframes polling-pulse {
              0%, 100% { opacity: 0.3; transform: scale(0.85); }
              50%       { opacity: 1;   transform: scale(1.15); }
            }
          `}</style>
        </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  dotsRow: {
    display: "flex",
    gap: 6,
    alignItems: "center",
  },
  dot: {
    borderRadius: "50%",
    backgroundColor: "#94a3b8",
    display: "inline-block",
    animation: "polling-pulse 1.2s ease-in-out infinite",
  },
  message: {
    margin: 0,
    fontSize: 13,
    color: "#6b7280",
    fontFamily: "system-ui, sans-serif",
  },
};

export default Spinner;