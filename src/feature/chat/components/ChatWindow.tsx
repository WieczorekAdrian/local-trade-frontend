import { useState, useEffect, useRef } from "react";
import { useChat } from "@/feature/chat/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useAuth } from "@/auth/auth.context";
import type { ChatWindowProps } from "@/feature/chat/chat.types";

export function ChatWindow({ recipientUsername }: ChatWindowProps) {
  const { messages, sendMessage } = useChat(recipientUsername);
  const { user } = useAuth();
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentUsername = user?.email || "";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText("");
    }
  };

  return (
    <div className="flex flex-col h-[450px] w-[350px] border rounded-2xl shadow-2xl bg-card overflow-hidden border-border/50">
      {/* Nagłówek okna */}
      <div className="bg-primary p-3 flex items-center justify-between shadow-md">
        <span className="text-primary-foreground font-bold text-sm truncate">Czat z: {recipientUsername}</span>
      </div>

      {/* Lista wiadomości */}
      <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-3 bg-muted/20 scrollbar-thin">
        {messages.map((msg, index) => {
          const isMe = msg.sender === currentUsername;
          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start animate-in fade-in slide-in-from-left-2"}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                  isMe
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-background border rounded-bl-none text-foreground"
                }`}
              >
                <p className="leading-relaxed">{msg.content}</p>
                <span className={`text-[9px] block mt-1 opacity-60 ${isMe ? "text-right" : "text-left"}`}>
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="text-center text-xs text-muted-foreground mt-10 opacity-50">Napisz pierwszą wiadomość...</div>
        )}
      </div>

      {/* Panel wpisywania */}
      <div className="p-3 border-t bg-background flex gap-2 items-center">
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Napisz wiadomość..."
          className="bg-muted/50 border-none focus-visible:ring-1"
        />
        <Button size="icon" onClick={handleSend} disabled={!inputText.trim()} className="rounded-full shrink-0 h-9 w-9">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
