var redisClient = require('../app').redis;
exports.stat = function(req,res,next){
	if (redisClient && redisClient.connected) {
	     var appName = "railway"//lookup_app(options.port);
	
	if (appName) {
	    var ip = req.headers["x-forwarded-for"];
	    var referer = req.headers.referer;
	    var date = new Date();
	    var month = date.getUTCMonth() + 1;
	    var day = date.getUTCFullYear() + "-" + month + "-" + date.getUTCDate();
	    var urlhash;
		
	    var keys = [
	    	"hits-by-app:" + appName,
	    	"hits-by-day:" + day,
		    "hits-by-app-by-day:" + appName + ':' + day,
		    "hits-by-app-by-month:" + appName + ':' + month, 
		    "hits-by-ip:" + ip,
		    "hits-by-ip-by-day:" + ip + ':' + day
	    ];
 
	    if (referer) {
	 	    urlhash = crypto.createHash("md5").update(referer).digest("hex");
		    keys.push("hits-by-url:" + urlhash); 
		    keys.push("hits-by-url-by-day:" + urlhash + ":" + day);
		    redisClient.set("url:" + urlhash, referer);
	    }
		
	    for (i in keys) {
	    	redisClient.incr(keys[i]);
	    }
	}
  }

}