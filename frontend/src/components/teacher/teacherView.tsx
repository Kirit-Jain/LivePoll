import { useState } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "@/hooks/useSocket";
import { usePollState } from "@/hooks/usePollState";
import { ConnectionBadge } from "@/components/shared";
import type { RootState } from "@/store/store";

import { CreatePollForm } from "./CreatePollForm";
import { LiveResultsChart } from "./LiveResultsChart";
import { PollHistoryView } from "./PollHistoryView";
import { styles } from "./styles";

export const TeacherView = () => {
  const socket = useSocket();
  usePollState(socket, "teacher");

  const poll = useSelector((s: RootState) => s.poll.currentPoll);
  const [tab, setTab] = useState<"create" | "history">("create");

  const showResults = poll !== null;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <span style={styles.logo}>📊 Intervieo Teacher</span>
        <ConnectionBadge />
      </header>

      <main style={styles.main}>
        {showResults ? (
          <LiveResultsChart />
        ) : (
          <>
            <div style={styles.tabs}>
              <button 
                onClick={() => setTab("create")} 
                style={{ ...styles.tab, ...(tab === "create" ? styles.tabActive : {}) }}
              >
                New Poll
              </button>
              <button 
                onClick={() => setTab("history")} 
                style={{ ...styles.tab, ...(tab === "history" ? styles.tabActive : {}) }}
              >
                History
              </button>
            </div>
            {tab === "create" ? <CreatePollForm /> : <PollHistoryView />}
          </>
        )}
      </main>
    </div>
  );
};

export default TeacherView;