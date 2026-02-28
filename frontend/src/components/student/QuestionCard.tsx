import { useSelector } from "react-redux";
import { usePollTimer } from "@/hooks/usePollTimer";
import { TimerBar } from "@/components/shared";
import { styles } from "./styles";
import type { RootState } from "@/store/store";

export const QuestionCard = () => {
  const poll = useSelector((s: RootState) => s.poll.currentPoll);
  const endsAt = useSelector((s: RootState) => s.poll.endsAt);
  const remaining = usePollTimer(endsAt);
  
  if (!poll) return null;
  
  return (
    <div style={styles.questionCard}>
      <TimerBar remaining={remaining} duration={poll.duration} />
      <h3 style={styles.question}>{poll.question}</h3>
    </div>
  );
};