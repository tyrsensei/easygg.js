var readline = require('readline').createInterface(process.stdin, process.stdout);
var shortid = require('shortid');
var io = require('socket.io-client');
var socket = io('http://localhost:3000');
var room;

socket.on('instance', function(data){
    console.log(data);
    room = data.id;
});
socket.on('rolled', function(data){
    console.log(data);
});
socket.on('not started', function(data){
    console.log('not started');
});
socket.on('ready players', function(data){
    console.log(data);
});
socket.on('instance ready', function(){
    console.log('Start your engines !');
});

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
            break;
        case 'roll':
        case 'ready':
            socket.emit(lineArr[0], {room: room});
            break;
        default:
            socket.emit(line);
    }
    readline.prompt();
}).on('close', function() {
    process.exit(0);
});