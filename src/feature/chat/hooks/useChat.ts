import { useEffect, useState, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import type { ChatMessage } from "@/feature/chat/chat.types";

export const useChat = (recipientUsername: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const stompClient = useRef<Client | null>(null);

  const markAsRead = useCallback(async () => {
    if (!recipientUsername) return;
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/chats/read-all/${recipientUsername}`,
        {},
        { withCredentials: true },
      );
    } catch (err) {
      console.error(err);
    }
  }, [recipientUsername]);

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/chats/history/${recipientUsername}`, {
          withCredentials: true,
        });
        if (isMounted) {
          setMessages(response.data);
          await markAsRead();
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (recipientUsername) {
      fetchHistory();
    }

    return () => {
      isMounted = false;
      setMessages([]);
      setIsPartnerTyping(false);
    };
  }, [recipientUsername, markAsRead]);

  useEffect(() => {
    if (!recipientUsername) return;

    let isActive = true;

    const connectWebSocket = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/ws-ticket`, {
          withCredentials: true,
        });

        const ticket = response.data.ticket;

        if (!isActive) return;

        if (stompClient.current) {
          stompClient.current.deactivate();
        }

        const client = new Client({
          brokerURL: import.meta.env.VITE_WS_URL,
          reconnectDelay: 5000,
          connectHeaders: {
            "ws-ticket": ticket,
          },
          onConnect: () => {
            client.subscribe("/user/queue/messages", (message) => {
              const receivedMsg: ChatMessage = JSON.parse(message.body);
              setMessages((prev) => {
                const exists = prev.some(
                  (m) => m.content === receivedMsg.content && m.timestamp === receivedMsg.timestamp,
                );
                return exists ? prev : [...prev, receivedMsg];
              });
              markAsRead();
            });

            // Subskrypcja statusu pisania
            client.subscribe("/user/queue/typing", (message) => {
              const data = JSON.parse(message.body);
              const typingStatus = data.isTyping !== undefined ? data.isTyping : data.typing;
              const sender = (data.sender || "").toString().toLowerCase().trim();
              const currentRecipient = recipientUsername.toString().toLowerCase().trim();

              if (sender === currentRecipient) {
                setIsPartnerTyping(!!typingStatus);
              }
            });
          },
        });

        client.activate();
        stompClient.current = client;
      } catch (error) {
        console.error("Nie udało się pobrać biletu lub połączyć z WebSocketem:", error);
      }
    };

    connectWebSocket();

    return () => {
      isActive = false;
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
      setIsPartnerTyping(false);
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

  const sendTypingStatus = (isTyping: boolean) => {
    if (stompClient.current?.connected) {
      stompClient.current.publish({
        destination: `/app/chat.typing/${recipientUsername}`,
        body: JSON.stringify({ isTyping }),
      });
    }
  };

  return { messages, isPartnerTyping, sendMessage, sendTypingStatus };
};
