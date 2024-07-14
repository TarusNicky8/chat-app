// socketServer.js

import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from './src/utils/db'; // 
import { insertMessage, getAllMessages } from './src/utils/dbUtils'; // 

const ioHandler = async (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || '4737'); //  JWT secret
        if (!decoded) {
          return next(new Error('Invalid token'));
        }

        // Fetch user from database based on decoded username
        const client = await connectToDatabase();
        const db = client.db('chat_app');
        const users = db.collection('users');
        const user = await users.findOne({ username: decoded.username });

        if (!user) {
          return next(new Error('User not found'));
        }

        socket.user = user; // Attach user object to socket for use in event handlers
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    io.on('connection', (socket) => {
      console.log('New client connected');

      // Load all messages when a client connects
      socket.on('load_messages', async () => {
        const allMessages = await getAllMessages();
        socket.emit('load_messages', allMessages);
      });

      // Handle send_message event
      socket.on('send_message', async (message) => {
        try {
          // Store message in MongoDB
          await insertMessage({
            sender: socket.user.username,
            content: message.content,
            timestamp: new Date()
          });

          // Emit message to all connected clients
          io.emit('receive_message', {
            sender: socket.user.username,
            content: message.content,
            timestamp: new Date()
          });
        } catch (error) {
          console.error('Error sending message:', error);
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }
  res.end();
};

export default ioHandler;
