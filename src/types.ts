

export interface Message {
    _id: string;
    content: string;
    sender: string;
    timestamp: string;
    type?: string; // Optional type field
  }
  