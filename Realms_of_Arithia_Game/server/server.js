const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const blockchain = require('./blockchain');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const { PORT, BLOCKCHAIN_PROVIDER } = require('../config/game_config.json');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Blockchain initialization
blockchain.init(BLOCKCHAIN_PROVIDER);

// Routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

// Socket.io for real-time communication
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('generateWorld', (seed) => {
    const worldData = blockchain.generateWorld(seed);
    socket.emit('worldGenerated', worldData);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});