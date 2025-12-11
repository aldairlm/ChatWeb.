require('dotenv').config();
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
});

const port = process.env.PORT || 4000;
server.listen(port, '0.0.0.0', () => {
  console.log(`Test server listening on port ${port}`);
});

server.on('error', (err) => {
  console.error('Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Trying port ${port + 1}`);
    server.listen(port + 1);
  }
});
