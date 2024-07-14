import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface Props {
  children: React.ReactNode; // Ensure children prop is defined
}

const ChatWindow: React.FC<Props> = ({ children }) => {
  return (
    <div className="max-w-lg mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-xl font-bold mb-4">Chat Window</h1>
      {/* Render MessageList and MessageInput passed as children */}
      {children}
    </div>
  );
};

export default ChatWindow;
