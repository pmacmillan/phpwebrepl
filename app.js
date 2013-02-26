// vim: ts=2:sw=2:expandtab

var util = require('util');
var fs = require('fs');
var tty = require('tty');
var spawn = require('pty.js').spawn;

function configureSocket(socket) {
  var child = spawn(__dirname + '/run.sh', [], {
    cwd: undefined,
    env: [],
    cols: 80,
    rows: 25,
    name: 'vt220'
  });

  child.setEncoding('utf8');
  child.on('data', function(data) {
    socket.emit('stdout', data);
  });

  socket.on('disconnect', function() {
    child.destroy();
  });

  socket.on('input', function(input) {
    child.write(input.command);
  });
}

//
// socket.io server
//

var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);

io.enable('browser client minification');
io.enable('browser client etag');
io.enable('browser client gzip');
io.set('log level', 1);

app.listen(9001);

function handler(req, res) {
  fs.readFile(__dirname + '/index.html',
  function(err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function(socket) {
  configureSocket(socket);
});





