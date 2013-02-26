// vim: ts=2:sw=2:expandtab

var util = require('util');
var fs = require('fs');
var spawn = require('child_process').spawn;
var basePath = __dirname;

function configureSpawn(child, socket) {
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', function(data) {
    socket.emit('stdout', data);
  });

  child.stderr.setEncoding('utf8');
  child.stderr.on('data', function(data) {
    socket.emit('stderr', data);
  });

  socket.on('disconnect', function() {
    child.stdin.end();
  });

  socket.on('input', function(input) {
    child.stdin.write(input.command);
  });
}


function handleInput(string) {
    if ('quit' === string) {
      phpout.end();
      phpin.destroy();
      phperr.destroy();

      process.exit(0);
      return;
    }

    if (string) {
      phpout.write(string + '\n', 'utf8');
    }
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
  configureSpawn(spawn('php', ['-a']), socket);
});





