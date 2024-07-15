// src/pages/index.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Navbar from '../components/Navbar';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import ChatWindow from '../components/ChatWindow';
import Chat from '../components/Chat'; // Ensure correct import path

const Home = () => {
  const [messages, setMessages] = useState([]);
  const socketRef = React.useRef(null);

  useEffect(() => {
    // Fetch messages from the API
    axios.get('/api/messages')
      .then((response) => {
        const fetchedMessages = response.data.map((msg) => ({
          _id: msg._id, // Ensure you map _id correctly
          content: msg.content,
          sender: msg.sender,
          timestamp: msg.timestamp
        }));
        setMessages(fetchedMessages);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });

    // Initialize socket.io
    const socket = io();
    socketRef.current = socket;

    socket.on('receive_message', (message) => {
      const newMessage = {
        _id: message._id, // Ensure you use _id here
        content: message.content,
        sender: message.sender,
        timestamp: message.timestamp,
        type: ''
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = (content) => {
    const newMessage = {
      _id: 'temp-id', // Replace with actual id logic
      sender: 'Current User', // Replace with actual user logic
      content,
      timestamp: new Date().toISOString(),
      type: ''
    };

    axios.post('/api/messages', {
      sender: newMessage.sender,
      content: newMessage.content,
    })
      .then((response) => {
        const savedMessage = response.data; // Ensure response data matches Message type
        setMessages((prevMessages) => [
          ...prevMessages,
          savedMessage,
        ]);
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });

    if (socketRef.current) {
      socketRef.current.emit('send_message', newMessage);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="flex flex-col items-center justify-between p-24">
        <Chat user={{ username: 'Current User' }} />
        <ChatWindow>
          <MessageList messages={messages} />
          <MessageInput onSendMessage={handleSendMessage} />
        </ChatWindow>
      </main>
    </div>
  );
};

export default Home;
