import { Server } from 'socket.io';

let io;

export function initRealtime(server) {
  io = new Server(server, {
    cors: { origin: '*' }
  });
  io.on('connection', (socket) => {
    console.log('Realtime client connected', socket.id);
    socket.on('disconnect', () => console.log('Realtime client disconnected', socket.id));
  });
  return io;
}

export function getIO() {
  if (!io) throw new Error('Realtime not initialised');
  return io;
}
