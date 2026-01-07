import { useEffect, useState, useRef } from "react";
import { useChat } from "@/feature/chat/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useAuth } from "@/auth/auth.context";
import type { ChatWindowProps } from "@/feature/chat/chat.types";

export function ChatWindow({ recipientUsername }: ChatWindowProps) {
  const { messages, isPartnerTyping, sendMessage, sendTypingStatus } = useChat(recipientUsername);
  const { user } = useAuth();
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentUsername = user?.email || "";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isPartnerTyping]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        sendTypingStatus(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputText(newValue);

    if (newValue.trim() === "") {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      sendTypingStatus(false);
      return;
    }

    if (!typingTimeoutRef.current) {
      sendTypingStatus(true);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(false);
      typingTimeoutRef.current = null;
    }, 2000);
  };

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);

      sendTypingStatus(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }

      setInputText("");
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-[380px] border rounded-2xl shadow-2xl bg-card overflow-hidden font-sans border-border/50">
      {/* NAGŁÓWEK */}
      <div className="bg-[#63b38d] p-4 flex items-center gap-3 text-white shadow-sm">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
          {recipientUsername && recipientUsername[0] ? recipientUsername[0].toUpperCase() : "?"}
        </div>
        <span className="font-semibold text-sm truncate">{recipientUsername}</span>
      </div>

      {/* LISTA WIADOMOŚCI */}
      <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50/30 scroll-smooth">
        {messages.map((msg, index) => {
          const isMe = msg.sender === currentUsername;
          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm break-words ${
                  isMe ? "bg-[#63b38d] text-white rounded-br-none" : "bg-white border text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {/* WIZUALNY WSKAŹNIK PISANIA */}
        {isPartnerTyping && (
          <div className="flex justify-start animate-in fade-in slide-in-from-left-2">
            <div className="bg-white border p-2 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
              <span className="text-[10px] text-gray-400 italic">Pisze</span>
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INPUT I PRZYCISK */}
      <div className="p-4 border-t bg-white flex gap-2">
        <Input
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Napisz wiadomość..."
          className="h-10 rounded-xl bg-gray-100/50 border-none focus-visible:ring-1 focus-visible:ring-[#63b38d]"
        />
        <Button
          onClick={handleSend}
          disabled={!inputText.trim()}
          className="bg-[#63b38d] hover:bg-[#52a27c] rounded-xl w-10 h-10 shrink-0 shadow-lg shadow-[#63b38d]/20 transition-all"
        >
          <Send className="h-4 w-4 text-white" />
        </Button>
      </div>
    </div>
  );
}
