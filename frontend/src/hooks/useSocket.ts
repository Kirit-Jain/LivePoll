import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

export const useSocket = () : Socket => {
    const [socket] = useState(() => io(SOCKET_URL, {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
    }));

    useEffect(() => {
        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    return socket;
}