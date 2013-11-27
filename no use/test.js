var colors = require('colors');

var async = require('async');
var fs = require('fs');

var referenceModel = require('./model/rail_reference_model');
var scheduleModel = require('./model/schedule_model3');

var trainModel = require('./model/train_model');



function testSchedule(trainId){



    ///////////////////////////////////////////////////////////////////////////////////////////////////////
	var today = new Date();
	var day = today.getDay();
	
	scheduleModel.findByTrainAndTime(trainId,today,function(err, doc){	    
		if(err){}
		else{
			console.log("#findByTrainAndTime   of the train  ");
			if( doc != null)
			{
			    //var mul = redisClient.multi();
				//console.log("testSchedule     ".green+doc.CIF_train_uid+"   "+doc.schedule_end_date+"    "+doc.schedule_start_date+"   "+doc.schedule_days_runs );
				console.log("testSchedule  findByTrainAndTime   ".green+doc.train_uid+"   "+ doc.time_schedule.length);
				//console.log(doc.time_schedule);
				
				var a = new Object();
				a.train_uid = 'aiakkda';
				a.train_id = trainId;
				a.stanox = '38001';
				a.time = new Array();
				var b ;				
				
				var startTime,endTime;
                 try{
				   startTime = doc.time_schedule[0].departure;
				   endTime = doc.time_schedule[doc.time_schedule.length-1].arrival;
				console.log('starttime',startTime,'endTime',endTime);
				}catch(err){}

				
				async.forEachSeries(doc.time_schedule,
				  function(item,callback){
				       //console.log('time schedule 111111111'.green+"   "+item.tiploc_code );
					   referenceModel.findStanoxByTicloc(item.tiploc_code,function(err,data){ 
					      try{
						    //  console.log("time schedule data:".green+"   "+data.stanox+"   "+item.arrival+"  "+item.departure+"  "+item.pass+"  "+item.platform);					        
							//console.log('----------------------------------------------');							
							redisClient.lpush("train_schedule:"+trainId,JSON.stringify({"stanox":data.stanox,"arrival":item.arrival,"departure":item.departure,"pass":item.pass,"platform":item.platform}),redisClient.print);					
						    
							b = new Object();
							b.stanox = data.stanox;
							b.arrival = item.arrival;
							b.departure = item.departure;
							b.pass = item.pass;
							b.platform = item.platform;
							a.time.push(b);
						   
						   }catch(err2){
						  
						  }
					  });	
					  callback();
				  },
				  function(err){
				    //console.log('iterating done'.green);
					/*
					mul.exec(function (err, replies) {
                         console.log("testSchedule redis got " + replies.length + " replies");
                         replies.forEach(function (reply, index) {
                              //console.log("Reply " + index + ": " + reply.toString());
                        });
                    });
										
	                redisClient.rpop("train_schedule:"+trainId,function(err, data){					
					   console.log("pop data   ".green +"      "+trainId+"       "+data);
	                })
	                redisClient.rpop("train_schedule:"+trainId,function(err, data){					
					   console.log("pop data   ".green +"      "+trainId+"       "+data);
	                })
	                redisClient.rpop("train_schedule:"+trainId,function(err, data){					
					   console.log("pop data   ".green +"      "+trainId+"       "+data);
	                })			

                    redisClient.lrange( "train_schedule"+trainId, 0, -1,function(err, schedules){					
					   var len = schedules == null ? 0 : schedules.length;
					   console.log('lange  train schedule ',trainId,len);
					    schedules.forEach(function(sche,index){
						    //console.log();
						})
					})	
                   */
					
				});
			}
			else
			{
			   console.log('findOneSchedule is null'.red,trainId);
			   /*
			   scheduleModel.ScheduleModel.count(function(err,data){
    	           console.log("schedule count %d".green,data);
	           });
               */			   
            }			   
		}
	 });
    /**/
}


testSchedule("Y63348");  
testSchedule("Y63347"); //
testSchedule("Y64058");
testSchedule("Y64158");  //
testSchedule("Y63662");
//Y63030


setInterval(function(){

   //trainModel.findTrain()
   trainModel.clearTrainCollection(function(){});
    var date = new Date();
	//console.log(date.getHours(),date.getMinutes() );
	var s = date.getHours()*60+date.getMinutes(); //{"start_time": {"$lte": s},"end_time":{"$gte":s}
    trainModel.findTrain({},function(err,docs){
	
	   if(err) console.log('err');
	   else{
	   //console.log('docs       '+docs.length);
/*		   
	    for(var i=0;i<docs.length;i++){
	       console.log('`````````````````````````````'.red,docs[i].train_id, docs[i].train_uid, docs[i].geo);		   
	   
		   scheduleModel.findOneScheduleTimeline({'train_uid':train_uid},function(err, doc){
		        if(err){				
				}else{
				    console.log(doc.time_schedule.length);
					for(var i=0;i<doc.time_schedule.length;i++){
					   console.log();
					}
					//redisClient.lpush("train_schedule:"+trainId,JSON.stringify({"stanox":data.stanox,"arrival":item.arrival,"departure":item.departure,"pass":item.pass,"platform":item.platform}),redisClient.print);					
				}
		   });
	   
	    }*/	
	   }
	})
},3000);





/************************************************

TRAIN SCHEDULE DATA

- Type: Bucket name in section 4.6 SCHEDULE (directory).
- Day: The user needs to use this parameter to specify the day to download for the updates. Please
see examples below. If a user wishes to download more than one day will have to do it in different
requests.

Example 1: Downloading Monday update for all TOCs:
https://datafeeds.networkrail.co.uk/ntrod /CifFileAuthenticate?type=CIF_ALL_UPDATE_DAILY&day=tocupdate-
mon
Example 2: Downloading full daily for Northern Rail:
https://datafeeds.networkrail.co.uk/ntrod /CifFileAuthenticate?type=CIF_ED_FULL_DAILY&day=toc-full
*************************************************/
// CIF_HE_UPDATE_DAILY, toc-update-mon/ toc-update-tue/toc-update-wed/ toc-update-thu/ toc-update-fri/ toc-update-sat/ toc-update-sun
// CIF_HE_FULL_DAILY , oc-full
/*
var username = 'Jordy@connectedliverpool.co.uk';
var password = 'Newyork%212+';
var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
var SCHEDULE_URL = "https://datafeeds.networkrail.co.uk/ntrod/CifFileAuthenticate?type=CIF_HE_TOC_FULL_DAILY&day=toc-full";

var request = require("request");
request(
    {
        url : SCHEDULE_URL,
        headers : {
            "Authorization" : auth
        }
    },
    function (error, response, body) {
        // Do more stuff with 'body' here
		console.log(body);
    }
);

//////////////////////////////////////

var cheerio = require("cheerio");
request({
  uri: "http://www.jspro.com",
}, function(error, response, body) {
  var $ = cheerio.load(body);
  $(".entry-title > a").each(function() {
    var link = $(this);
    var text = link.text();
    var href = link.attr("href");
    console.log(text + " -> " + href);
  });
});
*/
/***************************
               io connection with user 
****************************/

var users = io.of('/users').on('connection', function (socket) {
	var user;
	
	socket.on('add', function(username, img, area){
	if(!usernameExists(area, username)){
		setUser(username, img, area, 7200);
	}
		//var test = new User(username, img, area, socket.id);
		socket.join(area);
		user = new User(username, img, area, socket.id);
		socket.set('user', user);
		
		});
	
	socket.on('addVote', function(fs){
		if(user !== null){
				setVote(user.username, user.area, fs, 7200);
				io.of('/users').in(user.area).emit('vote', {username: user.username, img: user.img, fs: fs});
				//socket.emit('vote', {username: user.username, img: user.img, fs: fs});
		}
	});
	
	socket.on('getVotes', function(){
		var area = user.area;
			client.smembers(area+':votes', function(err, votes){
				if(votes != null){
					votes.forEach(function(key){
						client.get(key, function(err, username){
							client.get(key + ':vote', function(err, vote){
								client.get(key + ':img', function(err, img){
									socket.emit('vote', {username: username, img: img, fs: JSON.parse(vote)});
								});
							});
						});
					});
				}
			});
	});
	
	socket.on('disconnect', function(client){
		socket.get('user', function(err, suser){
			if(suser !== null){
				socket.leave(suser.area);
				removeUser(suser.username, suser.area, function(){
				});
			}
		});
	});
	
});


usernameExists = function(area, username){
	client.get(area+':users:'+username, function(err, data){
		if(data == null){
			return false;
		}else{
			return true;
		}
	});
};



var User = function(username, img, area, socketid){
	this.username = username;
	this.img = img;
	this.area = area;
	this.socketid = socketid;
};

function setVote(username, area, fs, expire){
	redisClient.set(area+':users:' + username + ':vote', JSON.stringify(fs));
	redisClient.sadd(area+':votes', area+':users:' + username);
	//add the set to the expire set
	redisClient.sadd('expireKeys', area+':votes');
	//set a timer
	redisClient.set(area+':votes:timer', expire);
	redisClient.expire(area+':votes:timer', expire);
};

function setUser(username, img, area, expire){
	redisClient.set(area+':users:' + username, username);
	redisClient.expire(area+':users:' + username, expire);
	redisClient.set(area+':users:' + username + ':img', img);
	redisClient.expire(area+':users:' + username + ':img', expire);
	//set a timer
	redisClient.set(area+':users:timer', expire);
	redisClient.expire(area+':users:timer', expire);
	redisClient.sadd(area+':users', area+':users:' + username);
	//add the set to the expire set
	redisClient.sadd('expireKeys', area+':users');
};

function removeUser(username, area, callback){
	//this doesn't do anything right now
	redisClient.srem(area+':users', area+':users:' + username);
	callback();
};

/**/


/**
 * Retrieve the current position.
 * @param params Optional options object for enabling higher accuracy.
 * @param successCB Success callback.
 * @param errorCB Error callback.
 */
function getCurrentPosition (params, successCB, errorCB){
	var error = {};
	var geoip = null;
	var http = require('http');
	var freegeoip = http.createClient(80, 'freegeoip.net');
	var request = freegeoip.request('GET', '/json/', {'host': 'freegeoip.net'});
	request.end();
	request.on('response', function (response) {
		// console.log('STATUS: ' + response.statusCode);
		// console.log('HEADERS: ' + JSON.stringify(response.headers));
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			console.log('geoip chunk: ' + chunk);
			try { 
				geoip = JSON.parse(chunk);
			}
			catch(err) {
				error.code = 2; 
				error.message = "failed getting IP address based geolocation";
				console.log("error: " + JSON.stringify(error));
				errorCB(error);
				return;
			}

			var coords = new Object;
			coords.accuracy = 1000;
			if (params && params.enableHighAccuracy) {
				coords.accuracy = 1;
			}
			coords.altitude = counter++;
			coords.altitudeAccuracy = null;
			coords.heading = null;
			coords.speed = Math.floor(Math.random()*1000)/10;
			if (geoip) {
				if (geoip.latitude) coords.latitude = parseFloat(geoip.latitude); else coords.latitude = null;
				if (geoip.longitude) coords.longitude = parseFloat(geoip.longitude); else coords.longitude = null;
			}	
			var position = new Object;
			position.coords=coords;
			position.timestamp = new Date().getTime();

			if ((position.coords.latitude) && (position.coords.longitude)) {
				successCB(position);
				return;
			}
			else {
				error.code = 2; 
				error.message = "failed getting IP address based geolocation";
				console.log("error: " + JSON.stringify(error));
				errorCB(error);
				return;
			}

		});	 
	});			
}

exports.getCurrentPosition = getCurrentPosition;








// program compiler   http://stackoverflow.com/questions/6158933/http-post-request-in-node-js
/* 
// We need this to build our post string
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

function PostCode(codestring) {
  // Build the post string from an object
  var post_data = querystring.stringify({
      'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
      'output_format': 'json',
      'output_info': 'compiled_code',
        'warning_level' : 'QUIET',
        'js_code' : codestring
  });

  // An object of options to indicate where to post to
  var post_options = {
      host: 'closure-compiler.appspot.com',
      port: '80',
      path: '/compile',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': post_data.length
      }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
      });
  });

  // post the data
  post_req.write(post_data);
  post_req.end();

}

// This is an async file read
fs.readFile('LinkedList.js', 'utf-8', function (err, data) {
  if (err) {
    // If this were just a small part of the application, you would
    // want to handle this differently, maybe throwing an exception
    // for the caller to handle. Since the file is absolutely essential
    // to the program's functionality, we're going to exit with a fatal
    // error instead.
    console.log("FATAL An error occurred trying to read in the file: " + err);
    process.exit(-2);
  }
  // Make sure there's data before we post it
  if(data) {
    PostCode(data);
  }
  else {
    console.log("No data to post");
    process.exit(-1);
  }
}); 
  
 
*/

/***************************
new Buffer接收到base64编码，不能带data:URL，而使用canvas . toDataURL()导出的base64编码会带data:URL，所以需要先过滤掉
类似这样的一段“data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0”
需过滤成：“iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0”
****************************/

//base64  POST for image
app.post('/upload', function(req, res){
    //接收前台POST过来的base64
    var imgData = req.body.imgData;
    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile("out.png", dataBuffer, function(err) {
        if(err){
          res.send(err);
        }else{
          res.send("保存成功！");
        }
    });
});

app.get('/upload.html', function(req,res){
    res.render('upload');
});
// 移动文件需要使用fs模块

app.post('/file-upload', function(req, res) {
    // 获得文件的临时路径
    var tmp_path = req.files.thumbnail.path;
    console.log("temp_path->"+tmp_path);
    // 指定文件上传后的目录 - 示例为"images"目录。
    var target_path = './public/images/' + req.files.thumbnail.name;
    // 移动文件
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // 删除临时文件夹文件,
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes' + "target_path" + target_path);
        });
    });
});


/******************************
 * 
 * utility function
 * 
 ******************************/

var UserAgent = function() {

	return function(req, res, next) {
		var source = req.headers['user-agent'];
		source = source.replace(/^\s*/, '').replace(/\s*$/, '');

		var agent = {};
		agent.mobile = (/mobile/i).test(source);
		agent.iphone = (/iPhone/).test(source);
		agent.ipad = (/iPad/).test(source);
		agent.ipod = (/iPod/).test(source);
		agent.android = (/Android/).test(source);
		agent.ios = agent.iphone || agent.ipad || agent.ipod;
		agent.mobile = agent.mobile || agent.android || agent.ios;

		req.useragent = agent;
		res.locals("useragent", agent);
	};
};

exports = module.exports = new UserAgent();

function checkAgent(req){
	var user_agent = req.header('user-agent');
	var ip = req.header('x-forwared-for') || req.connection.remoteAddress;

	console.log(user_agent,"   ",/mobile/i.test(user_agent));
	console.log(ip);
}

function is_mobile(req){
	var ua = req.header('user-agent');
	if(/mobile/i.test(ua)) return true;
	else return false;
}

function validateEmail(email) {
    // First check if any value was actually set
    if (email.length == 0) return false;
    // Now validate the email format using Regex
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    return re.test(email);
}


/*
var http = require("http");
var https = require("https");
 
function getJSON(options, onResult){
    console.log("rest::getJSON");
    var prot = options.port == 443 ? https : http;
    var req = https.request(options, function(res)
    {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            output += chunk;
        });
        res.on('end', function() {
            //var obj = JSON.parse(output);
			console.log(output);
			var obj = output;
            onResult(res.statusCode, obj);
        });
    });
	
	// not working
	req.on('socket', function (socket) {
       socket.setTimeout(2000);  
       socket.on('timeout', function() {
	      console.log('timeout');
          req.abort();
       });
    });
	
    req.on('error', function(err) {
        //res.send('error: ' + err.message);
    });
    req.end();
};

var options = {
    host: 'datafeeds.networkrail.co.uk',
    port: 443,
    path: '/ntrod/CifFileAuthenticate?type=CIF_HE_FULL_DAILY&day=toc-full',
    method: 'GET',
	'Authorization': auth,
    headers: {
        'Content-Type': 'application/json'
    }
};
exports.getJSON = getJSON;
getJSON(options, function(statusCode, result){
            // I could work with the result html/json here.  I could also just return it
			var re ;
            console.log("onResult: (" + statusCode + ")" +result);
			if(statusCode == 200)  re = JSON.stringify(result);
            //res.statusCode = statusCode;
            //res.send(result);
});
*/