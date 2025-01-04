const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

const clients = new Map();

server.on('connection', (ws) => {
  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    const { type, content, from, to } = parsedMessage;

    if (type === 'register') {
      clients.set(content.role, ws);
    } else if (type === 'message') {
      const recipientSocket = clients.get(to);
      if (recipientSocket) {
        recipientSocket.send(JSON.stringify({ from, content }));
      }
    }
  });
});
