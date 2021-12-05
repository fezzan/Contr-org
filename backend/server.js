const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const Room = require('./models/Room');
const Chat = require('./models/Chat');

const app = express();
const server = http.createServer(app);

// Connect DB
connectDB();

const io = new Server(server, {
  path: '/socket',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let activeUsers = {};
let activeSockets = {};
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);
  app.set('socket', socket);

  socket.on('active_user', (user) => {
    console.log({ user });
    activeUsers[socket.id] = user;
    io.emit('active_users', activeUsers);
  });

  socket.on('join_room', (data) => {
    // socket.leave(data);
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on('send_message', async (data) => {
    console.log({ data });
    try {
      const newMessage = new Chat({
        ...data,
      });
      let message = await newMessage.save();
      message = await Chat.populate(message, {
        path: 'author',
        select: 'name email role department',
        populate: { path: 'department', select: 'name' },
      });
      message = await Chat.populate(message, {
        path: 'room',
        select: 'members',
        populate: { path: 'members', select: 'name role email' },
      });
      console.log({ message });
      socket.to(data.room).emit('receive_message', message);
    } catch (err) {
      console.log({ err });
    }
  });

  socket.on('set_room', async (members) => {
    try {
      let room = await Room.findOne({
        members: { $all: members },
      }).populate({
        path: 'members',
        select: 'name email role department',
        populate: { path: 'department', select: 'name' },
      });
      if (!room) {
        const newRoom = new Room({
          members,
        });
        room = await newRoom.save();
        room = await Room.populate(room, {
          path: 'members',
          select: 'name email role department',
          populate: { path: 'department', select: 'name' },
        });
      }

      console.log({ room, members });

      // socket.join(room._id);
      io.emit(members[0], room);
      io.emit(members[1], room);
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
    delete activeUsers[socket.id];
    io.emit('active_users', activeUsers);
  });
});

// Init Middleware

app.use(express.json({ extended: false }));
app.use(cors());

//Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/room', require('./routes/room'));

// Serve static assets in production

if (process.env.NODE_ENV === 'production') {
  // Set static folder

  app.use(express.static('client/build'));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
