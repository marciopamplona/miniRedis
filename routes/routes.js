const commands = require('../commands.js');

var appRouter = function (app) {

    app.get("/", function(req, res) {
        var options = {
            root: __dirname+'/../',
            dotfiles: 'deny'
        }
        res.status(200).sendFile('readme.txt', options, function(err){
            if (err){
                console.log(err);
            }
        });
    });

    app.get("/:key", function(req, res) {
        var key = req.params.key;
        var response = commands.cmdReader(`GET ${key}\n`)
        res.status(200).send(response);
    });

    app.put("/:key", function(req, res) {
        var key = req.params.key;
        var value = req.body.value;
        var response = commands.cmdReader(`SET ${key} ${value}\n`)
        res.status(200).send(response);
    })

    app.put("/:key/:seconds", function(req, res) {
        var key = req.params.key;
        var value = req.body.value;
        var seconds = req.params.seconds;
        var response = commands.cmdReader(`SET ${key} ${value} EX ${seconds}\n`)
        res.status(200).send(response);
    })

    app.delete("/:key", function(req, res) {
        var key = req.params.key
        var response = commands.cmdReader(`DEL ${key}\n`)
        res.status(200).send(response);
    })

    app.get("/sys/dbsize", function(req, res) {
        var response = commands.cmdReader(`DBSIZE\n`)
        res.status(200).send(response);
    });

    app.get("/sys/printall", function(req, res) {
        var response = commands.cmdReader(`PRINTALL\n`)
        res.status(200).send(response);
    });

    app.post("/zadd/:key/:score", function(req, res) {
        var key = req.params.key;
        var score = req.params.score;
        var value = req.body.value;
        var response = commands.cmdReader(`ZADD ${key} ${score} ${value}\n`)
        res.status(200).send(response);
    });

    app.post("/incr/:key", function(req, res) {
        var key = req.params.key;
        var response = commands.cmdReader(`INCR ${key}\n`)
        res.status(200).send(response);
    });

    app.get("/zcard/:key", function(req, res) {
        var key = req.params.key;
        var response = commands.cmdReader(`ZCARD ${key}\n`)
        res.status(200).send(response);
    });

    app.get("/zrank/:key/:member", function(req, res) {
        var key = req.params.key;
        var member = req.params.member;
        var response = commands.cmdReader(`ZRANK ${key} ${member}\n`)
        res.status(200).send(response);
    });

    app.get("/zrange/:key/:start/:stop", function(req, res) {
        var key = req.params.key;
        var start = req.params.start;
        var stop = req.params.stop;
        var response = commands.cmdReader(`ZRANGE ${key} ${start} ${stop}\n`)
        res.status(200).send(response);
    });

}
  
module.exports = appRouter;
