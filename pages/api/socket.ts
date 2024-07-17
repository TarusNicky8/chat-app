import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';

// Initialize io outside the handler to ensure it's a singleton across requests
let io: Server | null = null;

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (!io) {
    // Create a new Server instance attached to the HTTP server
    io = new Server({
      path: '/api/socket', // Specify the path where Socket.IO will be handled
      serveClient: false, // Do not serve the Socket.IO client script automatically
    });

    io.on('connection', (socket) => {
      console.log('A user connected');

      socket.on('send_message', (msg: string) => {
        io?.emit('receive_message', msg);
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });

    // Attach the Socket.IO server to the HTTP response socket
    if (res.socket) {
      res.socket.once('close', () => {
        io?.close();
        io = null;
      });
    } else {
      console.error('res.socket is null or undefined');
    }
  } else {
    console.log('Socket is already running');
  }

  res.end('Socket connected');
};

export default handler;
