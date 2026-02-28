import { useEffect, useState } from "react";
import type React from "react";
import { useSocket } from "@/hooks/useSocket";

type Status = "connected" | "disconnected" | "reconnecting";

const ConnectionBadge: React.FC = () => {
    const socket = useSocket();
    const [status, setStatus] = useState<Status>(
        socket.connected ? "connected" : "disconnected"
    );

    useEffect(() => {
        const onConnect = () => setStatus("connected");
        const onDisconnect = () => setStatus("disconnected");
        const onReconnect = () => setStatus("reconnecting");

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("reconnect_attempt", onReconnect);
        socket.on("reconnect", onConnect);

        return () => {
            socket.off("connect",           onConnect);
            socket.off("disconnect",        onDisconnect);
            socket.off("reconnect_attempt", onReconnect);
            socket.off("reconnect",         onConnect);
        };
    }, [socket]);

    const config: Record<Status, { color: string; bg: string; label: string }> = {
        connected: { color: "#15803d", bg: "#dcfce7", label: "live" },
        reconnecting: { color: "#92400e", bg: "#fef3c7", label: "Reconnecting..."},
        disconnected: { color: "#991b1b", bg: "#fee2e2", label: "Diconnected" },
    };

    const { color, bg, label } = config[status];

    return (
        <span
            style={{
                fontSize: 12,
                fontWeight: 600,
                color,
                backgroundColor: bg,
                padding: "4px 10px",
                letterSpacing: 0.2,
                fontFamily: "system-ui, sans-serif",
            }}
        >
            {label}
        </span>
    );
};

export default ConnectionBadge;