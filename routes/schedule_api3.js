var colors = require('colors');
var app = require('../app').app;
var rail_referenceModel = require('../model/rail_reference_model');
var scheduleModel = require('../model/schedule_model3');
var csv = require('csv');
var fs = require('fs');
var lazy = require("lazy");

var async = require('async');

function checkAndUpdateSchedules(){

	scheduleModel.ScheduleModel.count(function(err,data){
    	console.log("checkAndUpdateSchedules  : count  %d".green,data);
		if(data==0){
            importSchedule(function(err,data){});
		}else{
		    
		}
	});
}

app.get('/test/schedule',function(req,res){
	console.log('retrieve schedule_test');
	scheduleModel.ScheduleModel.count(function(err,data){
    	console.log("get Schedules  : count  %d".green,data);
		if(err){
             res.send(500,err);
		}else 
		res.json(200,{'count':data});
	});
});

app.get('/test/schedule/today',function(req,res){
	console.log('retrieve schedule_test');
	findTodayschedules2(function(err,data){
	    if(err){
		    res.send(404,err);
		}
	    else {
		    res.send(200,data);
		}
	});
});

app.get('/test/schedule/clear',function(req,res){

    clearDatabase(function(err,data){
	    if(err) res.send(500,err);
	    else res.send(200,data);
	});
})

app.get('/test/schedule/update',function(req,res){

    checkAndUpdateSchedules();
	    
    res.send(200);
	
})

function importSchedule( callback){
  var fs = require('fs');
  fs.unlink('error_data.json', function (err) {
    if (err) {//throw err;
	}
    console.log('successfully deleted /tmp/hello');
  });
  var stream = fs.createWriteStream('error_data.json');
  
  var join = require('path').join, file = join(__dirname, '../uploads/','toc-full.json');
  var lines = 0;
  var clines = 0;
  var elines = 0;
  new lazy(fs.createReadStream(file))
     .lines
     .forEach(function(line){
        console.log(line.toString());
		 
		 var data = JSON.parse(line.toString());
		 if(typeof data.JsonAssociationV1 != 'undefined')
         {
		    //console.log(data.JsonAssociationV1.main_train_uid+"   "+data.JsonAssociationV1.assoc_train_uid     +"   "+data.JsonAssociationV1.assoc_start_date    +"   "+data.JsonAssociationV1.assoc_end_date    +"   "+data.JsonAssociationV1.assoc_days    +"   "+data.JsonAssociationV1.location   +"   "+data.JsonAssociationV1.CIF_stp_indicator);
         }
		 else{
		   var timestart, timeend;
		   try{
		     lines ++;
		     clines++;
			 
		     console.log(data.JsonScheduleV1.CIF_stp_indicator+"   "+  data.JsonScheduleV1.CIF_train_uid  +"   "+  data.JsonScheduleV1.schedule_days_runs   +"   "+  data.JsonScheduleV1.schedule_end_date   +"   "+  data.JsonScheduleV1.schedule_segment.schedule_location.length  +"   "+  data.JsonScheduleV1.schedule_start_date  );
			 
			 var runs = extractDay_runs(data.JsonScheduleV1.schedule_days_runs);

			 var sche = data.JsonScheduleV1.schedule_segment.schedule_location;
			 //console.log(sche);
			 var a = new Array();
			 var b = new Object();
			 b.timestart = timestart;
			 b.timeend= timeend;
			      //for(var i=0;i<sche.length;i++){}
			      //console.log(" 11111111111  ".green+  sche[i].tiploc_code +"  "+sche[i].arrival+"  "+sche[i].departure+"  "+sche[i].public_arrival+"  "+sche[i].public_departure +"  "+sche[i].platform);
				timestart = parseTime(sche[0].departure);
				timeend = parseTime(sche[sche.length-1].arrival);
				
				async.forEach(sche,
				  function(item){
                        var b = new Object();
						
				        if(item.tiploc_code!=null)   b.tiploc_code = item.tiploc_code;
				        if(item.arrival!=null)    b.arrival = parseTime(item.arrival);
				        if(item.departure!=null)    b.departure = parseTime(item.departure);
				        if(item.public_arrival!=null)   b.public_arrival = parseTime( item.public_arrival);
				        if(item.public_departure!=null)  b.public_departure= parseTime( item.public_departure );
						if(item.pass!=null)       b.pass = parseTime(item.pass);						
						if(item.platform != null) b.platform = item.platform;
				        a.push(b);					   
				  },
				  function(err){
				
				});
			 
			 }catch(err){
			     // console.log("lien at ".red +lines+"      "+  err);
				  if( data.JsonScheduleV1.schedule_segment.schedule_location == undefined){
				     
				  }
				  elines ++;
				  stream.write(line+"\n");
			 }
			 console.log(data.JsonScheduleV1.CIF_train_uid,timestart,timeend);	
			 var ts = timestart;
			 var te = timeend;
			 scheduleModel.createNewSchedule({'train_uid':data.JsonScheduleV1.CIF_train_uid,'schedule_start_date':data.JsonScheduleV1.schedule_start_date,'schedule_end_date':data.JsonScheduleV1.schedule_end_date,'schedule_days_runs':runs,'time_schedule':a,'time_start':ts,'time_end':te},function(){});			 
	     }
	 }

   ).on('pipe', function() {
           stream.on("end", function() {  console.log("stream end"); });
		       
           stream.end();
           
           console.log("read good lines  "+clines+"  bad lines: "+elines+".....................".blue);
           callback();		   
   });;
   
    

}


function clearDatabase(callback){
	scheduleModel.clearScheduleCollection(function(err,data){
	    if(err) callback(err,null);
		else callback(null,data);
	});
}


function reference_test(){
	rail_referenceModel.RailReferenceModel.count(function(err,data){
    	console.log("RailReference count %d".green,data);
	});
}



function extractDay_runs(days){
	var runs = new Array();
	for(var i=0;i<7;i++){
	    if(  (days[i]-'0') == 1 ){
			switch(i)
			{
					   case 0: runs.push(1);  break;
					   case 1: runs.push(2);  break;
					   case 2: runs.push(3);  break;
					   case 3: runs.push(4);  break;
					   case 4: runs.push(5);  break;
					   case 5: runs.push(6);  break;
					   case 6: runs.push(7);  break;
			}
		}
	}
	//console.log(runs);
	return runs;
}


function parseTime(time){
    var sum = 0;
    for(var i=0;i<time.length;i++){
	    switch(i)
		{
		    case 0: sum+= time[0] *600;break;
			case 1: sum+= time[1] *60; break;
			case 3: sum+= time[2] *10; break;
			case 4: sum+= time[3] *1;  break;
		}
	}
	return sum;
}

function findTodayschedules(){

		    var today = new Date();			
			var day = today.getDay();
			if(day ==0) day=7;
			var time = today.getHours()*60 + today.getMinutes();
			// 
	       	scheduleModel.findSchedules({ //"schedule_start_date": {"$lte": today},"schedule_end_date":{"$gte":today}, "schedule_days_runs":{'$in':[day]}// // {"$where": {this.schedule_days_runs.length:{"$gt":0}}}	
			                         },{'skip':0},function(err,data){  
			        //console.log(" received  data       ".green+data.length);
			        data.forEach(function(doc){
				      //console.log("each doc     ".red+doc.train_uid+"   "+doc.schedule_end_date+"    "+doc.schedule_start_date +"   "+doc.schedule_days_runs+"   ");
				      console.log("each doc     ".green+doc.train_uid+"   "+doc.schedule_days_runs+"   "+doc.time_schedule.length,doc.start_time,doc.end_time);

			        });
	        });
}

function findTodayschedules2(callback){
		    var today = new Date();
			var todayminus7days = new Date(today);
            todayminus7days.setDate(-7);
			console.log(todayminus7days.toString()+"       ".green+today.getDay());
			
			var day = today.getDay();
			//,  'train_uid':'Y63097'
			if(day==0) day = 7
			var time = today.getHours()*60 + today.getMinutes();
						//
	       	scheduleModel.findSchedules({"time_start":{"$gte":time+10},"time_end":{"$lte":time+60},"schedule_start_date": {"$lte": today},"schedule_end_date":{"$gte":today}, "schedule_days_runs":{'$in':[day]}// // {"$where": {this.schedule_days_runs.length:{"$gt":0}}}	
			                         },{'skip':0},function(err,data){  
			        console.log(" received  data       ".green+data.length);
                    callback(err,data);
	        });	
}

function findTodayschedules(){

		    var today = new Date();

			//console.log(todayminus7days.toString()+"       ".green+today.getDay());
			
			var day = today.getDay();
			var todayminus7days = new Date(today);
            todayminus7days.setDate(+1);			
			//console.log('!!...................     ',day,todayminus7days.getDay());
			if(day ==0) day=7;
			//,  'train_uid':'Y63097'
			var time = today.getHours()*60 + today.getMinutes();
			// 
	       	scheduleModel.findSchedules({ "start_time":{"$gte":time+60},"schedule_start_date": {"$lte": today},"schedule_end_date":{"$gte":today}, "schedule_days_runs":{'$in':[day]}// // {"$where": {this.schedule_days_runs.length:{"$gt":0}}}	
			                         },{'skip':0},function(err,data){  
			        //console.log(" received  data       ".green+data.length);
			        data.forEach(function(doc){
				      //console.log("each doc     ".red+doc.train_uid+"   "+doc.schedule_end_date+"    "+doc.schedule_start_date +"   "+doc.schedule_days_runs+"   ");
				      console.log("each doc     ".green+doc.train_uid+"   "+doc.schedule_days_runs+"   "+doc.time_schedule.length,doc.start_time,doc.end_time);

			        });
	        });


}
//
/*******************************
            test
*******************************/
/*
testSchedule("Y63348");  
testSchedule("Y63347"); //
testSchedule("Y64058");
testSchedule("Y64158");  //
testSchedule("Y63662");
*/
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
				    console.log('iterating done'.green);					
					setInterval(function(){
					   //console.log('send activation event');
					   //io.sockets.emit('train_activation_event',JSON.stringify(a));
					},10000);					
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
			   console.log('findOneSchedule is null'.red);
			   scheduleModel.ScheduleModel.count(function(err,data){
    	           console.log("schedule count %d".green,data);
	           });	
            }			   
		}
	 });
}

/*
async.series({
    clearDB: function(callback){
           //callback(null, clearDatabase())   ;
            callback(null,1);
    },
    importData: function(callback){
            //;
			//extractDay_runs('1100111');
			//
            callback(null, 1);
			//callback(null,1);
    },
	testData:function(callback){


			
	       callback(null,function(){
		   

		   
		   
		   });
	},
	testData2:function(callback){
			
			console.log('test database findSchedules'.green);
				  
		    var today = new Date();
			var todayminus7days = new Date(today);
            todayminus7days.setDate(-7);
			console.log(todayminus7days.toString()+"       ".green+today.getDay());
			
			var day = today.getDay();
			//,  'train_uid':'Y63097'
			if(day==0) day = 7
						
	       	scheduleModel.findSchedules({"schedule_start_date": {"$lte": today},"schedule_end_date":{"$gte":today}, "schedule_days_runs":{'$in':[day]}// // {"$where": {this.schedule_days_runs.length:{"$gt":0}}}	
			                         },{'skip':0},function(err,data){  
			        console.log(" received  data       ".green+data.length);
			        data.forEach(function(doc){
				      //console.log("each doc     ".red+doc.train_uid+"   "+doc.schedule_end_date+"    "+doc.schedule_start_date +"   "+doc.schedule_days_runs+"   ");
				      console.log("each doc 2211     ".green+doc.train_uid+"   "+"   "+doc.time_schedule.length,doc.time_start,doc.time_end);

			        });
	        });				
			
		callback(null,function(){

		})	//callback
			


	 
			scheduleModel.getDistinctValues('schedule_days_runs',function(err,data){
			        
			        console.log("getDistinctValues      ".green+data);
			})
 
			scheduleModel.findByTrainAndTime("Y64110",today,function(err, doc){
		               if(err){callback(err, null);}
		               else{
			                 console.log("#77777777777777777777777  find one");
			                 if(doc != null)
			                 {
							   //console.log("each schedule     ".green+doc.train_uid+"   "+doc.schedule_end_date+"    "+doc.schedule_start_date+"   "+doc.schedule_days_runs );
							   //console.log("each schedule     ".green+doc.train_uid+"   "+ doc.time_schedule.length);
							   console.log(doc.time_schedule);
							   //
							 }
			                 else{
			                 console.log('findOneSchedule is null'.red);
			                 callback(null, doc);
							 }
		                }
	        });
			
   

			

          	  
				
	       callback(null,4);
	}
},
function(err, results) {



});
*/