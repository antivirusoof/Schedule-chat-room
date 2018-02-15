var express = require('express');
var schedule = require('node-schedule');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
user = [];
connections = [];
server.listen(process.env.PORT || 3000);
console.log('Server started.....');
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
io.sockets.on('connection', function(socket) {
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  socket.on('disconnect', function(data) {
    //Disconnect

    user.splice(user.indexOf(socket.username), 1);
    updateUserNames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);

  });
  //New message
  socket.on('send message', function(data) {
    var t = data.split(" ");

    var time = t.splice(t.indexOf(t.length - 1));
    
     //here comes the main logic scheduling
    
      if(time=='Avishek') //when time stamp is empty
      {
          data=data.substring(0,data.length-8);
           io.sockets.emit('new message', {
        msg: data,
        username: socket.username,
               
      });
          
      }
else{
    var currentTime = new Date(time);
    data=data.substring(0,data.length-16);
    schedule.scheduleJob('hereisthename', currentTime, function(data) {


      io.sockets.emit('new message', {
        msg: data,
        username: socket.username
      });
    }.bind(null, data));

 
  }
       });

  //New User
  socket.on('new user', function(data, callback) {
    callback(true);
    socket.username = data.toUpperCase();
    user.push(socket.username);
    updateUserNames();
  });

  function updateUserNames() {
    io.sockets.emit('get user', user);
  }
});