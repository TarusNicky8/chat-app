// src/pages/index.tsx

import React from 'react';
import ChatWindow from '../src/components/ChatWindow';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Your Chat App</h1>
      <ChatWindow children={undefined} />
    </div>
  );
};

export default Home;
