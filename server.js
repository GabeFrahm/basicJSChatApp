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

// TODO: Change msgs list to a more sustainable database
// TODO: Make msg list items into dictionaries for easier usability and more expansibility
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
room-j: joining a room
*/

// Send past messages from a specific room
getPast = (r) => {
  let templist = [];
  for (let i = 0; i < msgs.length; i++){
    if (msgs[i].room == r) {
      templist.push(msgs[i]);
    };
  };
  return templist;
};

makeMsgItem = (room, user, msg) => {
  let tempdict = {
    room: room,
    user: user,
    msg: msg
  };
  return tempdict;
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
  socket.on('room-j', roomid => {
    console.log(`Room request to ${roomid}`)
    socket.join(roomid);
    socket.leave(room);
    room = roomid;
    io.to(room).emit('msg-p', getPast(room));
    io.to(room).emit('msg-a', `${usr} connected to room ${room}`);
  });

  // On Message
  socket.on('msg-c', msg => {
    msgs.push(makeMsgItem(room, usr, msg));
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
