import { Spinner } from "@/components/shared";
import { styles } from "./styles";

export const WaitingScreen = () => (
  <div style={styles.waitingCard}>
    <div style={styles.waitingIcon}>📋</div>
    <h3 style={styles.waitingTitle}>Waiting for a Poll</h3>
    <p style={styles.waitingSubtitle}>Your teacher will start a question soon.</p>
    <Spinner message="Stay on this page" />
  </div>
);