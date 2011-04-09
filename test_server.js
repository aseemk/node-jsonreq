var server = module.exports = require('http').createServer(function (req, resp) {
    
    // this is super simplistic and not flexible or robust.
    // that's ok -- this is just a simple server for testing.
    
    switch (req.uri) {
        // TODO
    }
    
    resp.end();
    
});