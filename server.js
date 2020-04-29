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

/*
EMIT KEY:
msg-c: chat message
msg-p: past messages
msg-a: alert message
*/

io.on('connection', socket => {
  let usr;
  
  // Sending username
  socket.on('username', user => {
    usr = user;
    console.log(`User ${usr} connected`);
    io.emit('msg-a', `${usr} connected`);
  });

  // Sending past messages
  // If msgs > 50 items, send only last 50
  if (msgs.length > 50) {
    io.to(socket.id).emit('msg-p', arr.slice(msgs.length - 50, msgs.length));
  } 
  else {io.to(socket.id).emit('msg-p', msgs)};

  // On Message
  socket.on('msg-c', msg => {
    msgs.push([usr, msg]);
    //console.log(msgs);
    io.emit('msg-c', usr, msg);
  });

  // On Disconnect
  socket.on('disconnect', () => {
    console.log(`User ${usr} disconnected`);
    //TODO: Send a message along the lines of '{usr} disconnected'
  });
});
