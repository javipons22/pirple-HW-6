/*
 * Homework Assignment #1
 * 
 */

// Dependencies
var http = require('http');
var url = require('url');
var cluster = require('cluster');
var os = require('os');


// Create server and store it in variable for further startup
var server = http.createServer(function(req,res){

    // Retrieve the URL from the request and parse it using the url module
    var parsedUrl = url.parse(req.url); 


    // Retrieve the full path and trim it to only store the pathname for further matching with route name in route's object
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');


    // If trimmed path available in routes object, return corresponding handler and store it in chosenHandler variable for further execution, if NOT available return notFound handler
    var chosenHandler = typeof(routes[trimmedPath]) !== 'undefined' ? routes[trimmedPath] : handlers.notFound;


    // Execute the chosen handler 
    chosenHandler(function(statusCode, payload){

        // Set default status code to 200 in case of not present or different type
        var statusCode = typeof(statusCode) == 'number' ? statusCode : 200;


        // Set default payload value to empty object if not present
        var payload = typeof(payload) == 'object' ? payload : {};


        // Convert payload object to JSON String
        var payloadString = JSON.stringify(payload);


        // Write the response
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);

        // Log Success or Error message to console

        statusCode == 404 ? console.log('Not found : 404 error code') : console.log('Returned welcome message!');

    });
});

if(cluster.isMaster){
    for(var i = 0; i < os.cpus().length; i++){
        cluster.fork();
    }
} else {
    // Start the server
    server.listen(3000);
}


// Set handlers object for handler storage
var handlers = {};


// Set notFound handler 
handlers.notFound = function(callback){
    callback(404);
};


// Set hello handler
handlers.hello = function(callback){
    callback(200, { 'Welcome': 'Welcome, this is my first Assignment running in all cores :)' });
};


// Set routes object for route matching with pathname and further assignment of handler
var routes = {
    hello : handlers.hello
};
