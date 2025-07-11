'use client';
import { useEffect, useRef } from 'react';

interface TelegramSocketOptions {
  onLoginSuccess?: (sessionId: string) => void;
}

export function useTelegramSocket(enabled: boolean, options?: TelegramSocketOptions) {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const sessionId = localStorage.getItem('session_id');
    const senderId = localStorage.getItem('sender_id');
    if (!sessionId) return;

    const wsUrl = `ws://localhost:8000/tele/ws/from-telegram/${sessionId}`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      const initPayload = {
        type: 'init',
        sender_id: senderId,
        session_id: sessionId,
      };
      socketRef.current?.send(JSON.stringify(initPayload));
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(`📡 WebSocket message: ${data.type}`, data);

        if (data.type === 'login_success' && data.is_logged_in) {
          localStorage.setItem('is_logged_in', 'true');
          localStorage.setItem('session_id', data.session_id);
          options?.onLoginSuccess?.(data.session_id);
        }
      } catch (err) {
        console.error('Failed to parse socket message:', event.data);
      }
    };

    socketRef.current.onclose = () => {
      reconnectTimeout.current = setTimeout(() => {
        window.location.reload(); // optional auto reconnect
      }, 2000);
    };

    return () => {
      socketRef.current?.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [enabled]);
}
