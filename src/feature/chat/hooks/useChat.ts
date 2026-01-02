import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import type { ChatMessage } from "@/feature/chat/chat.types";

export const useChat = (recipientUsername: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const stompClient = useRef<Client | null>(null);

  useEffect(() => {
    stompClient.current = new Client({
      brokerURL: "ws://localhost:8080/ws",

      onConnect: () => {
        console.log("Połączono przez Native WebSocket!");
        stompClient.current?.subscribe("/user/queue/messages", (message) => {
          const receivedMsg: ChatMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, receivedMsg]);
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
  }, [recipientUsername]);

  const sendMessage = (content: string) => {
    if (stompClient.current?.connected) {
      stompClient.current.publish({
        destination: `/app/chat.sendMessage.private/${recipientUsername}`,
        body: JSON.stringify({ content }),
      });
    }
  };

  return { messages, sendMessage };
};
