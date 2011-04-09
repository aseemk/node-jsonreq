/*** Generated by streamline --lines-mark 0.1.11 - DO NOT EDIT ***/

var __global = typeof global !== 'undefined' ? global : window;
function __cb(_, fn) { var ctx = __global.__context; return function(err, result) { __global.__context = ctx; if (err) return _(err); return fn(null, result); } }
function __future(fn, args, i) { if (!fn) throw new Error("anonymous function requires callback"); var done, err, result; var cb = function(e, r) { done = true; err = e, result = r; }; args = Array.prototype.slice.call(args); args[i] = function(e, r) { cb(e, r); }; fn.apply(this, args); return function(_) { if (typeof _ !== "function") throw new Error("future requires callback"); if (done) _.call(this, err, result); else cb = _.bind(this); }.bind(this); }
function __propagate(_, err) { try { _(err); } catch (ex) { __trap(ex); } }
function __trap(err) { if (err) { if (__global.__context && __global.__context.errorHandler) __global.__context.errorHandler(err); else console.error("UNCAUGHT EXCEPTION: " + err.message + "\n" + err.stack); } }
            (function(_) {
              var __ = (_ = (_ || __trap));
/*     1 */   var json = require("./");
/*     2 */   var should = require("should");
/*     3 */   var streamline = require("streamline");
/*     5 */   var SERVER = require("./test_server");
/*     6 */   var SERVER_PORT = 9999;
/*     7 */   var SERVER_BASE = ("http://localhost:" + SERVER_PORT);
/*     9 */   var TEST_CASES = {
/*    11 */     "Non-existent": {
/*    12 */       url: "http://i.certainly.dont.exist.example.com",
/*    13 */       err: /ENOTFOUND/
                },
/*    16 */     "Non-200": {
/*    17 */       url: "http://json.org/404",
/*    18 */       err: /404/
                },
/*    21 */     "Non-JSON": {
/*    22 */       url: "http://google.com/",
/*    23 */       err: /SyntaxError/
                },
/*    26 */     "Empty JSON": {
/*    27 */       url: (SERVER_BASE + "/"),
/*    28 */       exp: null
                },
/*    32 */     Twitter: {
/*    33 */       url: "https://api.twitter.com/1/statuses/show/20.json"
                },
/*    38 */     "Zoom.it": {
/*    39 */       url: "http://api.zoom.it/v1/content/h",
/*    40 */       exp: {
/*    41 */         id: "h",
/*    42 */         url: "http://upload.wikimedia.org/wikipedia/commons/3/36/SeattleI5Skyline.jpg",
/*    43 */         ready: true,
/*    44 */         failed: false,
/*    45 */         progress: 1,
/*    46 */         shareUrl: "http://zoom.it/h",
/*    47 */         embedHtml: "<script src=\"http://zoom.it/h.js?width=auto&height=400px\"></script>",
/*    48 */         dzi: {
/*    49 */           url: "http://cache.zoom.it/content/h.dzi",
/*    50 */           width: 4013,
/*    51 */           height: 2405,
/*    52 */           tileSize: 254,
/*    53 */           tileOverlap: 1,
/*    54 */           tileFormat: "jpg"
                    }
                  }
                }
              };
/*    61 */   var started = 0, finished = 0;
/*    64 */   process.on("exit", function __1() {
/*    65 */     var remaining = (started - finished);
/*    66 */     remaining.should.equal(0, (remaining + " callbacks never fired!"));
              });
/*    70 */   function isdef(x) {
/*    71 */     return (typeof x !== "undefined");
              };
/*    74 */   function test(name, data, _) {
                if (!_) {
                  return __future(test, arguments, 2);
                }
              ;
                var __ = _;
/*    75 */     var act, err;
/*    77 */     started++;
                return function(__) {
                  return function(_) {
                    try {
/*    80 */           return json.get(data.url, __cb(_, function(__0, __1) {
/*    80 */             act = __1;
                        return __();
                      }));
                    } catch (e) {
                      return __propagate(_, e);
                    };
                  }(function(e, __result) {
                    try {
                      if (e) {
/*    82 */             err = e;
                      }
                       else return _(null, __result)
                    ;
                    } catch (e) {
                      return __propagate(_, e);
                    };
                    return __();
                  });
                }(function() {
                  try {
/*    85 */         finished++;
/*    87 */         if (data.err) {
/*    88 */           should.exist(err, ((name + " expected error, received result: ") + act));
/*    89 */           err.should.match(data.err, ((((name + " error doesn't match expected: ") + err) + " vs. ") + data.err));
/*    90 */           should.not.exist(act, ((name + " received error *and* result: ") + act));
                      return _(null);
                    }
                  ;
/*    94 */         should.not.exist(err, ((name + " threw error: ") + err));
/*    99 */         isdef(act).should.be.truthy((name + " received neither error nor result"));
/*   103 */         ((typeof act === "object")).should.be.truthy(((name + " returned content is not an object or array: ") + act));
/*   105 */         if (isdef(data.exp)) {
/*   107 */           should.deepEqual(act, data.exp, ((((name + " content doesn't match expected: ") + act) + " vs. ") + data.exp));
                    }
                  ;
                    return __();
                  } catch (e) {
                    return __propagate(_, e);
                  };
                });
              };
/*   111 */   return SERVER.listen(SERVER_PORT, __cb(_, function() {
/*   113 */     var testFutures = [];
/*   114 */     for (var name in TEST_CASES) {
/*   115 */       testFutures.push(test(name, TEST_CASES[name]));
                };
/*   120 */     return streamline.flows.spray(testFutures).collectAll(__cb(_, function() {
/*   122 */       SERVER.close();
                  return __();
                }));
              }));
            })();
