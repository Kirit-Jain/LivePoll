import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "@/hooks/useSocket";
import { usePollTimer } from "@/hooks/usePollTimer";
import { setHasVoted } from "@/store/slices/pollslices";
import { getOrCreateStudentId, getStudentName } from "@/utils/identity";
import { styles } from "./styles";
import type { RootState } from "@/store/store";

export const VotingOptions = () => {
  const dispatch = useDispatch();
  const poll = useSelector((s: RootState) => s.poll.currentPoll);
  const hasVoted = useSelector((s: RootState) => s.poll.hasVoted);
  const endsAt = useSelector((s: RootState) => s.poll.endsAt);
  const remaining = usePollTimer(endsAt);
  const socket = useSocket();

  const [selected, setSelected] = useState<string | null>(null);
  const [voteError, setVoteError] = useState("");

  if (!poll || poll.status !== "active") return null;

  const isDisabled = hasVoted || remaining === 0;

  const handleVote = (optionId: string) => {
    if (isDisabled) return;
    const studentId = getOrCreateStudentId();
    const studentName = getStudentName() ?? "Anonymous";
    
    setSelected(optionId);
    socket.emit("VOTE_SUBMIT", { pollId: poll._id, optionId, studentId, studentName });
    dispatch(setHasVoted(true));

    socket.once("ERROR", ({ message }: { message: string }) => {
      setVoteError(message);
      setSelected(null);
      dispatch(setHasVoted(false));
    });
  };

  return (
    <div style={styles.optionsGrid}>
      {voteError && <p style={styles.errorText}>{voteError}</p>}
      {poll.options.map((opt) => {
        const isChosen = selected === opt._id;
        return (
          <button
            key={opt._id}
            onClick={() => handleVote(opt._id)}
            disabled={isDisabled}
            style={{
              ...styles.optionButton,
              ...(isChosen ? styles.optionSelected : {}),
              ...(isDisabled && !isChosen ? styles.optionDisabled : {}),
            }}
          >
            {isChosen && <span style={{ marginRight: 8 }}>✓</span>}
            {opt.text}
          </button>
        );
      })}
    </div>
  );
};