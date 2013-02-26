// vim: ts=2:sw=2:expandtab

var util = require('util');
var basePath = __dirname;

var fs = require('fs');
var phpin = fs.createReadStream(basePath + '/fromphp');
var phpout = fs.createWriteStream(basePath + '/tophp');
var phperr = fs.createReadStream(basePath + '/fromphp_error');
var connections = [];

phpin.setEncoding('utf8');
phperr.setEncoding('utf8');

function handleInput(string) {
    if ('quit' === string) {
      phpout.end();
      phpin.destroy();
      phperr.destroy();

      process.exit(0);
      return;
    }

    if (string) {
      phpout.write(string + "\n", 'utf8');
    }
}

phpin.on('data', function(data) {
  // util.puts(data);
  connections.forEach(function(socket) {
    socket.emit('response', data);
  });
});

phperr.on('data', function(data) {
  // util.puts('error: ' + data);
  connections.forEach(function(socket) {
    socket.emit('response', 'error: ' + data);
  });
});

//
// socket.io server
//

var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app);

io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
io.set('log level', 1);                    // reduce logging

app.listen(9001);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
  connections.push(socket);

  socket.on('input', function (data) {
    // console.log('sending to php: ' + data.data);
    phpout.write(data.data + "\n", 'utf8');
  });
});





