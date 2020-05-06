// Modules
const fs = require('fs');
const express = require('express');
const app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.use(express.static('client'));

// Listen to the port
http.listen(5000, () => {
  console.log('Listening on 5000');
});

let msgs = [];

// writing to msglog.json
writeLog = array => {
  array = JSON.stringify(array, null, 2);
  fs.writeFile('msglog.json', array, (error) => {
    if (error) throw err;
  });
};

// TODO: moving contents of msglog.json to a backup file, and making a new log
clearLog = () => {
  let date = new Date();

  console.log(date.toUTCString());
};

// Events

/*
EMIT KEY:
msg-c: chat message
msg-p: past messages
msg-a: alert message
join room: joining a room
*/

// TODO: Make compatible with rooms
// I'm very close but I can't quite figure out why this isn't working
// TODO: Make msgs a dictionary for easier usability
getPast = (r) => {
  let templist = [];
  for (let i = 0; i < msgs.length; i++){
    if (msgs[i[0]] == r) {
      templist.push(msgs[i]);
    };
  };
  return templist;
}

io.on('connection', socket => {
  let usr;
  let room = 'default';
  socket.join(room)
  io.to(room).emit('msg-p', getPast(room));
  
  // Sending username
  socket.on('username', user => {
    usr = user;
    console.log(`User ${usr} connected in room ${room}`);
    io.to(room).emit('msg-a', `${usr} connected to room ${room}`);
  });

  // Joining Room
  socket.on('join room', roomid => {
    console.log(`Room request to ${roomid}`)
    socket.join(roomid);
    socket.leave(room);
    room = roomid;
    io.to(room).emit('msg-p', getPast(room));
    io.to(room).emit('msg-a', `${usr} connected to room ${room}`);
  });

  // On Message
  socket.on('msg-c', msg => {
    msgs.push([room, usr, msg]);
    writeLog(msgs);
    //clearLog();
    io.to(room).emit('msg-c', usr, msg);
  });

  // On Disconnect
  socket.on('disconnect', () => {
    console.log(`User ${usr} disconnected from room ${room}`);
    io.to(room).emit('msg-a', `${usr} disconnected from room ${room}`);
  });
});
