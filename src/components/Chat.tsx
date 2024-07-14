import React, { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface Message {
  _id: string;
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
    // Connect to socket.io server
    socketRef.current = io(SOCKET_SERVER_URL, {
      auth: { token: localStorage.getItem('token') || '' }
    });

    // Fetch initial messages from server
    socketRef.current.on('load_messages', (initialMessages: Message[]) => {
      setMessages(initialMessages);
    });

    // Listen for new messages from socket
    socketRef.current.on('receive_message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      // Disconnect socket when component unmounts
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleSendMessage = () => {
    const message = {
      sender: user.username,
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    // Emit new message to socket server
    if (socketRef.current) {
      socketRef.current.emit('send_message', message);
    }

    // Clear input field after sending message
    setNewMessage('');
  };

  return (
    <div>
      <div>
        {messages.map((message) => (
          <div key={message._id}>
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

      {/* Optional: Render children components */}
      {children}
    </div>
  );
};

export default Chat;
