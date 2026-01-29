
export type SparkModel = 'default' | 'pro' | 'beta' | 'skripter' | 'artist';

export interface Attachment {
  mimeType: string;
  data: string; // base64
  name: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  thought?: string;
  timestamp: number;
  attachments?: Attachment[];
  isSkript?: boolean;
  imageUrl?: string; // For Spark Artist results
}

export interface UserState {
  coins: number;
  redeemedCodes: string[];
  lastCheckIn?: number;
  username?: string;
  preferredVoice?: string;
}
