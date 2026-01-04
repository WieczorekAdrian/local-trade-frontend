import { useEffect, useState, useRef } from "react";
import { useChat } from "@/feature/chat/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CheckCheck, Check } from "lucide-react";
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
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText("");
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-[380px] border rounded-2xl shadow-2xl bg-card overflow-hidden border-border/50 antialiased">
      <div className="bg-primary/95 backdrop-blur-sm p-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground font-bold text-xs">
            {recipientUsername[0].toUpperCase()}
          </div>
          <span className="text-primary-foreground font-semibold text-sm truncate">{recipientUsername}</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" title="Online" />
      </div>

      <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-muted/10 scroll-smooth">
        {messages.map((msg, index) => {
          const isMe = msg.sender === currentUsername;

          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm relative ${
                  isMe
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-background border border-border/50 rounded-bl-none text-foreground"
                }`}
              >
                <p className="leading-relaxed break-words">{msg.content}</p>

                <div className={`flex items-center justify-end gap-1 mt-1 opacity-70`}>
                  <span className="text-[10px]">
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : ""}
                  </span>

                  {isMe && (
                    <span className="text-primary-foreground/80">
                      {msg.isRead ? <CheckCheck className="h-3 w-3 text-blue-300" /> : <Check className="h-3 w-3" />}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-40 space-y-2">
            <div className="p-3 bg-muted rounded-full">
              <Send className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-xs font-medium">Brak wiadomości. Rozpocznij konwersację!</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-background/80 backdrop-blur-md flex gap-2 items-center">
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Napisz wiadomość..."
          className="bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 h-10 rounded-xl"
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!inputText.trim()}
          className="rounded-xl shrink-0 h-10 w-10 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
