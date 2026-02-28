import { useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { getOrCreateStudentId, setStudentName } from "@/utils/identity";
import { styles } from "./styles";

export const NameEntry = ({ onJoined }: { onJoined: () => void }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const socket = useSocket();

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) { setError("Please enter your name."); return; }
    if (trimmed.length < 2) { setError("Name must be at least 2 characters."); return; }
    
    const studentId = getOrCreateStudentId();
    setStudentName(trimmed);
    socket.emit("STUDENT_JOIN", { studentId, studentName: trimmed });
    onJoined();
  };

  return (
    <div style={styles.centered}>
      <div style={styles.card}>
        <h2 style={styles.title}>Join Session</h2>
        <p style={styles.subtitle}>Enter your name to participate in live polls.</p>
        <input
          style={{ ...styles.input, borderColor: error ? "#ef4444" : "#d1d5db" }}
          type="text"
          placeholder="Your name"
          value={name}
          maxLength={40}
          onChange={(e) => { setName(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          autoFocus
        />
        {error && <p style={styles.errorText}>{error}</p>}
        <button style={styles.primaryButton} onClick={handleSubmit}>Join →</button>
      </div>
    </div>
  );
};