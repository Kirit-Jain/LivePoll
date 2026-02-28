import { useState } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "@/hooks/useSocket";
import { usePollState } from "@/hooks/usePollState";
import { getOrCreateStudentId, getStudentName } from "@/utils/identity";
import { ConnectionBadge } from "@/components/shared";
import type { RootState } from "@/store/store";

import { NameEntry } from "./NameEntry";
import { QuestionCard } from "./QuestionCard";
import { VotingOptions } from "./VotingOptions";
import { ResultsView } from "./resultsView";
import { WaitingScreen } from "./WaitingScreen";
import { styles } from "./styles";

export const StudentView = () => {
  const socket = useSocket();
  const studentId = getOrCreateStudentId();
  
  usePollState(socket, studentId);

  const poll = useSelector((s: RootState) => s.poll.currentPoll);
  const hasVoted = useSelector((s: RootState) => s.poll.hasVoted);
  const [joined, setJoined] = useState(!!getStudentName());

  if (!joined) return <NameEntry onJoined={() => setJoined(true)} />;

  const isActive = poll?.status === "active";
  const isClosed = poll?.status === "closed";
  const noPoll = !poll;

  const showQuestion = isActive && !hasVoted;
  const showResults = (isActive && hasVoted) || isClosed;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <span style={styles.logo}>📊 Live Poll</span>
        <div style={styles.headerRight}>
          <ConnectionBadge />
          <span style={styles.studentBadge}>{getStudentName()}</span>
        </div>
      </header>

      <main style={styles.main}>
        {noPoll && <WaitingScreen />}

        {showQuestion && (
          <>
            <QuestionCard />
            <VotingOptions />
          </>
        )}

        {isActive && hasVoted && <QuestionCard />}
        {showResults && <ResultsView />}
      </main>
    </div>
  );
};

export default StudentView;