

import { NextApiRequest, NextApiResponse } from 'next';
import { Server as HTTPServer } from 'http';
import { Server as IOServer, Socket } from 'socket.io';

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
};

interface UserStatus {
  username: string;
  status: 'online' | 'offline';
}

// Initialize io outside the handler to ensure it's a singleton across requests
let io: IOServer | null = null;

// Store user status
const userStatusList: UserStatus[] = [];

const handler = async (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log('Initializing new Socket.IO server...');
    io = new IOServer(res.socket.server, {
      path: '/api/socket',
      serveClient: false,
    });

    io.on('connection', (socket: Socket) => {
      console.log('A user connected', socket.id);

      socket.on('user_connected', (username: string) => {
        console.log('User connected:', username);
        socket.data.username = username; // Store username in socket data
        updateUserStatus(username, 'online');
        io?.emit('update_user_list', userStatusList);
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected', socket.id);
        const username = socket.data.username;
        if (username) {
          updateUserStatus(username, 'offline');
          io?.emit('update_user_list', userStatusList);
        }
      });

      socket.on('send_message', (msg: any) => {
        console.log('Message received:', msg);
        io?.emit('receive_message', msg);
      });

      socket.on('send_file', (fileInfo: any) => {
        console.log('File received:', fileInfo);
        io?.emit('receive_file', fileInfo);
      });
    });

    res.socket.server.io = io;

    res.socket.server.on('close', () => {
      if (io) {
        console.log('Closing Socket.IO server...');
        io.close((err?: Error) => {
          if (err) {
            console.error('Error closing Socket.IO server:', err);
          } else {
            console.log('Socket.IO server closed');
            io = null;
          }
        });
      }
    });

    res.end('Socket initialized');
  } else {
    console.log('Socket.IO server is already running');
    res.end('Socket is already running');
  }
};

export default handler;

// Utility functions for managing user status
const updateUserStatus = (username: string, status: 'online' | 'offline') => {
  const user = userStatusList.find((user) => user.username === username);
  if (user) {
    user.status = status;
  } else {
    userStatusList.push({ username, status });
  }
};
