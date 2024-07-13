// src/components/MessageInput.tsx

import React, { useState } from 'react';

const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle message submission logic (e.g., send message via WebSocket)
    console.log('Message submitted:', message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          placeholder="Type your message..."
          className="flex-1 border-gray-300 border p-2 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
