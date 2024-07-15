import React, { useEffect, useState } from 'react';
import socket from '../utils/socket';
import MessageInput from './MessageInput';
import MessageList from './MessageList';

const ChatWindow = ({ children }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('receive_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  const handleSendMessage = (content) => {
    socket.emit('send_message', { content });
  };

  const defaultChild = (
    <>
      <MessageList messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </>
  );

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.sender}:</strong> {message.content}
          </div>
        ))}
      </div>
      {children || defaultChild}
    </div>
  );
};

export default ChatWindow;
