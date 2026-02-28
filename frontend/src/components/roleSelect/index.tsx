import { ConnectionBadge } from "@/components/shared";
import type { UserRole } from "@/types/poll.types";
import { styles } from "./styles";

interface RoleSelectProps {
  onSelect: (role: UserRole) => void;
}

export const RoleSelect = ({ onSelect }: RoleSelectProps) => (
  <div style={styles.centered}>
    <div style={styles.card}>
      <div style={styles.logoRow}>
        <div>
          <h1 style={styles.appName}>Intervieo</h1>
          <p style={styles.tagline}>Real-time questions. Instant answers.</p>
        </div>
      </div>

      <div style={styles.divider} />

      <p style={styles.prompt}>Join as</p>

      <div style={styles.roleGrid}>
        <button style={styles.roleCard} onClick={() => onSelect("teacher")}>
          <span style={styles.roleLabel}>Teacher</span>
          <span style={styles.roleHint}>Create & manage polls</span>
        </button>
        <button style={styles.roleCard} onClick={() => onSelect("student")}>
          <span style={styles.roleLabel}>Student</span>
          <span style={styles.roleHint}>Answer live questions</span>
        </button>
      </div>

      <div style={styles.badgeRow}>
        <ConnectionBadge />
      </div>
    </div>
  </div>
);