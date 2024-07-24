// src/pages/page.tsx
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

interface UserStatus {
  username: string;
  status: 'online' | 'offline';
}

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<UserStatus[]>([]);
  const [username, setUsername] = useState<string>('');
  const socketRef = React.useRef<Socket | null>(null);

  useEffect(() => {
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

    socket.on('update_user_list', (updatedUsers: UserStatus[]) => {
      setUsers(updatedUsers);
      console.log('Received updated user list:', updatedUsers); // Debug log
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
      id: 'temp-id',
      sender: username,
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
      <Chat user={{ username }} users={users}>
        <MessageList messages={messages} />
        <MessageInput onSendMessage={handleSendMessage} />
      </Chat>
    </main>
  );
};

export default Home;
