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

// Initialize io outside the handler to ensure it's a singleton across requests
let io: IOServer | null = null;

const handler = async (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log('Initializing new Socket.IO server...');
    io = new IOServer(res.socket.server, {
      path: '/api/socket',
      serveClient: false,
    });

    io.on('connection', (socket: Socket) => {
      console.log('A user connected');

      socket.on('send_message', (msg: string) => {
        io?.emit('receive_message', msg);
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
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
