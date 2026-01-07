import { useEffect, useState, useRef } from "react";
import { useChat } from "@/feature/chat/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CheckCheck, Check, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/auth/auth.context";
import type { ChatWindowProps } from "@/feature/chat/chat.types";

export function ChatWindow({ recipientUsername }: ChatWindowProps) {
  const { messages, isPartnerTyping, sendMessage, sendTypingStatus } = useChat(recipientUsername);
  const { user } = useAuth();
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // KLUCZOWA POPRAWKA: Sprawdź co dokładnie masz w user.name i w msg.sender
  // Jeśli backend wysyła Name, użyj user?.name. Jeśli Email, użyj user?.email.
  const currentId = user?.email;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isPartnerTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    // Wysyłanie statusu "ja piszę"
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
      setInputText("");
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-[380px] border rounded-2xl shadow-2xl bg-card overflow-hidden border-border/50">
      <div className="bg-primary/95 backdrop-blur-sm p-4 flex items-center justify-between text-white shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center font-bold text-xs">
            {recipientUsername[0].toUpperCase()}
          </div>
          <span className="font-semibold text-sm truncate">{recipientUsername}</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      </div>

      <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-muted/10 scroll-smooth">
        {messages.map((msg, index) => {
          // Jeśli wiadomość nadal jest po złej stronie, zrób: console.log(msg.sender, currentId)
          const isMe = msg.sender === currentId;

          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm relative ${
                  isMe
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-background border text-foreground rounded-bl-none"
                }`}
              >
                <p className="break-words">{msg.content}</p>
                <div className="flex items-center justify-end gap-1 mt-1 opacity-70 text-[10px]">
                  {msg.timestamp &&
                    new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  {isMe &&
                    (msg.isRead ? <CheckCheck className="h-3 w-3 text-blue-300" /> : <Check className="h-3 w-3" />)}
                </div>
              </div>
            </div>
          );
        })}

        {/* Wskaźnik pisania partnera */}
        {isPartnerTyping && (
          <div className="flex justify-start animate-in fade-in">
            <div className="bg-background border p-2 rounded-2xl rounded-bl-none shadow-sm">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground animate-bounce" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-background/80 flex gap-2 items-center">
        <Input
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Napisz wiadomość..."
          className="bg-muted/50 border-none h-10 rounded-xl"
        />
        <Button size="icon" onClick={handleSend} disabled={!inputText.trim()} className="rounded-xl h-10 w-10 shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
