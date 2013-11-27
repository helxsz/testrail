/**
 * Module dependencies.
 */			  
var mongoose = require('../app').mongoose;
var ObjectId = mongoose.Schema.ObjectId;
var colors = require('colors');

/**
 * Schema definition
 */
var StationRouteSchema = mongoose.Schema({
         stanox:{type:String,index:true,unique:true},
         points:{type:Array}		 
});

/**
 * Define model.
 */

var StationRouteModel = mongoose.model('StationRoute11',StationRouteSchema);
exports.StationRouteModel = StationRouteModel;

/**
 * Pre hook.
 */
StationRouteSchema.pre('save', function(next, done){
  //console.log('ScheduleModel  save');
  next();
});

StationRouteSchema.post('save', function (doc) {
  //console.log('%s has been saved', doc._id);
});

StationRouteSchema.post('remove', function (doc) {
  //console.log('%s has been removed', doc._id);
});

/**
 * Methods
 */
function createStationRoute(data,callback){
	StationRouteModel.create(data,function(err,docs){
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


function findOneStationRoute(condition,callback){
	StationRouteModel.findOne(condition,'points ',function(err, doc){
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


function deleteStationRoute(condition,callback){	
	if(StationRouteModel){
		StationRouteModel.remove(condition,function(err){
			  if(err){console.log('err remove');callback(err, null);}	
			  else {
				  console.log('remove good ');
				  callback(null);
			  }
		});
	}
}

function clearStationRoutes(callback){

    deleteStationRoute({},callback);
	
}
exports.createStationRoute =createStationRoute;
exports.findOneStationRoute=findOneStationRoute;
exports.deleteStationRoute=deleteStationRoute;
exports.clearStationRoutes=clearStationRoutes;