import React, { useEffect, useState } from 'react';
import socket from '../utils/socket';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}

interface Props {
  messages: Message[]; // Ensure this matches the structure of Message
}

const MessageList: React.FC<Props> = ({ messages }) => {
  useEffect(() => {
    // Listen for incoming messages via WebSocket
    socket.on('receive_message', (message: Message) => {
      // Assuming socket handles the correct Message type
      // Ensure messages are updated properly
    });

    return () => {
      // Clean up socket listeners
      socket.off('receive_message');
    };
  }, []);

  return (
    <div className="max-h-80 overflow-y-auto">
      <div className="space-y-2">
        {messages.map(message => (
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
