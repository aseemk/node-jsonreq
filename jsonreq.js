var http = require('http');
var url_parse = require('url').parse;

exports.get = function get(url, callback) {
    
    url = url_parse(url);
    
    var opts = {
        host: url.hostname,
        port: url.port || 80,
        path: url.pathname + (url.search || ''),
        headers: {
            'Accept': 'application/json',
        },
    };
    
    http.get(opts, function (resp) {
        
        if (resp.statusCode >= 400) {
            return callback(new Error(resp.statusCode));
        }
        
        // TODO should we auto-redirect? should that be an option?
        //if (resp.statusCode >= 300) {
        //    get(resp.headers['location'], callback);
        //    return;
        //}
        
        var body = [];
        
        // TEMP TODO should this really be hardcoded?
        resp.setEncoding('utf8');
        
        resp.on('data', function (chunk) {
            body.push(chunk);
        });
        
        resp.on('end', function () {
            var data, err, bodyStr = body.join('');
            
            try {
                data = bodyStr ? JSON.parse(bodyStr) : null;
            } catch (e) {
                err = e;
            }
            
            callback(err, data);
        });
        
    }).on('error', function (err) {
        callback(err);
    });
    
};

exports.post = function post(url, data, callback) {
    callback(new Error("not implemented yet!"));
};