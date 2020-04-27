// Modules
const express = require('express');
const app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.use(express.static(__dirname));

// Listen to the port
http.listen(3000, () => {
  console.log('Listening on 3000');
});

let msgs = [];
// Events
io.on('connection', socket => {
  //console.log('User connected');
  let usr;
  
  // Sending username
  socket.on('username', user => {
    usr = user;
    console.log(`User ${usr} connected`);
  });

  // Sending past messages
  // TODO: If list is longer than x items, send only the last couple
  console.log(socket.id);
  io.to(socket.id).emit('past messages', msgs);

  // On Message
  socket.on('chat message', msg => {
    msgs.push([usr, msg]);
    //console.log(msgs);
    io.emit('chat message', usr, msg);
  });

  // On Disconnect
  socket.on('disconnect', () => {
    console.log(`User ${usr} disconnected`);
    //TODO: Send a message along the lines of '{usr} disconnected'
  });
});
