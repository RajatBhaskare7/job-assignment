export interface Message {
  id: string;
  content: string;
  role: 'user' | 'ai';
  timestamp: Date;
  sessionId: string;
}

export interface ChatSession {
  messages: Message[];
  nextCursor: string | null;
}
