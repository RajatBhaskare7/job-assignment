export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sessionId: string;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  nextCursor?: string | null;
}
