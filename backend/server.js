require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const messagesRoutes = require('./routes/messages');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/messages', messagesRoutes);

const port = process.env.PORT || 4000;

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// make io available to routes via app
app.set('io', io);

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'changeme_super_secret');
    socket.user = payload; // { id, username }
  } catch (err) {
    // ignore and allow anonymous
  }
  next();
});

io.on('connection', (socket) => {
  console.log('socket connected', socket.id, socket.user?.username || 'anon');

  socket.on('chat message', async (msg) => {
    const content = String(msg?.content || msg || '').trim();
    if (!content) return;
    let userId = socket.user?.id;
    let username = socket.user?.username || 'anon';

    if (userId) {
      // Save message linked to user if available
      try {
        const message = await Message.create({ user: userId, content });
        await message.populate('user', 'username');
        io.emit('chat message', { id: message._id, user: message.user.username, content: message.content, createdAt: message.createdAt });
      } catch (err) {
        console.error('save message error', err);
      }
    } else {
      io.emit('chat message', { user: username, content, createdAt: new Date() });
    }
  });
});

async function start() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error('MONGO_URI not defined in env');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    server.listen(port, '0.0.0.0', () => console.log(`Server listening on http://0.0.0.0:${port}`));
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
}

start();
