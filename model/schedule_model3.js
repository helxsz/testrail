/**
 * Module dependencies.
 */			  
var mongoose = require('../app').mongoose;
var ObjectId = mongoose.Schema.ObjectId;
var colors = require('colors');
////////////////////////////////////////////////////////////////////////////////
//{"CIF_stp_indicator":"P","train_uid":"Y63488","applicable_timetable":"Y","atoc_code":"ME","schedule_start_date":"2013-01-12","train_status":"P","schedule_days_runs":"0000010","schedule_end_date":"2013-04-20",
//"schedule_segment":{"signalling_id":"2N43","CIF_train_category":"OO","CIF_headcode":"","CIF_course_indicator":1,"CIF_train_service_code":"12305012","CIF_business_sector":"??","CIF_power_type":"EMU","CIF_timing_load":null,"CIF_speed":"075","CIF_operating_characteristics":null,"CIF_train_class":"S","CIF_sleepers":null,"CIF_reservations":null,"CIF_connection_indicator":null,"CIF_catering_code":null,"CIF_service_branding":"",
//"schedule_location":[{"location_type":"LO","tiploc_code":"NBTN","departure":"1653H","public_departure":"1653","platform":"1"},{"location_type":"LI","tiploc_code":"WALAGRD","arrival":"1657","departure":"1657H","public_arrival":"1657","public_departure":"1657","platform":"1"},{"location_type":"LI","tiploc_code":"WALASYV","arrival":"1658H","departure":"1659","public_arrival":"1659","public_departure":"1659","platform":"1","line":null,"path":null,"engineering_allowance":null,"pathing_allowance":null,"performance_allowance":null},{"location_type":"LI","record_identity":"LI","tiploc_code":"BDSTNEJ","tiploc_instance":null,"arrival":null,"departure":null,"pass":"1701H","public_arrival":null,"public_departure":null,"platform":null,"line":null,"path":null,"engineering_allowance":null,"pathing_allowance":null,"performance_allowance":null},{"location_type":"LI","record_identity":"LI","tiploc_code":"BRKNHDN","tiploc_instance":null,"arrival":"1703","departure":"1704","pass":null,"public_arrival":"1703","public_departure":"1704","platform":"2"},{"location_type":"LI","record_identity":"LI","tiploc_code":"BRKNHDP","tiploc_instance":null,"arrival":"1706","departure":"1706H","pass":null,"public_arrival":"1706","public_departure":"1706","platform":"1","line":null,"path":null,"engineering_allowance":null,"pathing_allowance":null,"performance_allowance":null},{"location_type":"LI","record_identity":"LI","tiploc_code":"BRKNCPK","tiploc_instance":null,"arrival":"1708H","departure":"1709","pass":null,"public_arrival":"1709","public_departure":"1709","platform":"1","line":null,"path":null,"engineering_allowance":null,"pathing_allowance":null,"performance_allowance":null},{"location_type":"LI","record_identity":"LI","tiploc_code":"HAMTSQ","tiploc_instance":null,"arrival":"1711","departure":"1711H","pass":null,"public_arrival":"1711","public_departure":"1711","platform":"1","line":null,"path":null,"engineering_allowance":null,"pathing_allowance":null,"performance_allowance":null},{"location_type":"LI","record_identity":"LI","tiploc_code":"JAMESST","tiploc_instance":null,"arrival":"1714","departure":"1714H","pass":null,"public_arrival":"1714","public_departure":"1714","platform":"1","line":null,"path":null,"engineering_allowance":null,"pathing_allowance":null,"performance_allowance":null},{"location_type":"LI","record_identity":"LI","tiploc_code":"MORFLDS","tiploc_instance":null,"arrival":"1715H","departure":"1716","pass":null,"public_arrival":"1716","public_departure":"1716","platform":"3","line":null,"path":null,"engineering_allowance":null,"pathing_allowance":null,"performance_allowance":null},{"location_type":"LI","record_identity":"LI","tiploc_code":"LVRPLSL","tiploc_instance":null,"arrival":"1717H","departure":"1718","pass":null,"public_arrival":"1718","public_departure":"1718","platform":"1","line":null,"path":null,"engineering_allowance":null,"pathing_allowance":null,"performance_allowance":null},{"location_type":"LI","record_identity":"LI","tiploc_code":"LVRPLCL","tiploc_instance":null,"arrival":"1719H","departure":"1720","pass":null,"public_arrival":"1720","public_departure":"1720","platform":"3","line":null,"path":null,"engineering_allowance":null,"pathing_allowance":null,"performance_allowance":null},{"location_type":"LI","record_identity":"LI","tiploc_code":"JAMESST","tiploc_instance":"2","arrival":null,"departure":null,"pass":"1721H","public_arrival":null,"public_departure":null,"platform":"3","line":null,"path":null,"engineering_allowance":null,"pathing_allowance":"H","performance_allowance":null},{"location_type":"LI","record_identity":"LI","tiploc_code":"HAMTSQ","tiploc_instance":"2","arrival":"1724H","departure":"1725","pass":null,"public_arrival":"1725","public_departure":"1725","platform":"3","line":null,"path":null,"engineering_allowance":null,"pathing_allowance":null,"performance_allowance":null},{"location_type":"LI","record_identity":"LI","tiploc_code":"BRKNCPK","tiploc_instance":"2","arrival":"1726H","departure":"1727","pass":null,"public_arrival":"1727","public_departure":"1727","platform":"2","line":null,"path":null,"engineering_allowance":null,"pathing_allowance":null,"performance_allowance":null},{"location_type":"LI","record_identity":"LI","tiploc_code":"BRKNHDP","tiploc_instance":"2","arrival":"1729","departure":"1729H","pass":null,"public_arrival":"1729","public_departure":"1729","platform":"2","line":null,"path":null,"engineering_allowance":null,"pathing_allowance":null,"performance_allowance":null},{"location_type":"LI","record_identity":"LI","tiploc_code":"BRKNHDN","tiploc_instance":"2","arrival":"1731H","departure":"1732H","pass":null,"public_arrival":"1732","public_departure":"1732","platform":"3","line":null,"path":null,"engineering_allowance":null,"pathing_allowance":null,"performance_allowance":null},{"location_type":"LI","record_identity":"LI","tiploc_code":"BDSTNEJ","tiploc_instance":"2","arrival":null,"departure":null,"pass":"1734","public_arrival":null,"public_departure":null,"platform":null,"line":null,"path":null,"engineering_allowance":null,"pathing_allowance":null,"performance_allowance":null},{"location_type":"LI","record_identity":"LI","tiploc_code":"WALASYV","tiploc_instance":"2","arrival":"1736H","departure":"1737","pass":null,"public_arrival":"1737","public_departure":"1737","platform":"2","line":null,"path":null,"engineering_allowance":null,"pathing_allowance":null,"performance_allowance":null},{"location_type":"LI","record_identity":"LI","tiploc_code":"WALAGRD","tiploc_instance":"2","arrival":"1738","departure":"1738H","public_arrival":"1738","public_departure":"1738","platform":"2","line":null},{"location_type":"LT","record_identity":"LT","tiploc_code":"NBTN","tiploc_instance":"2","arrival":"1743","public_arrival":"1743","platform":"1"}]}}

/**
 * Schema definition
 */
var ScheduleSchema = mongoose.Schema({
         train_id:{type:String},
		 train_uid:{ type: String },
		 applicable_timetable:{ type: String },
		 schedule_start_date:{ type: Date },
		 schedule_end_date:{ type: Date },
         atoc_code:{ type: String },
		 schedule_days_runs:[],
		 time_start:{ type:Number},
		 time_end:{ type:Number},
		 stanox:{type:Number},
         time_schedule: [ {tiploc_code:String,
		         platform:String,
		         departure:Number,
		         public_departure:Number,
		         arrival:Number,
		         public_arrival:Number,
				 pass:Number}]        				 
});



/**
 * Define model.
 */

var ScheduleModel = mongoose.model('Schedule',ScheduleSchema);
exports.ScheduleModel = ScheduleModel;

/**
 * Pre hook.
 */
ScheduleSchema.pre('save', function(next, done){
  //console.log('ScheduleModel  save');
  next();
});

ScheduleSchema.post('save', function (doc) {
  //console.log('%s has been saved', doc._id);
});

ScheduleSchema.post('remove', function (doc) {
  console.log('%s has been removed', doc._id);
});

/**
 * static Methods
 */
ScheduleSchema.statics.findByTrainAndTime = function (name, date, cb) {
    var day = date.getDay();
    if(day==0) day = 7; 
	this.findOne({'train_uid':name,"schedule_start_date": {"$lte": date},"schedule_end_date":{"$gte":date},"schedule_days_runs":{'$in':[day]}},'train_uid schedule_end_date schedule_start_date atoc_code schedule_days_runs',cb);
}

function findByTrainAndTime(name,date,callback){
    var day = date.getDay();
    if(day==0) day = 7; 
	ScheduleModel.findOne({'train_uid':name,"schedule_start_date": {"$lte": date},"schedule_end_date":{"$gte":date},"schedule_days_runs":{'$in':[day]}},
	              'train_uid   atoc_code time_schedule.arrival time_schedule.tiploc_code time_schedule.departure time_schedule.platform time_schedule.pass',
	              callback);

}


/**
 * Methods
 */
function createNewSchedule(data,callback){
	ScheduleModel.create(data,function(err,docs){
	    console.log('create  new schedule  '+data.time_start,data.time_end);
		if(err) {
			console.log('createNewSchedule err '+err);
			callback(err, null);
		}
		else {
			//console.log('ScheduleModel insert   '.green+docs.length);
			callback(null, docs);
		}
	})	
}




/**
train_uid
schedule_end_date
schedule_start_date
atoc_code
schedule_days_runs

time_schedule

	       	scheduleModel.findSchedules({"schedule_start_date": {"$lte": today},"schedule_end_date":{"$gte":today}, "schedule_days_runs":{'$in':[day]}// // {"$where": {this.schedule_days_runs.length:{"$gt":0}}}	
			                         },{'skip':0},function(err,data){  
			        console.log(" received  data       ".green+data.length);
			        data.forEach(function(doc){
				      //console.log("each doc     ".red+doc.train_uid+"   "+doc.schedule_end_date+"    "+doc.schedule_start_date +"   "+doc.schedule_days_runs+"   ");
				      //console.log("each doc     ".green+doc.train_uid+"   "+doc.schedule_days_runs+"   "+doc.time_schedule.length);

			        });
	        });
			
			
			
			
			scheduleModel.findByTrainAndTime("Y64110",today,function(err, doc){
		               if(err){callback(err, null);}
		               else{
			                 console.log("#77777777777777777777777  find one");
			                 if(typeof doc != undefined)
			                 {
							   //console.log("each schedule     ".green+doc.train_uid+"   "+doc.schedule_end_date+"    "+doc.schedule_start_date+"   "+doc.schedule_days_runs );
							   console.log("each schedule     ".green+doc.train_uid+"   "+ doc.time_schedule.length);
							   console.log(doc.time_schedule);
							   //
							 }
			                 else
			                 console.log('findOneSchedule is null'.red);
			                 callback(null, doc);
		                }
	        });


**/
		 
function findSchedules(condition,option,callback){
    if(option.limit == undefined) { console.log('undefined limit'); option.limit = 0;}
	ScheduleModel.find(condition,'train_uid time_start time_end schedule_end_date schedule_start_date  time_schedule',{'limit':option.limit,'skip':option.skip}, function(err, docs){
		   if(err){ callback(err, null); } //
		   else
		   {
			   console.log("findSchedules    with  length   ".green +docs.length);	
               if(docs.length==0){
			      ScheduleModel.count(function(err,data){
    	                 console.log("schedule count %d".green,data);
	               });
			   }			   
			   docs.forEach(function(doc){
				   //console.log("each doc     ".red+doc.train_uid+"   "+doc.schedule_end_date+"    "+doc.schedule_start_date +"   "+doc.schedule_days_runs+"   "+doc.time_schedule);
				   //console.log("each doc 111    ".red+doc.train_uid+"   "+doc.schedule_days_runs,doc.start_time,doc.end_time);

			   });
			   callback(err,docs);
		   }
	});
}



// find the train schedule by train id, schedule start date and schedule end date
// Model.findById(id, [fields], [options], [callback])
// Model.findOne(conditions, [fields], [options], [callback])
function findOneSchedule(condition,callback){
	ScheduleModel.findOne(condition,'train_uid schedule_end_date schedule_start_date atoc_code schedule_days_runs',function(err, doc){
		if(err){callback(err, null);}
		else{
			console.log("findOneSchedule   #############  find one");
			if( doc != null)
			{
      			console.log("each schedule     ".green+doc.train_uid+"   "+doc.schedule_end_date+"    "+doc.schedule_start_date );
			}
			else{
			  console.log('findOneSchedule is null'.red);
			}
			callback(null, doc);			
		}
	})	
}


function findOneScheduleTimeline(condition,callback){
	ScheduleModel.findOne(condition,'train_uid time_schedule.tiploc_code time_schedule.arrival time_schedule.departure time_schedule.platform',function(err, doc){
		if(err){callback(err, null);}
		else{
			//console.log("findOneSchedule   #############  find one");
			if( doc != null)
			{
      			//console.log("each schedule     ".green+doc.train_uid+"   "+doc.schedule_end_date+"    "+doc.schedule_start_date );
			}
			else{
			  console.log('findOneSchedule is null'.red);
			}
			callback(null, doc);			
		}
	})	
}


// Model.findOneAndUpdate([conditions], [update], [options], [callback])
// Model.findByIdAndUpdate(id, [update], [options], [callback])
function updateSchedule(condition,callback){
	
	var options = { new: false };
	ScheduleModel.findOneAndUpdate(condition, update,options,function(err,ref){
		if(err) {
			console.log('err');
			callback(err, null);
		}
		else
		{
			  console.log('updage  on '+ref);	
			  callback(null,ref);
		}
	})
}

// Model.findOneAndRemove(conditions, [options], [callback])
// Model.findByIdAndRemove(id, [options], [callback])
function deleteSchedule(condition,callback){	
	if(ScheduleModel){
		ScheduleModel.remove(condition,function(err){
			  if(err){console.log('err remove');callback(err, null);}	
			  else {
				  console.log('remove good ');
				  callback(null);
			  }
		});
	}
}

function clearScheduleCollection(callback){

    deleteSchedule({},callback);
	
}


function getDistinctValues(field,callback){
	if(ScheduleModel){
	    console.log("model getDistinctValues      ".green+field);
		ScheduleModel.collection.distinct(field,function(err,results){
			  if(err){console.log('err on getDistinctValues        '.red+err);callback(err, null);}	
			  else {
				  console.log('getDistinctValues ');
				  callback(null,results);
			  }
		});
	}
}



function updateRailId(uid,id,update,callback){
	var options = { multi : true };
	ScheduleModel.update({'train_uid':uid},{'$set':{'train_id':id}},options,function(err, numberAffected, raw){
		if(err) {
			console.log('err      '.red +err);
			callback(err, null);
		}
		else
		{
		  console.log('The number of updated documents was %d', numberAffected);
          console.log('The raw response from Mongo was ', raw);
		  callback(null,numberAffected);
		}
	})
}

function updateField(tiploc,stanox,callback){
    console.log('update filed   ');
	var options = { multi : true };
	ScheduleModel.update({'time_schedule.tiploc_code':tiploc},{'$set':{'time_schedule.stanox':stanox}},options,function(err, numberAffected, raw){
		if(err) {
			console.log('err      '.red +err);
			callback(err, null);
		}
		else
		{
		  console.log('The number of updated documents was %d', numberAffected);
          console.log('The raw response from Mongo was ', raw);
		  callback(null,numberAffected);
		}
	})
}

exports.createNewSchedule = createNewSchedule;
exports.findSchedules =findSchedules;
exports.findOneSchedule = findOneSchedule;
exports.updateSchedule = updateSchedule;
exports.deleteSchedule = deleteSchedule;
exports.clearScheduleCollection = clearScheduleCollection;
exports.getDistinctValues = getDistinctValues;
exports.findByTrainAndTime = findByTrainAndTime;
exports.updateRailId = updateRailId;
exports.updateField = updateField;
exports.findOneScheduleTimeline = findOneScheduleTimeline;