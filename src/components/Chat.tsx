// src/components/Chat.tsx

import React, { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type?: string;      // Added for file type messages
  filePath?: string;  // Added for file path
  fileName?: string;  // Added for file name
}

interface UserStatus {
  username: string;
  status: 'online' | 'offline';
}

interface Props {
  user: {
    username: string;
  };
  users: UserStatus[];
  children: React.ReactNode;
}

const SOCKET_SERVER_URL = '/';

const Chat: React.FC<Props> = ({ user, users, children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, {
      path: '/api/socket',
      auth: { token: localStorage.getItem('token') || '' }
    });

    socketRef.current?.on('load_messages', (initialMessages: Message[]) => {
      setMessages(initialMessages);
    });

    socketRef.current?.on('receive_message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socketRef.current?.on('receive_file', (fileInfo: any) => {
      const fileMessage: Message = {
        id: `file-${Date.now()}`,
        sender: fileInfo.sender,
        content: '',
        timestamp: new Date().toISOString(),
        type: 'file',
        filePath: fileInfo.path,
        fileName: fileInfo.originalName,
      };
      setMessages((prevMessages) => [...prevMessages, fileMessage]);
    });

    socketRef.current?.on('update_user_list', (updatedUsers: UserStatus[]) => {
      console.log('Received updated user list:', updatedUsers); // Debug log
      if (Array.isArray(updatedUsers) && updatedUsers.every(user => user.username && (user.status === 'online' || user.status === 'offline'))) {
        // Update users state in parent component
        // setUsers(updatedUsers); // This line should be removed
      } else {
        console.error('Received invalid user list:', updatedUsers);
      }
    });

    socketRef.current?.emit('user_connected', user.username);

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user.username]);

  const handleFileUpload = (fileInfo: any) => {
    socketRef.current?.emit('send_file', {
      sender: user.username,
      filePath: fileInfo.path,
      fileName: fileInfo.originalName,
    });
  };

  return (
    <div>
      <div>
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              {user.username}: {user.status === 'online' ? '🟢 Online' : '🔴 Offline'}
            </li>
          ))}
        </ul>
      </div>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            {message.type === 'file' ? (
              <div>
                <p>{message.sender} shared a file: <a href={message.filePath} download>{message.fileName}</a></p>
                <p>{new Date(message.timestamp).toLocaleString()}</p>
              </div>
            ) : (
              <div>
                <p>{message.sender}: {message.content}</p>
                <p>{new Date(message.timestamp).toLocaleString()}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {children}
      {/* Add FileUpload component if needed */}
    </div>
  );
};

export default Chat;
