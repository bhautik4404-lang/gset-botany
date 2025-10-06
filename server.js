// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

const DATA_PATH = path.join(__dirname, 'data.json'); // <- put your JSON here (rename your uploaded file to data.json)

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

// Serve JSON to clients
app.get('/api/data', (req, res) => {
  res.sendFile(DATA_PATH);
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function broadcastJSONUpdate() {
  const message = JSON.stringify({ type: 'data_updated', when: Date.now() });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(message);
  });
  console.log('[ws] broadcast: data_updated');
}

wss.on('connection', (ws) => {
  console.log('[ws] client connected');
  ws.send(JSON.stringify({ type: 'hello' }));
  ws.on('close', () => console.log('[ws] client disconnected'));
});

// Watch the data file for changes and notify clients
// NOTE: fs.watch works in most environments; if you have trouble on Windows use 'chokidar' (I include a note later).
fs.watch(DATA_PATH, { persistent: true }, (eventType, filename) => {
  if (!filename) return;
  if (eventType === 'change' || eventType === 'rename') {
    console.log('[watcher] detected change:', eventType, filename);
    // debounce to prevent duplicate notifications
    if (server._notifyTimeout) clearTimeout(server._notifyTimeout);
    server._notifyTimeout = setTimeout(() => {
      broadcastJSONUpdate();
    }, 150);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
