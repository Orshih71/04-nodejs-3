const http = require('http');
const {Subject} = require('rxjs');
const {fork} = require('child_process');
const qs = require('querystring');
const url = require('url');
const subject = new Subject();

function createProcess({req, res}) {
    const {n} = url.parse(req.url, true).query;
    const childP = fork('fib.js');
    childP.send(n);
    childP.on('message', fib => res.end(fib));
}
subject.subscribe(createProcess);

http.createServer(function (req, res) {
    subject.next({req: req, res: res});
}).listen(8080, () => console.log("Listening on 8080 using child process"));