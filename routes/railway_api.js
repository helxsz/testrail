var underscore = require('underscore');
var colors = require('colors');
var app = require('../app').app;
var io = require('../app').io;
var async = require('async');
var fs = require('fs');
//setInterval(checkExpires, 30*1000  );//ten minute check
//checkExpires(); //run it once to clear everything out if it is restarting

var referenceModel = require('../model/rail_reference_model');
var scheduleModel = require('../model/schedule_model3');

var trainModel = require('../model/train_model');


var config = require('../config.js');
var redis = require('redis');
var redis_ip= config.redis.host;  
var redis_port= config.redis.port; 
var redisClient;
    try{ 
        redisClient = redis.createClient(redis_port,redis_ip);
	}
    catch (error){
        console.log('  error' + error);
		redisClient.quit();
		return callback(error,null);
    }	
/*******************************************
  clear the database
********************************************/
//redisClient.flushdb(function(){});


function loadTrainActivation(){

var lazy    = require("lazy"),
    fs  = require("fs");


  var fs = require('fs');
  
  var join = require('path').join, file = join(__dirname, '','activation.json'); 
  var lines = 0;
  var clines = 0;
  var elines = 0;
  console.log('importActicationList'.green);
  new lazy(fs.createReadStream(file))
     .lines
     .forEach(function(line){		 
		 var data = JSON.parse(line.toString());
         lines++;		 
		 if(lines>642){
		 
			//console.log(line.toString());
			parse_ActMsg(data);
		 }
	 }

   ).on('pipe', function() {
           console.log("read good lines  "+clines+"  bad lines: "+elines+".....................".blue);	    
   });

}



// unique id generator
function generateId(){
    var S4 = function () {
         return (((1 + Math.random()) * 0x10000) | 
                                     0).toString(16).substring(1);
     };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" +
                S4() + "-" + S4() + S4() + S4());
}

io.sockets.on('connection', function (socket) {

      console.log('A socket with sessionID ' + socket.handshake.sessionID + ' connected!');
	  /*
	  sessionStore.get(socket.handshake.sessionID, function(err, session) {
		     if (err || !session) {
			    console.log('err  no session');
               // accept('Error', false);
            } else {
                // create a session object, passing data as request and our
                // just acquired session data
                //data.session = new Session(data, session);
                //accept(null, true);
				console.log('session');
            }
      });
*/
	  //socket.emit('news', { hello: 'world' });
	  
	  socket.user = generateId();

	  // http://hop2croft.wordpress.com/2012/04/21/basic-node-js-and-backbone-js-application-iv-socket-io-and-redis-support/
	  console.log('Client connected.      '.green +  socket.user);
      redisClient.sadd('users', socket.user);
      redisClient.multi().smembers('users').exec(function (err, replies) {
           io.sockets.emit('nusers', replies[0].length, replies[0].toString());
		   console.log('Client connected.      '.green +  replies[0].length+"  ");
      });

	  
	  // after connection, the client sends us the  nickname through the connect event
      socket.on('connect', function(data){
         connect(socket, data);
      });
//////////////////////////////////////////////////////////////////////////////////////////	  
	  
	/*  
	findTheRunningTrain(function(err,array){		   
	    var a = new Array();
	    array.forEach(function(item){
           console.log('find the running train....');	
           socket.emit('train_activation_event', JSON.stringify(item) );			   
		   console.log('findTheRunningTrain!!!!!!!!!!!!!!!!'.red,item.train_id, item.train_uid,item.time_schedule.length,item.train_id,parseNumberToTime(item.time_start),parseNumberToTime(item.time_end) );	
		   redisClient.hmget(item.tiploc, "stanox",function(err, data){
		        console.log('reply '+data);
				item.stanox = data;
		   });
	    
		   a.push(item);
		});
		
		//console.log(JSON.stringify(a),a.length,'??????????????????????//');
        //socket.emit('news', JSON.stringify(a) );		
	});  
*/	  
	  
	  
	  
	  

////////////////////////////////////////////////////////////////////////////////////////////	  
	  socket.on('disconnect', function() {
		console.log('Client Disconnected.      '.red+socket.user);
		
		redisClient.srem('users',socket.user);
        redisClient.multi().smembers('users').exec(function (err, replies) {
               io.sockets.emit('nusers', replies[0].length, replies[0].toString());
			   console.log('Client connected.      '.red +  replies[0].length+"  ");
        });

	  });
});


app.get('/latest',function(red,res){

	findTheRunningTrain(function(err,array){
/*	
	    var a = new Array();
	    array.forEach(function(item){
           console.log('find the running train....');		
		   console.log('findTheRunningTrain!!!!!!!!!!!!!!!!'.red,item.train_id, item.train_uid,item.time_schedule.length,item.train_id,parseNumberToTime(item.time_start),parseNumberToTime(item.time_end) );	
		   redisClient.hmget(item.tiploc, "stanox",function(err, data){
		        console.log('reply '+data);
				item.stanox = data;
		   });
	    
		   a.push(item);
		});
*/		
//		console.log(JSON.stringify(a),a.length,'??????????????????????//');
		res.send(array);
        //socket.emit('news', JSON.stringify(a) );		
	}); 

})


function findTheRunningTrain(callback){

    var date = new Date();
	console.log(date.getHours(),date.getMinutes() );
	var s = date.getHours()*60+date.getMinutes();
	//
    trainModel.findTrain({"start_time": {"$lte": s},"end_time":{"$gte":s}},function(err,docs){	
	   if(err) console.log('err');
	   else{
        console.log('...................................'.red,docs.length);
		/*
        var array = new Array();
	    async.forEachSeries(docs,
		function(item,callback1){
	          //console.log('`````````````````````````````'.red,item.train_id, item.train_uid, item.geo);	
              var obj = new Object();
              obj.train_id = item.train_id; 	obj.train_uid = item.train_uid; 		  
		      scheduleModel.findOneScheduleTimeline({'train_uid':item.train_uid},function(err, doc){
		        if(err){
				    
				}else{
				    console.log('find the runing train schedule'   + doc.time_schedule.length,item.train_id,doc.time_start,doc.time_end);
					 obj.time_start = obj.time_start;  obj.time_end = doc.time_end;
					 obj.time_schedule = doc.time_schedule;
					array.push(obj);
				}
               callback1();				
		   }); //model
		   
		 },
		function(err){
		     console.log('&&&&&&&&&&&&&&&&&&&&',array.length);
		     callback(err,array);	
		}  
	  );//each  
		*/ 		 
       	 callback(err,docs);
	   }
	});

}







/*
setInterval(function(){

    var date = new Date();
	//console.log(date.getHours(),date.getMinutes() );
	var s = date.getHours()*60+date.getMinutes();
    trainModel.findTrain({"start_time": {"$lte": s},"end_time":{"$gte":s}},function(err,docs){	
	   if(err) console.log('err');//
	   else{	   
	        
	    async.each(docs,function(item,callback){
	          console.log('`````````````````````````````'.red,item.train_id, item.train_uid, item.geo);		
              //if(item.timeline)		 
			  //console.log('alal'.green,item.timeline.length);	  
		      scheduleModel.findOneScheduleTimeline({'train_uid':item.train_uid},function(err, doc){
		        if(err){
				    
				}else{
				   // console.log('find the runing train schedule'   + doc.time_schedule.length,item.train_id,parseNumberToTime(doc.time_start),parseNumberToTime(doc.time_end));
				}				  
		   }); //model
		   callback();
		 });//each  	    
	   }
	});
	
},10000);
*/

/***************************
               web interface
****************************/

app.get('/home', function (req, res, next) {
	console.log("//////");
    res.redirect('/login');
});

app.get('/login', function (req, res, next) {
	console.log("redirect to home");
	
     res.redirect('railway2.html');
	 
	 if (req.session.uid) {
		 console.log('retrieve logined page');
		 res.redirect('signin.html');
	 } else {
		 console.log('retrieve login page');
		 res.redirect('signin.html');
	 }
});

app.get('/station',function(req,res,next){

     redisClient.flushdb(function(){});
     console.log("get station");
	 
})

/**/
function checkExpires(){
	//grab the expire set	
	console.log("check expires ".red);
	redisClient.multi()
	.smembers('train', function(err, trains){
			  if(trains != null){
		        var i = 0;
				trains.forEach(function(key){
				    //console.log("train     "+key);
					var train_id = key;
					//timer exists check the ttl on it
					redisClient.ttl("train_id:"+train_id, function(err, ttl){
							//the ttl is two hours and if it is under
							//a half hour we delete it
							//console.log("train id "+train_id+"    "+ttl);
							/**/
							if(ttl < 20){
							    console.log("delete  ".red+train_id);
								redisClient.del("train_id:"+train_id);
								redisClient.srem('train', train_id);
							}
							
					});
					// get train id
				    redisClient.hget("train_id:"+key,'uid',function(err, train_uid){   
					     //console.log(train_id+"   "+train_uid);
					});
					i++;
				});
		      }
			  console.log('..........................................'+i);
	})
	.exec(function (err, replies) {
            console.log("MULTI got " + replies.length + " replies");
            replies.forEach(function (reply, index) {
                console.log("Reply " + index + ": " + reply.toString());
            });
    });
	
};

/*****************************
    railway service connection  IN REAL TIME

******************************/
app.get('/service/start', function (req, res, next) {
	connectFeed(function(err,data){
	    //if(err) res.send(500,err);
	    //else res.send(200,data);
	    //else res.send(200,data);
	})   
});

app.get('/service/stop', function (req, res, next) {
	client.disconnect(function(err,data){
	    if(err) res.send(500,err);
		else res.json(200,data);
	})
});

var prettyjson = require('prettyjson'),
StompClient = require('stomp-client').StompClient;

var TRAIN_MVT_HE_TOC = '/topic/TRAIN_MVT_HE_TOC';
var client = new StompClient('datafeeds.networkrail.co.uk', 61618, 'helxsz@gmail.com', 'Nanchang303?', '1.0');


var connected = false;
function connectFeed(callback){
	
    client.connect(function(sessionId) {
        console.log('Trying to connect the railway real time service...');  
        //io.sockets.emit('news', { will: 'Trying to connect the railway real time service...'});		
    });
    client.on('connect', function () {
		    client.subscribe(TRAIN_MVT_HE_TOC, onSubscribe);
		    console.log('stmop connection success'.green);
			//callback(null,"successs");
			connected = true;
	});
    client.on('disconnect',function(e){
	        console.log('stmop connection disconnect'.red,e);
			connected = false;
			reconnect();
			
    })
    client.on('error',function(err){
	    console.log('stmop connection error'.red,err.message,err.details );
		connected = false;
    })  	
}

function reconnect(){
    setTimeout(function(){
	    console.log('set time out 4000');
		if(connected == false){
	       connectFeed(function(err,data){
                if(err)  console.log('reconnect failed');
		        else  console.log('reconnect successs');
           })
		}
	},3000);
}

function onSubscribe(body, headers) {
            //console.log(prettyjson.render(JSON.parse(body)));
	        var t = JSON.parse(body);
	        //console.log(t[0].header.msg_type);
	        console.log("recived train messages length:"+t.length);
	        var movementarray = new Array();	   
	        for(var i in t){	  	               
		        //console.log(t[i].header.msg_type[3]);	 
		        switch(t[i].header.msg_type[3]-'0'){  
			        case 1:
			            var stream = fs.createWriteStream('activation.json', {'flags': 'a'});
			            stream.write(JSON.stringify(t[i])+"\n");
			            stream.end();
			            parse_ActMsg(t[i]);			  
			        break;
			
			        case 2:
			            parse_CanMsg(t[i]);
			        break;
			
			        case 3:
			            movementarray.push(t[i]);
			        break;
			
			        case 4:
			
			        break;
			          
			        case 5:
			
			        break;
			
			        case 6:
		
			        break;
			
			        case 7:
			            parse_ChangeName(t[i]);
			        break;
			
			        case 8:
			
			        break;
		 
		        }
	        }	   
	        updateTrainInfos(movementarray);
}




// Activation Message
function parse_ActMsg(msg){
    console.log("activation".green+"    "+msg.header.msg_type+"  "+msg.body.schedule_end_date+"  "+msg.body.train_id+"  " +msg.body.train_uid+"  "+msg.body.schedule_start_date+"  "+
	   	 msg.body.sched_origin_stanox+"  "+msg.body.toc_id+"   "+msg.body.schedule_type);
		 
    //io.sockets.emit('train_activationMsg', {'train_uid':msg.body.train_uid,'schedule_start_date':msg.body.schedule_start_date,'schedule_end_date': msg.body.schedule_end_date});
	
	var train_id = msg.body.train_id;
	var train_uid = msg.body.train_uid;
	
	redisClient.multi()
	.hmset("train_id:"+train_id,"uid",train_uid,function(){})
	.expire("train_id:"+train_id, 20*60)
	.exec(function (err, replies) {
            //console.log("parse_ActMsg   redisMULTI got ".red + replies.length + " replies");
            replies.forEach(function (reply, index) {
               // console.log("Reply " + index + ": " + reply.toString());
            });
    });
	
	var today = new Date();
	var day = today.getDay();
	scheduleModel.findByTrainAndTime(train_uid,today,function(err, doc){
	    var a = new Object();
		if(err){}
		else{
			console.log("#findByTrainAndTime   of the train  ");
			if(doc != null)
			{
				//console.log("each schedule     ".green+doc.CIF_train_uid+"   "+doc.schedule_end_date+"    "+doc.schedule_start_date+"   "+doc.schedule_days_runs );
				//console.log(doc.time_schedule);
				var startTime,endTime;
                 try{}catch(err){}
				   startTime = doc.time_schedule[0].departure;
				   endTime = doc.time_schedule[doc.time_schedule.length-1].arrival;
				
				console.log("new schedule     ".green+doc.train_uid+"  length: ".green+ doc.time_schedule.length+" "+train_uid,msg.body.sched_origin_stanox,'starttime',startTime,'endTime',endTime);
				a.train_uid = doc.train_uid;
				a.train_id = train_id;
				a.stanox = msg.body.sched_origin_stanox;
				a.start_time = startTime;
				a.end_time = endTime;
				a.timeline = new Array();

				var array = new Array();								
				var b ;
				var n = 0;
				async.forEachSeries(doc.time_schedule,
				  function(item,callback){
				       //console.log('time schedule 111111111'.green+"   "+item.tiploc_code );
					  
					   referenceModel.findStanoxByTicloc(item.tiploc_code,function(err,data){ 
					      try{
						     n++;
						      console.log("time schedule data:".green+"   "+data.stanox+"   "+item.arrival+"  "+item.departure+"  "+item.pass+"  "+item.platform,doc.time_schedule.length,n);					        
							console.log('----------------------------------------------');							
							redisClient.lpush("train_schedule:"+trainId,JSON.stringify({"stanox":data.stanox,"arrival":item.arrival,"departure":item.departure,"pass":item.pass,"platform":item.platform}),redisClient.print);					
						    
							b = new Object();
							b.stanox = data.stanox;
							b.arrival = item.arrival;
							b.departure = item.departure;
							b.pass = item.pass;
							b.platform = item.platform;
							a.time.push(b);
							array.push(b);
							
						  }catch(err2){						  
						  }		
						  
						     callback();
						  
					  });	

                     
				  },
				  function(err){
				  
				  	//trainModel.createNewTrain(a,function(){}); 
				    console.log('iterating done'.green);	
				    trainModel.createNewTrain({'train_uid':doc.train_uid,'train_id':train_id,'start_time':startTime,'end_time':endTime,'timeline':array},function(){});			 
					
					io.sockets.emit('train_activation_event',JSON.stringify(a));
					console.log(a);

				});	
				
			}
			else{
			     //console.log('findOneSchedule is null'.red);	
				 var a = new Object();
				 if(train_uid==null) return;
				 a.train_uid = train_uid;
				 a.train_id = train_id;
				 a.stanox = msg.body.sched_origin_stanox;
				 
				 trainModel.createNewTrain({'train_uid':train_uid,'train_id':train_id,'start_time':startTime,'end_time':endTime},function(){});
                 io.sockets.emit('train_activation_event',JSON.stringify(a));			 
		    }
		}
	 });
}

					/*
					mul.exec(function (err, replies) {
                         console.log("testSchedule redis got " + replies.length + " replies");
                         replies.forEach(function (reply, index) {
                              //console.log("Reply " + index + ": " + reply.toString());
                        });
                    });
					*/
                    /*
	                redisClient.rpop("train_schedule:"+trainId,function(err, data){					
					   console.log("pop data   ".green +"      "+trainId+"       "+JSON.parse(data).stanox);
	                })
	                redisClient.rpop("train_schedule:"+trainId,function(err, data){					
					   console.log("pop data   ".green +"      "+trainId+"       "+JSON.parse(data).stanox);
	                })
	                redisClient.rpop("train_schedule:"+trainId,function(err, data){					
					   console.log("pop data   ".green +"      "+trainId+"       "+JSON.parse(data).stanox);
	                })
                  */
                   /*
                    redisClient.lrange( "train_schedule"+trainId, 0, -1,function(err, schedules){					
					   var len = schedules == null ? 0 : schedules.length;
					   console.log('lange  train schedule ',trainId,len);
					    schedules.forEach(function(sche,index){
						    //console.log();
						})
					})
				  */







// Cancellation Message
/*
{
"header": {
"msg_type": "0002",
"source_dev_id": "VRX6",
"user_id": "#QRP4099",
"original_data_source": "SDR",
"msg_queue_timestamp": "1286962693000",
"source_system_id": "TRUST"
},
"body": {
"train_file_address": null,
"train_service_code": "24680004",
"orig_loc_stanox": "",
"toc_id": "91",
"dep_timestamp": "1286960880000",
"division_code": "91",
"loc_stanox": "72359",
"canx_timestamp": "1286966280000",
"canx_reason_code": "TX",
"train_id": "722H36ME13",
"orig_loc_timestamp": "",
"canx_type": "AT ORIGIN"
}
}
*/
function parse_CanMsg(msg){
    console.log("cancel train".green+"    "+msg.header.msg_type+"  "+msg.body.train_id+"  " +msg.body.canx_type+"  "+msg.body.canx_reason_code+"  "+
	   	 msg.body.canx_timestamp+"  "+msg.body.loc_stanox+"   ");
}
/*
{
"header": {
"msg_type": "0007",
"source_dev_id": "CY99996",
"user_id": "",
"original_data_source": "TOPS",
"msg_queue_timestamp": "1263826847000",
"source_system_id": "TRUST"
},
"body": {
"current_train_id": "422P182Q08",
"train_file_address": "005",
"train_service_code": "22320003",
"revised_train_id": "422X112Q08",
"train_id": "1214567890",
"event_timestamp": "1172849234000"
}
}
*/
function parse_ChangeName(msg){
    console.log("change train id".green+"    "+msg.header.msg_type+"  "+msg.body.current_train_id+"  "+msg.body.train_id+"  " +msg.body.revised_train_id+"  "+msg.body.event_timestamp);

}

// train movement
/*
  header:
    msg_type:             0003
    source_dev_id:
    user_id:
    original_data_source: SMART
    msg_queue_timestamp:  1361375177000
    source_system_id:     TRUST
  body:
    event_type:             ARRIVAL
    gbtt_timestamp:
    original_loc_stanox:
    planned_timestamp:      1361375190000
    timetable_variation:    1
    original_loc_timestamp:
    current_train_id:
    delay_monitoring_point: true
    next_report_run_time:   1
    reporting_stanox:       36076
    actual_timestamp:       1361375220000
    correction_ind:         false
    event_source:           AUTOMATIC
    train_file_address:     null
    platform:
    division_code:          64
    train_terminated:       false
    train_id:               365O39MR20
    offroute_ind:           false
    variation_status:       LATE
    train_service_code:     12304212
    toc_id:                 64
    loc_stanox:             36076
    auto_expected:          true
    direction_ind:
    route:                  0
    planned_event_type:     ARRIVAL
    next_report_stanox:     36078
    line_ind:
*/
function parse_TrainMovement(msg){

    //console.log("parse train movement");
    console.log("train movement  ".green+"      "+msg.header.msg_type+"  "+msg.body.event_type+"  "+msg.body.train_id+ "  "+msg.body.variation_status+"  "+
	   	 msg.body.loc_stanox+"  "+msg.body.next_report_stanox+"   "+msg.body.actual_timestamp+ "  " +msg.body.planned_timestamp); // + new Date(parseInt(msg.body.actual_timestamp))
	   
}


function updateTrainInfos(msg){
// multi chain with an individual callback
    //console.log("railway service push updateTrainInfos       ".green+ msg.length);	
		
	var a = new Array();	
	async.forEach(msg,
	function(item,callback){
		var obj = new Object();
        obj.train_id = item.body.train_id;
        obj.status = item.body.variation_status;		
		obj.stanox = item.body.loc_stanox;
		obj.next_stanox = item.body.next_report_stanox;
		obj.timestamp = item.body.actual_timestamp;
		//obj.planed_time = msg.body.planned_timestamp;
		obj.event = item.body.event_type;
		obj.next_event = item.body.planned_event_type;
		a.push(obj);
		console.log('send '+obj.train_id,obj.stanox,obj.next_stanox,obj.event,obj.next_event,obj.status);
		
		callback();
	},function(callback){
	    //console.log("socket send data ");
		io.sockets.emit('train_movement_event',JSON.stringify(a));	   
		
		
	    var groups =  underscore.groupBy(a, function(obj){ return  obj.train_id}) ;	
	    //console.log(groups);
       
		for (var key in groups) {
            if (groups.hasOwnProperty(key)) {
              //console.log(key + " -> " + groups[key].length);
			  if(groups[key].length==2){
			    console.log("----".red, new Date().getTime());
			    console.log("---".red,groups[key][0].stanox,groups[key][0].next_stanox,groups[key][0].status,groups[key][0].next_event,groups[key][0].event,groups[key][0].timestamp);
			    console.log("---".red,groups[key][1].stanox,groups[key][1].next_stanox,groups[key][1].status,groups[key][1].next_event,groups[key][1].event,groups[key][1].timestamp); 
			    console.log(  (groups[key][0].timestamp - groups[key][1].timestamp)/1000/60 );
				//convert(groups[key][0].timestamp);
				if(groups[key][0].timestamp>groups[key][1].timestamp){
				   trainModel.updateTrainInfo({'train_id':key},{'event':groups[key][0].event,'stanox':groups[key][0].stanox,'events':{'$push':{'events': [groups[key][1],groups[key][0]]  }}},function(){});
				}
				else{
				   trainModel.updateTrainInfo({'train_id':key},{'event':groups[key][1].event,'stanox':groups[key][1].stanox,'events':{'$push':{'events': [groups[key][0],groups[key][1]] }}},function(){});
				}
			  }	
               if(groups[key].length==1){
                   trainModel.updateTrainInfo({'train_id':key},{'event':groups[key][0].event,'stanox':groups[key][0].stanox,'events':{'$push':{'events':groups[key][0]}}},function(){});
               }			   
            }			
        }		
	})
				  
				  
				  
	//io.sockets.emit('train_movement_event',{'train_id':msg.body.train_id,'status':msg.body.variation_status,'stanox':msg.body.loc_stanox,'next_stanox':msg.body.next_report_stanox, 'timestamp':msg.body.actual_timestamp});
/*  check expire	               	
    var mul = redisClient.multi();
    for(var i=0;i<msg.length;i++){
	   mul
		 .sadd("train",msg[i].body.train_id,function(){})
	     .hmset("train_id:"+msg[i].body.train_id,{"status":msg[i].body.variation_status,"stanox":msg[i].body.loc_stanox,"next_stanox":msg[i].body.next_report_stanox,"timestamp":msg[i].body.actual_timestamp},function(){})
	     .expire("train_id:"+msg[i].body.train_id, 20*60);
	}
	mul.exec(function (err, replies) {
            console.log("updateTrainInfos redis got " + replies.length + " replies");
            replies.forEach(function (reply, index) {
                //console.log("Reply " + index + ": " + reply.toString());
            });
    });
*/
}
function convert(timestamp){
    if(typeof timestamp == String )  console.log('-----------------   string');
	if(typeof timestamp == Number )  console.log('-----------------   number');
    var date = new Date(timestamp);
	//return date.getHours()+','+date.getMinutes()+','+date.getSeconds();
	//return date.toLocaleString();
	console.log('date   '+date.toLocaleString()+'     '+timestamp);
}



function publishMsgToAll(msg){
 
    var next_stanox = msg.body.next_report_stanox;
	

	
	// async parall
	/*
    redisClient.hget(msg.body.loc_stanox,'station', function (err, data) {
       if (err) {   return console.error("error response - " + err); 
	   
	   }    
       //console.log(" replies:"+data);
	   var station = data;
	   
	   redisClient.hget(next_stanox,'station', function (err, data){
	         console.log(" replies:  "+station +"     "+data);
	         io.sockets.emit('train_movementMsg',{'station':station,'next_station':data,'train_id':msg.body.train_id,'status':msg.body.variation_status,'stanox':msg.body.loc_stanox,'next_stanox':msg.body.next_report_stanox,
	                'timestamp':msg.body.actual_timestamp});
	   })   
    });
   */	
}

function publishMsgToSubscribed(msg){

}

// undetified train
function parse_UndeTrain(msg){

}

// train reinstallment
function parse_TrainReinstall(msg){

}

// change of origin
function parse_ChangeOfOrigin(msg){

}

function parseNumberToTime(num){
    var hour = Math.floor(num/60);
	var minutes = num - 60*hour;
	return hour+':'+minutes;
}
