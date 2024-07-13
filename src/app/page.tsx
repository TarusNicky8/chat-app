// Add "use client" at the top to mark this as a client component
"use client";

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

interface Message {
  _id: string;
  sender: string;
  content: string;
  timestamp: string;
}

const Home = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    axios.get('/api/messages')
      .then((response) => {
        setMessages(response.data as Message[]); // Assuming response.data is an array of Message objects
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });

    const socket: Socket = io();

    socket.on('message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {messages.map((message, index) => (
          <div key={message._id}>
            <p>{message.sender}: {message.content}</p>
            <p>{new Date(message.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Home;
