export interface ChatMessage {
  content: string;
  sender: string;
  recipient: string;
  timestamp: string;
}

export interface ChatWindowProps {
  recipientUsername: string;
}
