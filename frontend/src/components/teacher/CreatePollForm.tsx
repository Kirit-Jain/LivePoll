import { useState } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "@/hooks/useSocket";
import { api } from "@/service/api";
import { styles } from "./styles";
import type { RootState } from "@/store/store";
import type { IPoll } from "@/types/poll.types";

export const CreatePollForm = () => {
  const socket = useSocket();
  
  // State selectors
  const canCreate = useSelector((s: RootState) => s.poll.canCreatePoll);
  const createReason = useSelector((s: RootState) => s.poll.canCreateReason);
  const votedCount = useSelector((s: RootState) => s.poll.votedCount);
  const totalStudents = useSelector((s: RootState) => s.poll.totalStudents);
  const poll = useSelector((s: RootState) => s.poll.currentPoll); 

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [duration, setDuration] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addOption = () => options.length < 6 && setOptions([...options, ""]);
  const removeOption = (i: number) => options.length > 2 && setOptions(options.filter((_, idx) => idx !== i));
  const updateOption = (i: number, val: string) => setOptions(options.map((o, idx) => (idx === i ? val : o)));

  const handleSubmit = async () => {
    if (!canCreate) return;
    
    const trimmedQ = question.trim();
    const trimmedO = options
      .map((o) => o.trim())
      .filter(Boolean)
      .map(text => ({ text, isCorrect: false }));

    if (!trimmedQ || trimmedO.length < 2) { 
      setError("Question and 2 options required."); 
      return; 
    }

    setLoading(true);
    try {
      const newPoll = await api.createPoll({ question: trimmedQ, options: trimmedO, duration }) as IPoll;
      socket.emit("START_POLL", { pollId: newPoll._id });
      setQuestion(""); setOptions(["", ""]); setDuration(60);
      setError("");
    } catch (err) { 
      setError(err.message || "Failed."); 
    } finally { 
      setLoading(false); 
    }
  };

  const isBlockingActive = poll?.status === "active" && !canCreate && createReason === "WAITING_FOR_STUDENTS";

  if (isBlockingActive) {
    return (
      <div style={styles.formCard}>
        <div style={styles.blockedBanner}>
          <span>⏳</span>
          <div>
            <p style={{ fontWeight: 700 }}>Waiting for students...</p>
            <p style={{ fontSize: 13 }}>{votedCount} of {totalStudents} answered.</p>
          </div>
        </div>
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${(votedCount / (totalStudents || 1)) * 100}%` }} />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.formCard}>
      <h2 style={styles.cardTitle}>Create a Poll</h2>
      <label style={styles.label}>Question</label>
      <textarea style={styles.textarea} value={question} onChange={(e) => setQuestion(e.target.value)} rows={3} placeholder="Ask something..." />
      
      <label style={styles.label}>Options</label>
      {options.map((opt, i) => (
        <div key={i} style={styles.optionRow}>
          <input style={styles.optionInput} value={opt} onChange={(e) => updateOption(i, e.target.value)} placeholder={`Option ${i+1}`} />
          {options.length > 2 && <button style={styles.removeBtn} onClick={() => removeOption(i)}>✕</button>}
        </div>
      ))}
      
      <button style={styles.addOptionBtn} onClick={addOption}>+ Add Option</button>
      
      <label style={styles.label}>Timer: {duration}s</label>
      <input type="range" min={10} max={300} step={5} value={duration} onChange={(e) => setDuration(Number(e.target.value))} style={{ width: "100%" }} />
      
      {error && <p style={styles.errorText}>{error}</p>}
      
      <button style={{ ...styles.primaryButton, opacity: (loading || !canCreate) ? 0.6 : 1 }} onClick={handleSubmit} disabled={loading || !canCreate}>
        {loading ? "Starting..." : "Launch Poll →"}
      </button>
    </div>
  );
};