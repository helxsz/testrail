var fs = require('fs');
var express = require('express');
var http = require('http');
var domain = require('domain');
var crypto = require('crypto');
var https = require('https');
//var passport = require('passport');
var app = express();
var ejs =  require('ejs');
var path = require('path');
var util = require("util");
var colors = require('colors');
 
var app = express();

var config = require('./config.js');
var colors = require('colors');
var webdir = '/web';
var mobiledir = '/mobile';


var RedisStore  = require("connect-redis")(express);
var sessionStore = new RedisStore({  client:  require("redis").createClient(config.redis.port,config.redis.host) },function() {
    	                  console.log('connect redis session success...');
});


exports.sessionStore= sessionStore;


//  allowed cross domain
var allowCrossDomain = function(req, res, next) {
  // Added other domains you want the server to give access to
  // WARNING - Be careful with what origins you give access to
  var allowedHost = [
    'http://localhost',
    'http://readyappspush.herokuapp.com/',
    'http://shielded-mesa-5845.herokuapp.com/'
  ];

  if(allowedHost.indexOf(req.headers.origin) !== -1) {
    //res.header('Access-Control-Allow-Max-Age', maxAge);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    next();
  } else {
    res.send(404);
  }
};


if (process.env.NODE_ENV == 'production'){
   console.log('on production env', config.port);
}else if(process.env.NODE_ENV == 'development'){
   console.log('on development env');
}else {
   console.log('there is nothing about it'.yellow); //,   process.env.NODE_ENV,process.env
}

app.configure('development',function(){
	app.set('db-uri',config.mongodb_development);
    app.use(express.static(__dirname+'/static'));
    app.use(express.static(__dirname+'/weibo'));	
    app.use(express.static(__dirname+'/public'));
	
	app.use(webdir, 	express.static(__dirname+webdir));
	app.use(mobiledir,	express.static(__dirname+mobiledir));
	console.log('app on development 11111'.yellow,config.port);
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	config.port = 80;
});

app.configure('production',function(){
	app.set('db-uri',config.mongodb_production);
	console.log('app on production'.yellow, config.port);
	app.use(express.errorHandler())
});

app.configure(function(){

    app.engine('.html', ejs.__express);
    app.set('view engine', 'html');
	app.set('views',__dirname+'/views');
	app.set('ejs',ejs);
	
	app.use(express.favicon(__dirname + '/public/favicon.ico'));
	
  // should be placed before express.static
    app.use(express.compress({
        filter: function (req, res) {
         return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
        },
        level: 9
    })); 	
	
	 // bodyParser should be above methodOverride
	app.use(express.bodyParser({uploadDir:__dirname+'/public/uploads',keepExtensions: true,limit: '50mb'}));
	app.use(express.methodOverride());
	//  // cookieParser should be above session
	app.use(express.cookieParser());
	 // express/mongo session storage  //  
    app.use(express.session({ 
					  cookie: { maxAge: 24 * 60 * 60 * 1000 }
    	              ,store: sessionStore
    	              ,secret: config.sessionSecret
					  ,key: 'express.sid'
					  ,clear_interval: 3600
    }));
	app.use(conditionalCSRF);
    app.use(function(req, res, next){
      res.locals.token = req.session._csrf;
	  res.locals.year = new Date().getFullYear();
      next();
    });
   
    //app.use(passport.initialize());
    //app.use(passport.session());	  

	// put at last	
	app.get('/version', function(req, res) {
        res.send('0.0.1');
    });	

	// error handling 
    app.use(logErrors);
    app.use(clientErrorHandler);
    app.use(errorHandler); 

    app.use(function (req,res, next) {
        var d = domain.create();
        d.on('error', function (err) {
          logger.error(err);
          res.statusCode = 500;
          res.json({sucess:false, messag: 'error in the server'});
          d.dispose();
        });
        d.add(req);
        d.add(res);
        d.run(next);
    });	
	app.use(function(req, res, next) {
       if(!req.secure) {
        }
        next();
    });
	app.set('trust proxy', true);
	
	app.use(app.router);	
    app.use(function(req, res, next){
        res.status(404); 
        if(req.xhr){
            res.send({ error: 'Not found' });
            return;		
		}		
        if (req.accepts('html')) {
            res.render('error/404', { url: req.url });
            return;
        }
        if (req.accepts('json')) {
            res.send({ error: 'Not found' });
            return;
        }
    });	
});

function conditionalCSRF(req, res, next) {
/*https://github.com/balderdashy/sails/blob/master/lib/hooks/csrf/index.js */
 var ua = req.header('user-agent');
  next();
  /*
  if (ua.indexOf("android") == -1) {
    //console.log('in csrf');
    //express.csrf();
	next();
  } else {
    //console.log('no csrf');
    next();
  }
  */
  //express.csrf(); 
}



/******************************************
           error handling   logging
*******************************************/



function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    console.log('send error to the client in json'.red,err);
    res.send(500, { error: 'Something blew up!' });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error/500', { error: err });
}



if (!module.parent) {
	app.listen(config.port,'0.0.0.0',function(){
	    console.log('Express started on port'.yellow,config.port);	  
	});
}
/******************************************
           terminate the server
*******************************************/
app.on('close', function () {
  console.log("Closed app".red);
 
  //redisClient.quit();
});
//  terminator === the termination handler.
function terminator(sig) {
   if (typeof sig === "string") {
      console.log('%s: Received %s - terminating Node server ...',Date(Date.now()), sig); 
       mongoose.connection.close();	  
      process.exit(1);
	  app.close();
   }
   console.log('%s: Node server stopped.'.red, Date(Date.now()) );
}

//  Process on exit and signals.
process.on('exit', function() { terminator(); });

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS',
 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGPIPE', 'SIGTERM'
].forEach(function(element, index, array) {
    process.on(element, function() { terminator(element); });
});



/*********************************************

        mongoose mongodb

**********************************************/

// mongodb mongoose
var mongoose = require('mongoose');
//mongoose.connect(config.mongodb.connectionString || 'mongodb://' + config.mongodb.user + ':' + config.mongodb.password + '@' + config.mongodb.server +'/' + config.mongodb.database);
//mongoose.createConnection('localhost', 'database', port, opts);
//var opts = { server: { auto_reconnect: false,poolSize: 10 }, user: 'username', pass: 'mypassword',replset: { strategy: 'ping', rs_name: 'testSet' } }
mongoose.connect(config.mongodb_development,function(err){
	if(err) console.log('connect mongodb error');
	else console.log('mongodb connect success');
});

mongoose.connection.on('open', function (err) {
      if (reconnTimer) { clearTimeout(reconnTimer); reconnTimer = null; }

	  mongoose.connection.db.admin().serverStatus(function(err, data) { 
	    if (err) {
	      if (err.name === "MongoError" && err.errmsg === 'need to login') {
	        console.log('Forcing MongoDB authentication');
	        mongoose.connection.db.authenticate(config.mongodb.user, config.mongodb.password, function(err) {
	          if (!err) return;
	          console.error(err);
	          process.exit(1);
	        });
	        return;
	      } else {
	        console.error(err);
	        process.exit(1);
	      }
	      
	      if (!semver.satisfies(data.version, '>=2.1.0')) {
	          console.error('Error: Uptime requires MongoDB v2.1 minimum. The current MongoDB server uses only '+ data.version);
	          process.exit(1);
	      };

          //setTimeout(connectWithRetry, 5000);	      
	    }
	    else{
	    	console.log('mongod db open success');
	    }
	  });
});


/****************************
   mongoose retry
   https://gist.github.com/taf2/1058819
****************************/
var reconnTimer = null;
 
function tryReconnect() {
  reconnTimer = null;
  console.log("try to connect: %d".grey, mongoose.connection.readyState);
  db = mongoose.connect(config.mongodb_development,function(err){
	if(err) console.log('connect mongodb error'.red);
	else console.log('mongodb connect success'.green);
  });
}

mongoose.connection.on('opening', function() {
  console.log("reconnecting... %d".red, mongoose.connection.readyState);
});

mongoose.connection.on('connecting', function (err) {

});

mongoose.connection.on('disconnecting', function (err) {

});

mongoose.connection.on('disconnected', function (err) {

});

mongoose.connection.on('close', function (err) {
  mongoose.connection.readyState = 0; // force...
  mongoose.connection.db.close(); // removeAllListeners("reconnect");
 
  if (reconnTimer) {
    console.log("already trying");
  }
  else {
    reconnTimer = setTimeout(tryReconnect, 500); // try after delay
  }
});

mongoose.connection.on('reconnected', function (err) {

});

mongoose.connection.on('error', function (err) {
    console.error(err);
});

/*******************************************
 mongodb close
********************************************/

/// file grid
var GridStore = mongoose.mongo.GridStore;
var db = mongoose.connection.db;

///////////////////////////////////////////////////// 
/// socket.io
var io = require('socket.io').listen(3000,{log: false, origins: '*:*'});
//Helper functions
function event_obj(event_name, data_obj) {
return { event: event_name,
         data: data_obj };
}

io.set('log level', config.socketio.level);
if (config.environment === 'production') {
	io.enable('browser client minification');  // send minified client
}

// http://stackoverflow.com/questions/11680997/socket-io-parse-connect-2-4-1-signed-session-cookie
// http://stackoverflow.com/questions/11709991/how-to-decode-a-cookie-secret-set-using-connects-cookiesession
// http://www.danielbaulig.de/socket-ioexpress/
var parseCookie = require('express/node_modules/connect').utils.parseCookie;

var connect = require('express/node_modules/connect')
, parseSignedCookie = connect.utils.parseSignedCookie
, cookie = require('express/node_modules/cookie');

io.configure(function () {
  io.set('authorization', function (handshakeData, callback) {
  	console.log('cookie   '+handshakeData.headers.cookie); 	
  	
    if (handshakeData.xdomain) {
      	 callback(null, true);
      } else {
          callback(null, true);
      }
  });
	io.set('heartbeat interval', 45);
	io.set('heartbeat timeout', 120); 
	io.set('polling duration', 20);
	
    io.set('close timeout', 60*60*24); // 24h time out
	io.set('transports', [
     'websocket', 'xhr-polling'
    ]);
});


chatClients = new Object();

function generateId(){
    var S4 = function () {
         return (((1 + Math.random()) * 0x10000) | 
                                     0).toString(16).substring(1);
     };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" +
                S4() + "-" + S4() + S4() + S4());
}


// create a client for the socket
function connect(socket, data){
 //generate clientId   http://udidu.blogspot.co.il/2012/11/chat-evolution-nodejs-and-socketio.html
 data.clientId = generateId();
 chatClients[socket.id] = data;
 socket.emit('ready', { clientId: data.clientId });

}
// management modulers


//load plugins
fs.exists('./plugins/index.js', function(exists) {
  if (exists) {
    require('./plugins').init(app, io, config, mongoose);
  };
});


fs.exists('./routes/railway_api.js', function(exists) {
  if (exists) {
    console.log('file exists');
    require('./routes/railway_api');
  }else console.log('no file exists');
});

	//setInterval(function(){	io.sockets.emit('train_activationMsg', { will: 'msg'});},2000);

app.get('/',function(req,res){
	console.log('login page');
	res.render('login');
});	
app.get('/login', function (req, res, next) {
	console.log("redirect to home");
	
		var source = req.headers['user-agent'];
		source = source.replace(/^\s*/, '').replace(/\s*$/, '');
        console.log("------------------"  +source);
		var agent = {};
		agent.mobile = (/mobile/i).test(source);
		agent.iphone = (/iPhone/).test(source);
		agent.ipad = (/iPad/).test(source);
		agent.ipod = (/iPod/).test(source);
		agent.android = (/Android/).test(source);
		agent.ios = agent.iphone || agent.ipad || agent.ipod;
		agent.mobile = agent.mobile || agent.android || agent.ios;	
	    console.log("ios   "+agent.ios);
		console.log('android  '+agent.android);
	    console.log('ipad  '+agent.iphone);
     res.redirect('railway2.html');
	/* 
	 if (req.session.uid) {
		 console.log('retrieve logined page');
		 res.redirect('signin.html');
	 } else {
		 console.log('retrieve login page');
		 res.redirect('signin.html');
	 }
	 */
});	

exports.app = app;
exports.mongoose = mongoose;
exports.io= io;
exports.GridStore = GridStore;

bootControllers(app);

// Bootstrap controllers
function bootControllers(app) {
	fs.readdir(__dirname + '/routes', function(err, files){
		if (err) throw err;
		files.map(function (file) {
            return path.join(__dirname+'/routes', file);
        }).filter(function (file) {
            return fs.statSync(file).isFile();
        }).forEach(function (file) {         
			var i = file.lastIndexOf('.');
            var ext= (i < 0) ? '' : file.substr(i);
			if(ext==".js")
			bootController(app, file);	
        });
	});
}

function bootController(app, file) {
	var name = file.replace('.js', '');
	//console.log( name);
	require( name);				
}
