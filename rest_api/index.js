// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var cluster = require('cluster');
var os = require('os');

var rest_api_server = http.createServer(function(req, res) {

  // Parse URL
  var parsedURL = url.parse(req.url, true);

  // Get the path from the URL
  var path = parsedURL.pathname;
  var trimmedpath = path.replace(/^\/+|\/+$/g,'');

  // Get the Payload, if there's any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data) {
    buffer += decoder.write(data);
  });
  req.on('end', function() {
    buffer += decoder.end();

    var chosenhandler = typeof(router[trimmedpath]) !== 'undefined' ? router[trimmedpath] : handlers.notfound;

    chosenhandler(function(statuscode, payload) {
      statuscode = typeof(statuscode) == 'number' ? statuscode : 200;

      payload = typeof(payload) == 'object' ? payload : {};

      // Convert the payload to string
      var payloadstring = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statuscode);
      res.end(payloadstring);

      console.log("Response:", statuscode, payloadstring);
    });

  });

});

// Fork the process
for(var i = 0; i < os.cpus().length; i++) {
  // Start server listening on port 1234
  rest_api_server.listen(1234, function() {
    console.log("REST API server listening on port 1234");
  });
}

// Handlers
var handlers = {};

// Defining hello handler
handlers.hello = function(callback) {
  callback(200, {'msg': 'Welcome to my REST API!'});
};

// Defining not found handler
handlers.notfound = function(callback) {
  callback(404);
}

// Defining a request router
var router = {
  'hello': handlers.hello
}
