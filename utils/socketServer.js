// socketServer.js

import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from './utils/db'; // Adjust path as per your project structure

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

        const decoded = jwt.verify(token, process.env.JWT_SECRET || '4737'); // Replace with your JWT secret
        if (!decoded) {
          return next(new Error('Invalid token'));
        }

        // Example: Fetch user from database based on decoded username
        const { db } = await connectToDatabase();
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

    io.on('connection', async (socket) => {
      try {
        const { db } = await connectToDatabase();
        const messages = db.collection('messages');

        // Emit all previous messages to the connected client
        const allMessages = await messages.find().toArray();
        socket.emit('load_messages', allMessages);

        // Handle sending new messages
        socket.on('send_message', async (message) => {
          try {
            const newMessage = {
              sender: socket.user.username,
              content: message.content,
              timestamp: new Date()
            };

            await messages.insertOne(newMessage);

            // Emit the new message to all connected clients
            io.emit('receive_message', newMessage);
          } catch (error) {
            console.error('Error sending message:', error);
          }
        });

        socket.on('disconnect', () => {
          console.log('Socket disconnected');
        });
      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
      }
    });
  }

  res.end();
};

export default ioHandler;
