export interface ChatMessage {
  id?: number;
  content: string;
  sender: string;
  recipient: string;
  timestamp: string;
  isRead?: boolean;
}

export interface ChatSummary {
  partnerName: string;
  partnerEmail: string;
  lastMessage: string | null;
  lastMessageTimestamp: string;
  unreadCount: number;
}

export interface ChatWindowProps {
  recipientUsername: string;
  variant?: "page" | "bubble";
  onClose?: () => void;
}
