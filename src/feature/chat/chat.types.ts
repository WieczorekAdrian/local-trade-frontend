export interface ChatMessage {
  content: string;
  sender: string;
  recipient: string;
  timestamp: string;
  isRead?: boolean;
}

export interface ChatWindowProps {
  recipientUsername: string;
}
