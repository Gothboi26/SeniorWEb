const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });
const clients = {}; // { username: WebSocket }

wss.on("connection", (ws) => {
  let username = null;

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      // 1. Register user (client or admin)
      if (data.type === "register") {
        if (!data.content || !data.content.username) {
          console.warn("⚠️ Connection rejected: no username provided.");
          ws.send(JSON.stringify({ type: "error", content: "Username required for registration." }));
          ws.close(); // Optional: force disconnect
          return;
        }

        username = data.content.username;
        clients[username] = ws;
        console.log(`[✅ Connected] ${username} (${data.content.role}) connected`);
        return;
      }

      // 2. Handle chat message
      if (data.type === "message") {
        const { from, to, content } = data;
        const payload = JSON.stringify({ type: "message", from, to, content });

        // Send to recipient
        if (clients[to] && clients[to].readyState === WebSocket.OPEN) {
          clients[to].send(payload);
        }

        // Echo back to sender
        if (clients[from] && clients[from].readyState === WebSocket.OPEN) {
          clients[from].send(payload);
        }
        return;
      }

      // 3. Notify admin
      if (data.type === "notify-admin") {
        const adminSocket = clients["admin"];
        if (adminSocket && adminSocket.readyState === WebSocket.OPEN) {
          adminSocket.send(
            JSON.stringify({
              type: "notification",
              from: data.from,
              content: "A client has requested to talk to you.",
            })
          );
        } else {
          console.warn("⚠️ No admin connected to notify.");
        }
        return;
      }
    } catch (err) {
      console.error("❌ Invalid WebSocket message:", err.message);
    }
  });

  ws.on("close", () => {
    if (username && clients[username]) {
      delete clients[username];
      console.log(`[❌ Disconnected] ${username} disconnected`);
    }
  });
});

console.log("🟢 WebSocket server running on ws://localhost:8080");
