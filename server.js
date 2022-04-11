const io = require('socket.io')(3000, { cors: {    // cors options added to handle the cors - policy issue.
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"]
  }
});

const users = {}        // Initialized users to store connected user

io.on('connection', socket => { 
  socket.emit('server-message', 'You are connected to the server');// server is emitting a message to the client
  socket.on('new-user', username => {
    
   users[socket.id] = username;         // Add new user to the users 
   socket.broadcast.emit('user-connected', username)
   
  }); 
 
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', {
          message, username:  users[socket.id]
    });
    
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
});