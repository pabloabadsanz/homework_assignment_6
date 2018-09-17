On this assignment what I've done is forking the function which inits the server and starts listening on the required port.

This makes the app to spread the load through all the available cpu cores; however when a request hits the server, just one response is sent instead of many.
