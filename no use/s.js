// node samples/sample.js

var csv = require('csv');
var fs = require('fs');
var colors = require('colors');

/*



parser = csv()
.from.stream(  fs.createReadStream(__dirname+'/uploads/RailReferences.csv') , {columns: true}   )
//.to.stream(process.stdout, {end: false})
.on('record', function(row,index){
  //console.log('#'+index+' '+JSON.stringify(row));
  console.log('#'+index+' '+row.AtcoCode.green+'    '+row.TiplocCode.green+'     '+row.CrsCode.green+'    '+row.StationName.green+'    '+row.Easting.green+'    '+row.Northing.green);
})
.on('end',function(error){
  process.stdout.write("\n");
})
.on('error',function(error){
  console.log(error.message.red);
});
*/


  /*
var JSONStream = require('JSONStream');

var fs = require ('fs')
  , join = require('path').join
  , file = join(__dirname, 'uploads','test_schedule.json')   //    //'all_npm.json'  CIF_HE_TOC_FULL_DAILY_toc-full.json
  ,  JSONStream = require('JSONStream');

var called = 0;
//var parser = JSONStream.parse(['rows', true]);
var parser = JSONStream.parse([/./]);  
fs.createReadStream(file).pipe(parser);

parser.on('error', function(err) {
        console.log(err);
});

parser.on('data', function (data) {
  called ++;  
  console.log(data.main_train_uid+"   "+data.main_train_uid+"  "+data.assoc_train_uid+" "+data.assoc_start_date+"  "+data.assoc_end_date+"   "+data.assoc_days
               +"   "+data.date_indicator+"   "+data.location+"   "+data.CIF_stp_indicator);

  console.log(data.CIF_stp_indicator+"  "+data.applicable_timetable+"  "+data.atoc_code+"  "+data.schedule_days_runs+"   "+data.schedule_end_date+"  "+data.schedule_start_date);
  //console.log(data.schedule_segment.CIF_speed+"   "+data.schedule_segment.CIF_train_class);
  //console.log(data.schedule_segment+"   "+ JSON.parse(data.schedule_segment));
  
  //var data =  JSON.parse(JSON.stringify(data.schedule_segment)) ; //JSON.stringify(data.schedule_segment);
  //console.log(data);
})

parser.on('end', function () {
  ended = true;
  console.log(called);
  
  console.log('hello'.green); // outputs green text
  console.log('i like cake and pies'.underline.red) // outputs red underlined text
})
*/

/*







*/


/*

redis connect

*/
var config = require('./config.js');
/// redis 
var redis_ip=config.redis.host;  
var redis_port=config.redis.port; 

var redis = require("redis"),
redisClient = redis.createClient(redis_port,redis_ip); 
/*
redisClient.auth(config.opt.redis_auth, function(result) {
	console.log("Redis authenticated.");  
})

redisClient.on("error", function (err) {  
     console.log("redis Error " + err.red);  
     return false;  
});    

redisClient.on('connect',function(err){
	console.log('redis connect success');
});


var JSONStream = require('JSONStream');
var fs = require ('fs')
  , join = require('path').join
  , file = join(__dirname, 'uploads','data.json')   //    //'all_npm.json'  CIF_HE_TOC_FULL_DAILY_toc-full.json
  ,  JSONStream = require('JSONStream');
  

*/ 


/*
*/




/*
async.series({
    inputTicloc: function(callback){
        
	  callback(null, 1);
    },
    inputLocation: function(callback){
	
	       console.log(' input location');
           
			var called = 0;
            var parser = JSONStream.parse([/./]);  
            fs.createReadStream(file).pipe(parser);

            parser.on('error', function(err) {
                console.log(err);
            });

            parser.on('data', function (data) {
                called ++;  
                console.log(data.station+"   "+data.lat+"  "+data.lng+" "+data.stanox);
                //redisClient.hmset(data.stanox, "lat", data.lat,"lng",data.lng,"station",data.station);
            });

            parser.on('end', function () {
                ended = true;
                console.log(called);
				
                redisClient.hkeys(36060, function (err, replies) {
                  if (err) {
                    return console.error("error response - " + err);
                  }
                  console.log(replies.length + " replies:");
                  replies.forEach(function (reply, i) {
                     console.log("    " + i + ": " + reply+"   ");
                  });
               }); 
               redisClient.hget(36060,'lat', function (err, data) {
                if (err) {
                   return console.error("error response - " + err);
                }
                console.log(" replies:"+data);
              });
              			  
           });
           callback(null, 1);
    }

},
function(err, results) {



});
*/


// Set a value with an expiration
//client.set('string key', 'Hello World', redis.print);
// Expire in 3 seconds
//client.expire('string key', 3);
// client.srem  client.sadd  SMEMBERS   SISMEMBER (0/1)

/**
 * test.js
 * A simple trie to suggest frequent phrases

var t = require("./trie");
 
var trie = new t.Trie();
 
trie.addPhrase('Emma Watson');
trie.addPhrase('Airline Baby Ban');
trie.addPhrase('Vitamin D Study');
trie.addPhrase('Vitamin D Sources');
trie.addPhrase('Vitamin D Sources');
trie.addPhrase('Vitamin D Sources');
trie.addPhrase('Blood Sugar');
trie.addPhrase('Bathroom Cleaning Tips');
 
 
trie.suggest('vitamin d', function(err, reply) {
    if(err) console.log(err);
    if(reply)  console.log(reply);
    trie.end();
});
 */


/*
    redisClient.lpush("train_schedule:"+1,JSON.stringify({"stanox":"stanox","arrival":"stanox","departure":"stanox","pass":"stanox","platform":"stanox"}),redisClient.print);							
	redisClient.rpop("train_schedule:"+1,function(err, data){					

					   console.log("pop data   ".green +"      "+1+"       "+JSON.parse(data).stanox);
	})
	
	

	

// http://redis.io/commands#sorted_set
// https://developer.mozilla.org/en-US/docs/Mozilla/Redis_Tips
//https://github.com/mranney/node_redis
function now() { return (new Date()).getTime() / 1000 }
function print(err, results) { console.log(JSON.stringify(results, null, 2)) }
redisClient.zadd('last-login', now(), 'lloyd');
redisClient.zadd('last-login', now(), 'jparsons');
redisClient.zadd('last-login', now(), 'zarter');
redisClient.zadd('last-login', now(), 'lloyd');  // he logged in again! w00t!


redisClient.zrange('last-login', 0, -1,'WITHSCORES', print); // small - big 
redisClient.zrevrange('last-login', 0, -1,'WITHSCORES', function (err, response) {
        if (err) throw err;
        console.log('example2', response[0],response[1]);
        // write your code here
}); // big - small

var an_hour_ago = now() - (60 * 60);
redisClient.zrevrangebyscore('last-login', an_hour_ago, Infinity, print);

//https://developer.mozilla.org/en-US/docs/HTML/Canvas/Tutorial?redirectlocale=en-US&redirectslug=Canvas_tutorial
//https://developer.mozilla.org/en-US/docs/HTML/Canvas/Drawing_Graphics_with_Canvas
*/
/*
var stationModel = require('./model/station_model');
var async = require('async');
var fs = require('fs');
var lazy = require('lazy');
var join = require('path').join, file = join(__dirname, '','geo.json'); 
var lines = 0;
var clines = 0;
var elines = 0;
new lazy(fs.createReadStream(file))
     .lines
     .forEach(function(line){
         //console.log(line.toString());		 
		 var data = JSON.parse(line.toString());
	     //console.log(data.stations+"  "+data.points);		
		
		 var s = 'A'+data.stations[0]+","+data.stations[1];
		 stationModel.createStationRoute({'stations':s,'points':data.points},function(){});		
		 var s1 = 'A'+data.stations[1]+","+data.stations[0];
		 //stationModel.createStationRoute({'stations':s1,'points':data.points.reverse()},function(){});	
         lines+=2;		
         console.log(s,s1);			 
		//stationModel.clearStationRoutes(function(){});
		
		//console.log(data.points.length);
		var a = new Array();
		for(var i =0;i<data.points.length;i+=2)
        {		
		    //a.push(data.points[i]); 
			//console.log(data.points[i]);
			a.push({'lat':data.points[i],'lng':data.points[i+1]});
		}
		redisClient.set( data.stations[0]+','+data.stations[1], JSON.stringify(a), redisClient.print);
		redisClient.set( data.stations[1]+','+data.stations[0], JSON.stringify(a), redisClient.print);
		
	 }	 
   ).on('pipe', function() {
      
        stationModel.StationRouteModel.count(function(err,data){
    	       console.log("StationRouteModel count %d".green,data);
	    });
        			
		redisClient.get('38004,38005',function(err, points){
	        console.log(points.length);
			var a = JSON.parse(points);
			console.log(a.length);
			
			for(var i=0;i<a.length;i++){
			  //console.log(a[i].lat,a[i].lng);
			}
		})
		//console.log('line ',lines);
		
		var k = 1362842100000;
		//console.log(  new Date(k).toLocaleString(),   new Date(k).toUTCString() );
		//console.log(  formatDate(new Date(k)) );
		
   });
 

  
*/


/*
setTimeout(function(){


async.series([
        //Load user to get userId first
        function(callback) {
		
             parser = csv()
            .from.stream(  fs.createReadStream(__dirname+'/uploads/tiplocs.csv') , {columns: true}   )
            //.to.stream(process.stdout, {end: false})
            .on('record', function(row,index){
                   console.log('#'+index+'     '+row.stanox.green+'     '+row.tiploc.green);
                   redisClient.hmset(data.tiploc, "stanox", row.stanox,redis.print);
				   scheduleModel.updateField(tiploc,stanox,function(){});
				   
            })
            .on('end',function(error){
			      console.log(error.message.red);
				  //setTimeout(function(){console.log('333333333333333333');callback()},18000);

                  process.stdout.write("\n");
            })
            .on('error',function(error){
                  console.log(error.message.red);
            });	  		
		
            callback();
        },
        function(callback) {
            console.log('seris---------------------------------------------------------------------');
		    callback();
        }
],function(err) { 
    if (err) return next(err);    
});



},5000);

*/
