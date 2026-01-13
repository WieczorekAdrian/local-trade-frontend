import { useEffect, useState, useRef } from "react";
import { useChat } from "@/feature/chat/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MoreVertical, X } from "lucide-react"; // Dodajemy X
import { useAuth } from "@/auth/auth.context";
import type { ChatWindowProps } from "@/feature/chat/chat.types";
import { cn } from "@/lib/utils";

export function ChatWindow({
  recipientUsername,
  variant = "page", // Domyślnie tryb pełnoekranowy
  onClose,
}: ChatWindowProps) {
  const { messages, isPartnerTyping, sendMessage, sendTypingStatus } = useChat(recipientUsername);
  const { user } = useAuth();
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentUsername = user?.email || "";
  const isBubble = variant === "bubble";

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
  }, [sendTypingStatus]);

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
    <div
      className={cn(
        "flex flex-col bg-white font-sans overflow-hidden transition-all",
        // LOGIKA WARIANTU:
        isBubble
          ? "w-[360px] h-[500px] border rounded-xl shadow-2xl absolute right-0 bottom-0 z-50" // Styl dymka
          : "w-full h-full", // Styl strony
      )}
    >
      {/* NAGŁÓWEK */}
      <div
        className={cn(
          "flex items-center justify-between px-4 bg-white shrink-0 sticky top-0 z-10 border-b",
          isBubble ? "h-14" : "h-16 px-6",
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "rounded-full bg-gradient-to-tr from-[#63b38d] to-[#4a9c76] flex items-center justify-center text-white font-bold shadow-sm",
              isBubble ? "w-8 h-8 text-sm" : "w-10 h-10 text-lg",
            )}
          >
            {recipientUsername && recipientUsername[0] ? recipientUsername[0].toUpperCase() : "?"}
          </div>
          <div>
            <h3 className={cn("font-bold text-gray-800", isBubble ? "text-sm" : "text-base")}>{recipientUsername}</h3>
            {isPartnerTyping ? (
              <span className="text-[10px] text-[#63b38d] font-medium animate-pulse block leading-none">Pisze...</span>
            ) : (
              // W trybie bubble oszczędzamy miejsce, w page dajemy "Dostępny"
              !isBubble && <span className="text-xs text-gray-400">Dostępny</span>
            )}
          </div>
        </div>

        {/* PRZYCISKI NAGŁÓWKA */}
        {isBubble ? (
          // W trybie Bubble pokazujemy KRZYŻYK
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        ) : (
          // W trybie Page pokazujemy OPCJE
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* LISTA WIADOMOŚCI */}
      <div
        ref={scrollRef}
        className={cn("flex-1 overflow-y-auto bg-[#Fdfdfd] scroll-smooth", isBubble ? "p-3" : "p-6")}
      >
        {messages.map((msg, index) => {
          const isMe = msg.sender === currentUsername;
          const isSequence = index > 0 && messages[index - 1].sender === msg.sender;
          const isLastInSequence = index === messages.length - 1 || messages[index + 1].sender !== msg.sender;

          return (
            <div
              key={index}
              className={cn(
                "flex w-full animate-in fade-in slide-in-from-bottom-1 duration-200",
                isMe ? "justify-end" : "justify-start",
                isLastInSequence ? "mb-3" : "mb-1", // Mniejszy odstęp w dymku
              )}
            >
              <div
                className={cn(
                  "px-3 py-2 text-[14px] leading-relaxed break-words shadow-sm relative group transition-all",
                  isBubble ? "max-w-[85%]" : "max-w-[70%]", // W dymku wiadomości mogą być szersze
                  isMe
                    ? "bg-[#63b38d] text-white rounded-2xl"
                    : "bg-white border border-gray-100 text-gray-800 rounded-2xl",

                  isSequence && isMe && "rounded-tr-sm",
                  isSequence && !isMe && "rounded-tl-sm",
                  !isLastInSequence && isMe && "rounded-br-sm",
                  !isLastInSequence && !isMe && "rounded-bl-sm",
                  isLastInSequence && isMe && "rounded-br-2xl",
                  isLastInSequence && !isMe && "rounded-bl-2xl",
                )}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {isPartnerTyping && (
          <div className="flex justify-start mb-2 animate-in fade-in zoom-in duration-300">
            <div className="bg-white border px-3 py-2 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className={cn("bg-white border-t shrink-0", isBubble ? "p-3" : "p-4")}>
        <div className="flex items-center gap-2 bg-gray-50/50 p-1 rounded-3xl border border-gray-200 focus-within:border-[#63b38d] focus-within:ring-1 focus-within:ring-[#63b38d]/30 transition-all shadow-sm">
          <Input
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={isBubble ? "Napisz..." : "Napisz wiadomość..."}
            className={cn(
              "flex-1 bg-transparent border-none focus-visible:ring-0 placeholder:text-gray-400 text-gray-700 px-3",
              isBubble ? "h-8 text-sm" : "h-10",
            )}
          />
          <Button
            onClick={handleSend}
            disabled={!inputText.trim()}
            size="icon"
            className={cn(
              "rounded-full transition-all duration-200 shrink-0",
              inputText.trim()
                ? "bg-[#63b38d] hover:bg-[#52a27c] text-white shadow-md shadow-green-200"
                : "bg-gray-200 text-gray-400 cursor-not-allowed",
              isBubble ? "w-8 h-8" : "w-10 h-10",
            )}
          >
            <Send className={cn("ml-0.5", isBubble ? "h-3 w-3" : "h-4 w-4")} />
          </Button>
        </div>
      </div>
    </div>
  );
}
