// Modules
const express = require('express');
const app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.use(express.static(__dirname));

// Feed the client index.html
/*app.get('/style.css', (req,res) => {
  res.sendFile(__dirname + '/style.css');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
*/


// Listen to the port
http.listen(3000, () => {
  console.log('Listening on 3000');
});

// Events
io.on('connection', (socket) => {
  console.log('User connected');

  // On Message
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // On Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
