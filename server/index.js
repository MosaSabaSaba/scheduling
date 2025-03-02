import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employees.js';
import shiftRoutes from './routes/shifts.js';

// Config
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/job-scheduler')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/shifts', shiftRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
}

// Create HTTP server
const server = createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Socket middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.user.id);
  
  // Join a room based on user ID
  socket.join(socket.user.id);
  
  // Join manager room if user is a manager
  if (socket.user.role === 'manager') {
    socket.join('managers');
  }
  
  // Listen for shift updates
  socket.on('shift_created', (data) => {
    // Notify the employee assigned to the shift
    socket.to(data.employeeId).emit('shift_created', data);
    // Notify all managers
    socket.to('managers').emit('shift_created', data);
  });
  
  socket.on('shift_updated', (data) => {
    socket.to(data.employeeId).emit('shift_updated', data);
    socket.to('managers').emit('shift_updated', data);
  });
  
  socket.on('shift_deleted', (data) => {
    socket.to(data.employeeId).emit('shift_deleted', data);
    socket.to('managers').emit('shift_deleted', data);
  });
  
  socket.on('shift_swap_requested', (data) => {
    socket.to(data.employeeId).emit('shift_swap_requested', data);
    socket.to(data.requestedEmployeeId).emit('shift_swap_requested', data);
    socket.to('managers').emit('shift_swap_requested', data);
  });
  
  socket.on('shift_swap_responded', (data) => {
    socket.to(data.employeeId).emit('shift_swap_responded', data);
    socket.to(data.requestedEmployeeId).emit('shift_swap_responded', data);
    socket.to('managers').emit('shift_swap_responded', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;