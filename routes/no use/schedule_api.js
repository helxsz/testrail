console.log('schedule api');

var colors = require('colors');
var app = require('../app').app;
var rail_referenceModel = require('../model/rail_reference_model');
var scheduleModel = require('../model/schedule_model');
var csv = require('csv');
var fs = require('fs');

var async = require('async');



async.series({
    clearDB: function(callback){
            //clearDatabase();
            callback(null, 1);
    },
    importData: function(callback){
            //importSchedule();
            callback(null, 2);
    },
	testData:function(callback){
	       	scheduleModel.ScheduleModel.count(function(err,data){
    	       console.log("schedule count %d".green,data);
	        });		   
	       callback(null,4);
	},
	testData2:function(callback){

		  console.log('test database findSchedules'.green);
					  
		    var today = new Date();
			var todayminus7days = new Date(today);
            todayminus7days.setDate(-7);
			console.log(todayminus7days.toString());
			
			//,  'CIF_train_uid':'Y63097'
			/*
	       	scheduleModel.findSchedules({"schedule_start_date": {"$lte": today},"schedule_end_date":{"$gte":today}},{'skip':0},function(err,data){  
			        console.log(" received  data       ".green+data.length);
			        data.forEach(function(doc){
				      //console.log("each doc     ".red+doc.CIF_train_uid+"   "+doc.schedule_end_date+"    "+doc.schedule_start_date +"   "+doc.schedule_days_runs+"   ");
				      //console.log("each doc     ".green+doc.CIF_train_uid+"   "+doc.schedule_days_runs+"   "+doc.time_schedule.length);

			        });
	        });
			*/
			scheduleModel.getDistinctValues('schedule_days_runs',function(err,data){
			        
			        console.log("getDistinctValues      ".green+data);
			})
			
            /*
			scheduleModel.ScheduleModel.findByTrainAndTime('Y63854',today,function(err, doc){
		               if(err){callback(err, null);}
		               else{
			                 console.log("#77777777777777777777777  find one");
			                 if(typeof doc != undefined)
			                 console.log("each schedule     ".green+doc.CIF_train_uid+"   "+doc.schedule_end_date+"    "+doc.schedule_start_date );
			                 else
			                 console.log('findOneSchedule is null'.red);
			                 callback(null, doc);
		                }
	        });
          	*/  
				
	       callback(null,4);
	}
},
function(err, results) {



});

var     lazy    = require("lazy"),
        fs  = require("fs");

function importSchedule(){
  var fs = require('fs');
  fs.unlink('error_data.json', function (err) {
    if (err) throw err;
    console.log('successfully deleted /tmp/hello');
  });
  var stream = fs.createWriteStream('error_data.json');
  
  var join = require('path').join, file = join(__dirname, '','toc-full.json'); 
  var lines = 0;
  var clines = 0;
  var elines = 0;
  new lazy(fs.createReadStream(file))
     .lines
     .forEach(function(line){
         //console.log(line.toString());
		 
		 var data = JSON.parse(line.toString());
		 if(typeof data.JsonAssociationV1 != 'undefined')
         {
		    //console.log(data.JsonAssociationV1.main_train_uid+"   "+data.JsonAssociationV1.assoc_train_uid     +"   "+data.JsonAssociationV1.assoc_start_date    +"   "+data.JsonAssociationV1.assoc_end_date    +"   "+data.JsonAssociationV1.assoc_days    +"   "+data.JsonAssociationV1.location   +"   "+data.JsonAssociationV1.CIF_stp_indicator);
         }
		 else{
		   try{
		     lines ++;
		     clines++;
		     //console.log(data.JsonScheduleV1.CIF_stp_indicator+"   "+  data.JsonScheduleV1.CIF_train_uid  +"   "+  data.JsonScheduleV1.schedule_days_runs   +"   "+  data.JsonScheduleV1.schedule_end_date   +"   "+  data.JsonScheduleV1.schedule_segment.schedule_location.length  +"   "+  data.JsonScheduleV1.schedule_start_date  );
			 
			 /**/
			 var sche = data.JsonScheduleV1.schedule_segment.schedule_location;
			 //console.log(sche);
			 var a = new Array();
			 
			 for(var i=0;i<sche.length;i++){
			      //console.log(" 11111111111  ".green+  sche[i].tiploc_code +"  "+sche[i].arrival+"  "+sche[i].departure+"  "+sche[i].public_arrival+"  "+sche[i].public_departure +"  "+sche[i].platform);
			      var b = new Object();
				  b.tiploc_code = sche[i].tiploc_code;
				  b.arrival = sche[i].arrival;
				  b.departure = sche[i].departure;
				  b.public_arrival = sche[i].public_arrival;
				  b.public_departure= sche[i].public_departure;
				  b.platform = sche[i].platform;
				  a.push(b);
			 }		
             //console.log("read good lines  "+clines+"  bad lines: "+elines+".....................".blue+a.length);	
             
	 
			 
			 }catch(err){
			     // console.log("lien at ".red +lines+"      "+  err);
				  if( data.JsonScheduleV1.schedule_segment.schedule_location == undefined){
				     
				  }
				  elines ++;
				  stream.write(line+"\n");
			 }
		 
			 scheduleModel.createNewSchedule({'CIF_train_uid':data.JsonScheduleV1.CIF_train_uid,'schedule_start_date':data.JsonScheduleV1.schedule_start_date,'schedule_end_date':data.JsonScheduleV1.schedule_end_date,'schedule_days_runs':data.JsonScheduleV1.schedule_days_runs,'time_schedule':a},function(){});
			 
	     }
	 }
	 
	 //	 

   ).on('pipe', function() {
           stream.on("end", function() {  console.log("stream end"); });
		       
           stream.end();
           
           console.log("read good lines  "+clines+"  bad lines: "+elines+".....................".blue);	    
   });;
   
    

}

function clearDatabase(){
	 scheduleModel.clearScheduleCollection(function(){});
}

app.get('/reference_test',function(req,res){
	console.log('retrieve reference_test');	
    res.send(200);
});

app.get('/schedule_test',function(req,res){
	console.log('retrieve schedule_test');
	
    res.send(200);

});
