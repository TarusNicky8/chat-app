"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import Chat from '../components/Chat';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState<string>(''); // State to store the username
  const socketRef = React.useRef<Socket | null>(null);

  useEffect(() => {
    // Fetch the username of the logged-in user
    const fetchUsername = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('/api/getUser', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();

    // Fetch messages from the API
    axios.get('/api/messages')
      .then((response) => {
        const fetchedMessages = response.data.map((msg: any) => ({
          id: msg._id,
          content: msg.content,
          sender: msg.sender,
          timestamp: msg.timestamp
        }));
        setMessages(fetchedMessages as Message[]);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });

    // Initialize socket.io
    const socket: Socket = io({ path: '/api/socket' });
    socketRef.current = socket;

    socket.on('receive_message', (message: any) => {
      const newMessage: Message = {
        id: message._id,
        content: message.content,
        sender: message.sender,
        timestamp: message.timestamp,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = (content: string) => {
    if (!username) {
      console.error('Username is not available');
      return;
    }

    const newMessage: Message = {
      id: 'temp-id', // Generate or replace with actual id logic
      sender: username, // Use the actual username
      content,
      timestamp: new Date().toISOString(),
    };

    axios.post('/api/messages', {
      sender: newMessage.sender,
      content: newMessage.content,
    })
      .then((response) => {
        const savedMessage = response.data;
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: savedMessage._id,
            content: savedMessage.content,
            sender: savedMessage.sender,
            timestamp: savedMessage.timestamp,
          },
        ]);

        if (socketRef.current) {
          socketRef.current.emit('send_message', savedMessage);
        }
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  };

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <Chat user={{ username }}>
        <MessageList messages={messages} />
        <MessageInput onSendMessage={handleSendMessage} />
      </Chat>
    </main>
  );
};

export default Home;
