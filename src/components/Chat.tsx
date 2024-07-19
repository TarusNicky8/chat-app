// src/components/Chat.tsx

import React, { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

interface Props {
  user: {
    username: string;
  };
  children: React.ReactNode; // Ensure children prop is defined
}

const SOCKET_SERVER_URL = '/';

const Chat: React.FC<Props> = ({ user, children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, {
      auth: { token: localStorage.getItem('token') || '' }
    });

    socketRef.current.on('load_messages', (initialMessages: Message[]) => {
      setMessages(initialMessages);
    });

    socketRef.current.on('receive_message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleSendMessage = () => {
    const message: Message = {
      id: 'temp-id', // Use actual logic for generating unique IDs
      sender: user.username,
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    if (socketRef.current) {
      socketRef.current.emit('send_message', message);
    }

    setNewMessage('');
  };

  return (
    <div>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <p>{message.sender}: {message.content}</p>
            <p>{new Date(message.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
      {children}
    </div>
  );
};

export default Chat;
