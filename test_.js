var json = require('./');
var should = require('should');

var TEST_CASES = {
    
    'Non-existent': {
        url: 'http://i.certainly.dont.exist.example.com',
        err: /ENOTFOUND/,
    },
    
    'Non-200': {
        url: 'http://json.org/404',
        err: /404/,
    },
    
    'Non-JSON': {
        url: 'http://example.com/',
        err: /SyntaxError/,
    },
    
    // via http://www.flickr.com/services/api/response.json.html
    'Flickr': {
        url: 'http://www.flickr.com/services/rest/?method=flickr.test.echo&format=json&api_key=fe492f862a480692bb7905def6c9e2ca&nojsoncallback=1',
        exp: {
            method: {
                _content: 'flickr.test.echo',
            },
            format: {
                _content: 'json',
            },
            api_key: {
                _content: 'fe492f862a480692bb7905def6c9e2ca',
            },
            nojsoncallback: {
                _content: '1',
            },
            stat: 'ok',
        },
    },
    
    // via http://dev.twitter.com/doc/get/statuses/show/:id
    'Twitter': {
        url: 'https://api.twitter.com/1/statuses/show/20.json',
        // too much here (and may change) to test deep equality; assume it's valid
    },
    
    // via http://zoom.it/pages/api/reference/v1/content/get-by-id
    'Zoom.it': {
        url: 'http://api.zoom.it/v1/content/h',
        exp: {
            id: 'h',
            url: 'http://upload.wikimedia.org/wikipedia/commons/3/36/SeattleI5Skyline.jpg',
            ready: true,
            failed: false,
            progress: 1,
            shareUrl: 'http://zoom.it/h',
            embedHtml: '<script src="http://zoom.it/h.js?width=auto&height=400px"></script>',
            dzi: {
                url: 'http://cache.zoom.it/content/h.dzi',
                width: 4013,
                height: 2405,
                tileSize: 254,
                tileOverlap: 1,
                tileFormat: 'jpg',
            },
        },
    },
    
};

var started = 0,
    finished = 0;

process.on('exit', function () {
    var remaining = started - finished;
    remaining.should.equal(0, remaining + ' callbacks never fired!');
});

function test(name, data) {
    started++;
    json.get(data.url, function (err, act) {
        finished++;
        
        if (data.err) {
            should.exist(err, name + ' expected error, received result: ' + act);
            err.should.match(data.err, name + ' error doesn\'t match expected: ' + err + ' vs. ' + data.err);
            should.not.exist(act, name + ' received error *and* result: ' + act);
            return;
        }
        
        should.not.exist(err, name + ' threw error: ' + err);
        should.exist(act, name + ' received neither error nor result');
        
        act.should.be.a('object', name + ' returned content is not an object or array: ' + act);
        
        if (data.exp) {
            act.should.match(data.exp, name + ' content doesn\'t match expected: ' + act + ' vs. ' + data.exp);
        }
    });
}

for (var name in TEST_CASES) {
    test(name, TEST_CASES[name]);
}
