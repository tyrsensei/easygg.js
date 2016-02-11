var readline = require('readline').createInterface(process.stdin, process.stdout);
var shortid = require('shortid');
var socket = require('socket.io-client')('http://localhost:3000');

readline.setPrompt('message? > ');
readline.prompt();
readline.on('line', function(line) {
    var lineArr = line.split(' ');
    switch(lineArr[0]) {
        case 'player':
            socket.emit(lineArr[0], {nickname: lineArr[1]});
            break;
        case 'join':
            socket.emit(lineArr[0], {});
            break;
        default:
            socket.emit(line);
    }
    readline.prompt();
}).on('close', function() {
    process.exit(0);
});