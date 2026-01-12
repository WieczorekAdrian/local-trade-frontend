import { useState, useEffect } from "react";
import axios from "axios";
import { ChatWindow } from "@/feature/chat/components/ChatWindow";
import { useAuth } from "@/auth/auth.context"; //
import { User, MessageSquareOff, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChatSummary {
  recipientUsername: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export default function ChatsPage() {
  const [summaries, setSummaries] = useState<ChatSummary[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth(); //

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/chats/summary`, {
          withCredentials: true,
        });
        setSummaries(response.data);
      } catch (err) {
        console.error("Błąd podczas pobierania listy czatów:", err);
      }
    };

    void fetchSummaries();
  }, []);

  const filteredSummaries = summaries.filter(
    (s) => s.recipientUsername.toLowerCase().includes(searchQuery.toLowerCase()) && s.recipientUsername !== user?.email, //
  );

  return (
    <div className="container mx-auto py-6 px-4 h-[calc(100vh-100px)]">
      <div className="flex bg-card border rounded-2xl shadow-xl overflow-hidden h-full border-border/50">
        {/* SIDEBAR */}
        <aside className="w-full md:w-[350px] border-r flex flex-col bg-gray-50/10">
          <div className="p-4 border-b space-y-4 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Wiadomości
              </h2>
              {/* UŻYCIE USER: Wyświetlamy status użytkownika */}
              <div className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                Aktywny jako: {user?.email?.split("@")[0]}
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj rozmówcy..."
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
                  key={chat.recipientUsername}
                  onClick={() => setSelectedRecipient(chat.recipientUsername)}
                  className={cn(
                    "w-full p-4 flex items-center gap-3 transition-all border-b border-border/30 hover:bg-muted/50",
                    selectedRecipient === chat.recipientUsername && "bg-primary/10 border-l-4 border-l-primary",
                  )}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                    {chat.recipientUsername[0].toUpperCase()}
                  </div>
                  <div className="flex-grow text-left overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm truncate">{chat.recipientUsername}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(chat.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate italic">
                      {chat.lastMessage || "Kliknij, aby zacząć rozmowę"}
                    </p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
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
        <main className="hidden md:flex flex-grow flex-col bg-white">
          {selectedRecipient ? (
            <div className="flex-grow flex items-center justify-center bg-gray-50/20 p-6">
              <ChatWindow recipientUsername={selectedRecipient} />
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <div className="bg-muted p-6 rounded-full">
                <Search className="h-12 w-12 opacity-20" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground">Wybierz konwersację</h3>
                <p className="text-sm">Wybierz osobę z listy po lewej, aby wyświetlić wiadomość.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
