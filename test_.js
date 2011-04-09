var json = require('./');
var should = require('should');
var streamline = require('streamline');

var SERVER = require('./test_server');
var SERVER_PORT = 9999;
var SERVER_BASE = 'http://localhost:' + SERVER_PORT;

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
        url: 'http://google.com/',
        err: /SyntaxError/,
    },
    
    'Empty JSON': {
        url: SERVER_BASE + '/',
        exp: null,
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

// TODO this should be part of should.js (or replace should.exist)
function isdef(x) {
    return typeof x !== "undefined";
}

function test(name, data, _) {
    var act, err;
    
    started++;
    
    try {
        act = json.get(data.url, _);
    } catch (e) {
        err = e;
    }
    
    finished++;
    
    if (data.err) {
        should.exist(err, name + ' expected error, received result: ' + act);
        err.should.match(data.err, name + ' error doesn\'t match expected: ' + err + ' vs. ' + data.err);
        should.not.exist(act, name + ' received error *and* result: ' + act);
        return;
    }
    
    should.not.exist(err, name + ' threw error: ' + err);
    
    // TEMP act and data.exp can be null, so we can't be totally expressive here. see comments:
    
    // equivalent to "act should be defined" (but it can be null)
    isdef(act).should.be.truthy(name + ' received neither error nor result');
    
    // equivalent to "act should be of type object"
    // note that {...}, [...] and null are all type 'object'
    (typeof act === 'object').should.be.truthy(name + ' returned content is not an object or array: ' + act);
    
    if (isdef(data.exp)) {
        // equivalent to "act should match data.exp", but need to account for null
        should.deepEqual(act, data.exp, name + ' content doesn\'t match expected: ' + act + ' vs. ' + data.exp);
    }
}

SERVER.listen(SERVER_PORT, _);      // wait for it to start

var testFutures = [];
for (var name in TEST_CASES) {
    testFutures.push(
        test(name, TEST_CASES[name])
    );
}

streamline.flows.spray(testFutures).collectAll(_);

SERVER.close();
