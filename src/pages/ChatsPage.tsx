import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import { User, MessageSquareOff, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/auth/auth.context";
import { ChatWindow } from "@/feature/chat/components/ChatWindow";
import type { ChatSummary, ChatMessage } from "@/feature/chat/chat.types";

export default function ChatsPage() {
  const [summaries, setSummaries] = useState<ChatSummary[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  // Ref do trzymania instancji klienta WS
  const stompClientRef = useRef<Client | null>(null);

  const selectedRecipientRef = useRef<string | null>(null);

  useEffect(() => {
    selectedRecipientRef.current = selectedRecipient;
  }, [selectedRecipient]);

  const fetchSummaries = useCallback(async () => {
    try {
      const response = await axios.get<ChatSummary[]>(`${import.meta.env.VITE_API_URL}/chats/inbox`, {
        withCredentials: true,
      });
      setSummaries(response.data);
    } catch (err) {
      console.error("Błąd podczas pobierania listy czatów:", err);
    }
  }, []);

  useEffect(() => {
    const initializeChat = async () => {
      await fetchSummaries();
    };

    void initializeChat();
  }, [fetchSummaries]);
  const handleIncomingMessage = useCallback(
    (newMsg: ChatMessage) => {
      const myEmail = user?.email;
      if (!myEmail) return;

      const partnerEmail = newMsg.sender === myEmail ? newMsg.recipient : newMsg.sender;

      setSummaries((prevSummaries) => {
        const existingIndex = prevSummaries.findIndex((s) => s.partnerEmail === partnerEmail);

        if (existingIndex === -1) {
          void fetchSummaries();
          return prevSummaries;
        }

        const updatedSummaries = [...prevSummaries];
        const chatToUpdate = { ...updatedSummaries[existingIndex] };

        chatToUpdate.lastMessage = newMsg.content;
        chatToUpdate.lastMessageTimestamp = newMsg.timestamp;

        if (newMsg.sender !== myEmail && selectedRecipientRef.current !== partnerEmail) {
          chatToUpdate.unreadCount += 1;
        }

        updatedSummaries.splice(existingIndex, 1);
        return [chatToUpdate, ...updatedSummaries];
      });
    },
    [fetchSummaries, user?.email],
  );

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL;
    if (!wsUrl) return;

    const client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe("/user/queue/messages", (message) => {
          const body: ChatMessage = JSON.parse(message.body);
          handleIncomingMessage(body);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [handleIncomingMessage]);

  const handleSelectChat = async (partnerEmail: string) => {
    setSelectedRecipient(partnerEmail);

    setSummaries((prev) => prev.map((s) => (s.partnerEmail === partnerEmail ? { ...s, unreadCount: 0 } : s)));

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/chats/read-all/${partnerEmail}`,
        {},
        { withCredentials: true },
      );
    } catch (err) {
      console.error("Nie udało się oznaczyć jako przeczytane:", err);
    }
  };

  const filteredSummaries = summaries.filter(
    (s) =>
      s.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.partnerEmail.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="container mx-auto py-6 px-4 h-[calc(100vh-100px)]">
      <div className="flex bg-card border rounded-2xl shadow-xl overflow-hidden h-full border-border/50">
        {/* SIDEBAR - Lista czatów */}
        <aside className="w-full md:w-[350px] border-r flex flex-col bg-gray-50/10">
          <div className="p-4 border-b space-y-4 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Wiadomości
              </h2>
              <div className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Online</div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj rozmowy..."
                className="pl-9 bg-background/50 border-none shadow-sm focus-visible:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto">
            {filteredSummaries.length > 0 ? (
              filteredSummaries.map((chat) => (
                <button
                  key={chat.partnerEmail}
                  onClick={() => void handleSelectChat(chat.partnerEmail)}
                  className={cn(
                    "w-full p-4 flex items-center gap-3 transition-all border-b border-border/30 hover:bg-muted/50",
                    selectedRecipient === chat.partnerEmail && "bg-primary/10 border-l-4 border-l-primary",
                  )}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0 text-lg">
                    {chat.partnerName[0]?.toUpperCase() ?? "?"}
                  </div>

                  <div className="flex-grow text-left overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm truncate text-gray-800">{chat.partnerName}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(chat.lastMessageTimestamp).toDateString() === new Date().toDateString()
                          ? new Date(chat.lastMessageTimestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : new Date(chat.lastMessageTimestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-xs truncate max-w-[180px]",
                        chat.unreadCount > 0 ? "font-bold text-gray-900" : "text-muted-foreground",
                      )}
                    >
                      {chat.lastMessage || "Brak wiadomości"}
                    </p>
                  </div>

                  {chat.unreadCount > 0 && (
                    <div className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm animate-in zoom-in">
                      {chat.unreadCount}
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6 opacity-60">
                <MessageSquareOff className="h-10 w-10 mb-2" />
                <p className="text-sm">Brak aktywnych czatów</p>
              </div>
            )}
          </div>
        </aside>

        {/* GŁÓWNY PANEL */}
        <main className="hidden md:flex flex-grow flex-col bg-white overflow-hidden relative">
          {selectedRecipient ? (
            <div className="w-full h-full">
              <ChatWindow recipientUsername={selectedRecipient} />
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-muted-foreground space-y-4 bg-gray-50/30">
              <div className="bg-white p-6 rounded-full shadow-sm border border-dashed">
                <Search className="h-12 w-12 opacity-20 text-[#63b38d]" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700">Wybierz konwersację</h3>
                <p className="text-sm text-gray-500">Kliknij osobę z listy po lewej, aby pisać.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
