import type React from 'react';

export const styles: Record<string, React.CSSProperties> = {
  page: { 
    minHeight: "100vh", 
    backgroundColor: "#f8fafc", 
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    color: "#1e293b"
  },
  header: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: "12px 32px", 
    backgroundColor: "rgba(255, 255, 255, 0.8)", 
    backdropFilter: "blur(8px)", 
    borderBottom: "1px solid #e2e8f0", 
    position: "sticky", 
    top: 0, 
    zIndex: 50,
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
  },
  logo: { 
    fontSize: "1.25rem", 
    fontWeight: 800, 
    color: "#0f172a",
    letterSpacing: "-0.025em"
  },
  headerRight: { 
    display: "flex", 
    alignItems: "center", 
    gap: 12 
  },
  main: { 
    maxWidth: 800, 
    margin: "48px auto", 
    padding: "0 24px" 
  },
  

  tabs: { 
    display: "inline-flex", 
    gap: 4, 
    marginBottom: 32, 
    backgroundColor: "#f1f5f9", 
    padding: 6, 
    borderRadius: 12,
    border: "1px solid #e2e8f0"
  },
  tab: { 
    padding: "10px 24px", 
    fontSize: 14, 
    fontWeight: 600, 
    border: "none", 
    borderRadius: 8, 
    cursor: "pointer", 
    backgroundColor: "transparent", 
    color: "#64748b",
    transition: "all 0.2s ease"
  },
  tabActive: { 
    backgroundColor: "#ffffff", 
    color: "#2563eb", 
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" 
  },

  formCard: { 
    backgroundColor: "#ffffff", 
    borderRadius: 20, 
    padding: 40, 
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    border: "1px solid #f1f5f9"
  },
  resultsCard: { 
    backgroundColor: "#ffffff", 
    borderRadius: 20, 
    padding: 40, 
    marginBottom: 32, 
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    border: "1px solid #f1f5f9"
  },
  historyCard: { 
    backgroundColor: "#ffffff", 
    borderRadius: 20, 
    padding: 40, 
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
  },

  cardTitle: { 
    margin: "0 0 20px", 
    fontSize: 24, 
    fontWeight: 800, 
    color: "#0f172a",
    letterSpacing: "-0.025em"
  },
  label: { 
    display: "block", 
    fontSize: 14, 
    fontWeight: 600, 
    color: "#475569", 
    marginBottom: 8, 
    marginTop: 24 
  },

  textarea: { 
    width: "100%", 
    padding: "16px", 
    fontSize: 16, 
    border: "2px solid #e2e8f0", 
    borderRadius: 12, 
    outline: "none", 
    resize: "vertical",
    transition: "border-color 0.2s ease",
    fontFamily: "inherit",
    boxSizing: "border-box"
  },
  optionRow: { 
    display: "flex", 
    gap: 12, 
    marginBottom: 12, 
    alignItems: "center" 
  },
  optionInput: { 
    flex: 1, 
    padding: "12px 16px", 
    fontSize: 15, 
    border: "2px solid #e2e8f0", 
    borderRadius: 12,
    outline: "none",
    transition: "all 0.2s ease"
  },
  removeBtn: { 
    padding: "10px", 
    fontSize: 14, 
    border: "none", 
    backgroundColor: "#fee2e2", 
    color: "#ef4444", 
    borderRadius: 10, 
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  addOptionBtn: { 
    fontSize: 14, 
    fontWeight: 700, 
    color: "#2563eb", 
    backgroundColor: "#eff6ff", 
    border: "2px dashed #bfdbfe", 
    borderRadius: 12, 
    padding: "12px 20px", 
    cursor: "pointer", 
    marginTop: 8,
    width: "100%",
    transition: "all 0.2s ease"
  },
  primaryButton: { 
    width: "100%", 
    marginTop: 32, 
    padding: "16px 0", 
    backgroundColor: "#2563eb", 
    color: "#ffffff", 
    fontSize: 16, 
    fontWeight: 700, 
    border: "none", 
    borderRadius: 14, 
    cursor: "pointer",
    boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
    transition: "transform 0.1s ease, background-color 0.2s ease"
  },

  breakdown: { 
    marginTop: 24, 
    display: "flex", 
    flexDirection: "column", 
    gap: 12,
    paddingTop: 24,
    borderTop: "1px solid #f1f5f9"
  },
  breakdownRow: { 
    display: "flex", 
    alignItems: "center", 
    gap: 12, 
    fontSize: 15,
    backgroundColor: "#f8fafc",
    padding: "12px 16px",
    borderRadius: 12
  },
  breakdownDot: { 
    width: 12, 
    height: 12, 
    borderRadius: 4, 
    flexShrink: 0 
  },
  breakdownLabel: { 
    flex: 1, 
    color: "#1e293b", 
    fontWeight: 500 
  },
  breakdownPct: { 
    fontWeight: 800, 
    color: "#0f172a" 
  },
  breakdownCount: { 
    color: "#94a3b8", 
    fontSize: 13 
  },

  historyItem: { 
    border: "1px solid #e2e8f0", 
    borderRadius: 16, 
    overflow: "hidden",
    transition: "all 0.3s ease",
    backgroundColor: "#ffffff"
  },
  historyHeader: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: "20px 24px", 
    cursor: "pointer", 
    backgroundColor: "#ffffff" 
  },
  historyQuestion: { 
    margin: 0, 
    fontSize: 16, 
    fontWeight: 700, 
    color: "#0f172a" 
  },
  historyMeta: { 
    margin: "6px 0 0", 
    fontSize: 13, color: 
    "#94a3b8" 
  },
  historyBody: { 
    padding: "0 24px 24px", 
    display: "flex", 
    flexDirection: "column", 
    gap: 16 
  },
  historyOptionTop: { 
    display: "flex", 
    justifyContent: "space-between", 
    fontSize: 14, 
    color: "#334155",
    marginBottom: 6
  },
  historyTrack: { 
    width: "100%", 
    height: 8, 
    backgroundColor: "#f1f5f9", 
    borderRadius: 999, 
    overflow: "hidden" 
  }
};