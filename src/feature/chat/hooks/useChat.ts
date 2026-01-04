import { useEffect, useState, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import type { ChatMessage } from "@/feature/chat/chat.types";

export const useChat = (recipientUsername: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const stompClient = useRef<Client | null>(null);

  const markAsRead = useCallback(async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/chats/read-all/${recipientUsername}`,
        {},
        { withCredentials: true },
      );
    } catch (err) {
      console.error("Błąd przy oznaczaniu jako przeczytane:", err);
    }
  }, [recipientUsername]); // Funkcja zależy od odbiorcy

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/chats/history/${recipientUsername}`, {
          withCredentials: true,
        });
        setMessages(response.data);

        await markAsRead();
      } catch (err) {
        console.error("Nie udało się pobrać historii:", err);
      }
    };

    fetchHistory();

    stompClient.current = new Client({
      brokerURL: import.meta.env.VITE_WS_URL,
      onConnect: () => {
        console.log("Połączono przez Native WebSocket!");
        stompClient.current?.subscribe("/user/queue/messages", (message) => {
          const receivedMsg: ChatMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, receivedMsg]);

          markAsRead();
        });
      },
      onStompError: (frame) => {
        console.error("Błąd STOMP:", frame.headers["message"]);
      },
    });

    stompClient.current.activate();

    return () => {
      stompClient.current?.deactivate();
    };
  }, [recipientUsername, markAsRead]);

  const sendMessage = (content: string) => {
    if (stompClient.current?.connected && content.trim()) {
      stompClient.current.publish({
        destination: `/app/chat.sendMessage.private/${recipientUsername}`,
        body: JSON.stringify({ content }),
      });
    }
  };

  return { messages, sendMessage };
};
