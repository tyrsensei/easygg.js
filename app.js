var shortid = require('shortid');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

var Game = require('./lib/easygg-game');
var Player = require('./lib/easygg-player');
var Table = require('./lib/easygg-table');

app.easygg = require('./lib/easygg');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'bower_components')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Easygg init
app.easygg.addGame(
  '/test',
  new Game({name: 'test', minPlayers: 1, maxPlayers: 2}),
  {
    'game tables': function() {
      this.emit('game tables', {game:'/test', tables: app.easygg.getTables()});
    },
    'new game': function(data) {
      var table = new Table(data);
      var id = shortid.generate();
      app.easygg.updateTable(id, table);

      this.join(id);
      this.emit('new game', {tableId: id});
      this.emit('game tables', {game:'/test', tables: app.easygg.getTables()});
    },
    'join table': function(data) {
      app.easygg.getPlayers()[this.conn.id].tables.push(data);
      app.easygg.getTables()[data].players.push(this.conn.id);
      this.join(data.name);
    }
  }
);

// Socket.io callbacks
app.socketCallbacks = {
  'connected users': function() {
    this.emit('connected users', {number: app.easygg.getConnectedSockets()});
  },
  'games list': function() {
    this.emit('games list', {games: app.easygg.getGames()});
  },
  'user': function(data) {
    var player = new Player(data);
    app.easygg.updatePlayer(this.conn.id, player);
    this.emit('user updated');
  }
};

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
