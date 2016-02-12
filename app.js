var readline = require('readline').createInterface(process.stdin, process.stdout);
var shortid = require('shortid');
var io = require('socket.io-client');
var socket = io('http://localhost:3000');

readline.setPrompt('message? > ');
readline.prompt();
readline.on('line', function(line) {
    var lineArr = line.split(' ');
    switch(lineArr[0]) {
        case 'player':
            socket.emit(lineArr[0], {nickname: lineArr[1]});
            break;
        case 'join':
            socket.emit(lineArr[0], {game: lineArr[1], instance: lineArr[2]});
            socket = io('http://localhost:3000'+lineArr[1]);
            break;
        case 'of':
            socket = io('http://localhost:3000'+lineArr[1]);
            break;
        default:
            socket.emit(line);
    }
    readline.prompt();
}).on('close', function() {
    process.exit(0);
});