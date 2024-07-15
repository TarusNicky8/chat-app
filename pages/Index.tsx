// src/pages/Index.tsx

import React from 'react';
import ChatWindow from '../src/components/ChatWindow';
import MessageList from '../src/components/MessageList';
import MessageInput from '../src/components/MessageInput';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Your Chat App</h1>
      <ChatWindow>
        <MessageList messages={[]} />
        <MessageInput onSendMessage={() => {}} />
      </ChatWindow>
    </div>
  );
};

export default Home;
