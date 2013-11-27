
// TODO - Write a better csrf module lol
// hacked this together for the tutorial

var crypto = require('crypto');

var generateToken = function(len) {
	console.log('generateToken');
  return crypto.randomBytes(Math.ceil(len * 3 / 4))
    .toString('base64')
    .slice(0, len);
  
};
function defaultValue(req) {
	console.log('header csrf   '+req.headers['x-csrf-token']);
  return (req.body && req.body._csrf)
    || (req.query && req.query._csrf)
    || (req.headers['x-csrf-token']);
}
var checkToken = function(req, res, next){
    var token = req.session._csrf || (req.session._csrf = generateToken(24));
    console.log("session token  "+req.session._csrf);
    //console.log(token);
    if ('GET' == req.method || 'HEAD' == req.method || 'OPTIONS' == req.method) {
    	console.log('return next method');
    	return next();
    }
    var val = defaultValue(req);
    
    if(val !=token){
    	console.log('auth false');
    }
    next();
    /*  problem is
    if (val != token) return next(function(){
    	console.log('auth false');
        //res.send({auth: false});
    });
    next();
    */
}
var newToken = function(req, res, next) {
  var token = req.session._csrf || (req.session._csrf = generateToken(24));
  next();
}
module.exports = {
    check: checkToken,
    generate: newToken 
};

