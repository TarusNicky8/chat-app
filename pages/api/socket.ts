// pages/api/socket.ts

import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../utils/db';

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

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_default_secret');
        if (!decoded) {
          return next(new Error('Invalid token'));
        }

        const { db } = await connectToDatabase();
        const users = db.collection('users');
        const user = await users.findOne({ username: decoded.username });

        if (!user) {
          return next(new Error('User not found'));
        }

        socket.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    io.on('connection', (socket) => {
      socket.on('send_message', async (message) => {
        try {
          const { db } = await connectToDatabase();
          const messages = db.collection('messages');
          await messages.insertOne({
            sender: socket.user.username,
            content: message.content,
            timestamp: new Date()
          });

          io.emit('receive_message', {
            sender: socket.user.username,
            content: message.content,
            timestamp: new Date()
          });
        } catch (error) {
          console.error('Error sending message:', error);
        }
      });
    });
  }
  res.end();
};

export default ioHandler;
