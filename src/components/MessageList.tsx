// src/components/MessageList.tsx

import React from 'react';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}

interface Props {
  messages: Message[];
}

const MessageList: React.FC<Props> = ({ messages }) => {
  return (
    <div className="max-h-80 overflow-y-auto">
      <div className="space-y-2">
        {messages.map((message) => (
          <div key={message.id} className="flex items-center space-x-2">
            <span className="font-semibold">{message.sender}</span>
            <span className="text-gray-500 text-sm">{message.timestamp}</span>
            <p className="bg-gray-100 rounded-lg p-2">{message.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;
