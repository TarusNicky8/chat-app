// src/components/MessageList.tsx

import React from 'react';

const MessageList: React.FC = () => {
  return (
    <div className="max-h-80 overflow-y-auto">
      <div className="space-y-2">
        {/* Example Message Item */}
        <div className="flex items-center space-x-2">
          <span className="font-semibold">SenderName</span>
          <span className="text-gray-500 text-sm">12:30 PM</span>
          <p className="bg-gray-100 rounded-lg p-2">Hello, how are you?</p>
        </div>
        {/* Repeat for each message */}
      </div>
    </div>
  );
};

export default MessageList;
