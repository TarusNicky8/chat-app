// components/Chat.tsx

import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { insertMessage, getAllMessages } from '../utils/utils/dbUtils';

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
}

const SOCKET_SERVER_URL = '/';

const Chat: React.FC<Props> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const allMessages = await getAllMessages();
      setMessages(allMessages);
    };

    fetchMessages();

    socketRef.current = io(SOCKET_SERVER_URL, {
      auth: { token: localStorage.getItem('token') || '' }
    });

    socketRef.current.on('load_messages', async () => {
      const allMessages = await getAllMessages();
      setMessages(allMessages);
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

  const handleSendMessage = async () => {
    const message = {
      sender: user.username,
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    if (socketRef.current) {
      socketRef.current.emit('send_message', message);
    }

    // Save message to MongoDB
    await insertMessage(message);

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
    </div>
  );
};

export default Chat;
