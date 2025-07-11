"use client";
import { useEffect, useRef } from "react";

export function useTelegramSocket(enabled: boolean) {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const sessionId = localStorage.getItem("session_id");
    const senderId = localStorage.getItem("sender_id");
    if (!sessionId) {
      console.warn("No session_id found in localStorage.");
      return;
    }

    const wsUrl = `ws://localhost:8000/tele/ws/from-telegram/${sessionId}`;
    console.log("🔌 Connecting to WebSocket:", wsUrl);

    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log("✅ WebSocket connected.");
      const initPayload = {
        type: "init",
        sender_id: senderId,
        session_id: sessionId,
      };
      socketRef.current?.send(JSON.stringify(initPayload));
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(`📡 WebSocket message: ${data.type}`, data);
      } catch (err) {
        console.error("⚠️ Failed to parse message:", event.data);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    socketRef.current.onclose = (event) => {
      console.warn(`🔌 WebSocket closed. Reason: ${event.reason || "unknown"}`);
      reconnectTimeout.current = setTimeout(() => {
        console.log("🔁 Reconnecting...");
        window.location.reload(); // or call connect again
      }, 2000);
    };

    return () => {
      socketRef.current?.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [enabled]);
}
