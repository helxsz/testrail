/**
 * Module dependencies.
 */			  
var mongoose = require('../app').mongoose;
var ObjectId = mongoose.Schema.ObjectId;
var colors = require('colors');

/**
 * Schema definition
 */
var TrainSchema = mongoose.Schema({
         train_id:{type:String,index:true,unique:true},
		 train_uid:{ type: String },
		 start_time:{ type: Number },
		 end_time:{ type: Number },
		 stanox:{ type: Number },
		 timeline:[{
					stanox:Number,
					arrival:Number,
					departure:Number,
					pass:Number,
					platform:Number		 		 
		 }],
		 
		 event:String,
		 stanox:Number,
         geo: {type: [Number,Number], index: '2d'},		 
		 events:[{next_event:String,event:String,stanox:Number,next_stanox:Number,timestamp:Number}],
		 lastStatus:''
		 /*
		 time_schedule: [ {
		         stanox:String,
		         platform:String,
		         departure:Number,
		         public_departure:Number,
		         arrival:Number,
		         public_arrival:Number,
				 pass:Number
		}] 
		 */
});

/**
 * Define model.
 */

var TrainModel = mongoose.model('Train',TrainSchema);
exports.TrainModel = TrainModel;

/**
 * Pre hook.
 */
TrainSchema.pre('save', function(next, done){
  //console.log('ScheduleModel  save');
  next();
});

TrainSchema.post('save', function (doc) {
  console.log('%s   create new train  has been saved', doc._id);
});

TrainSchema.post('remove', function (doc) {
  console.log('%s has been removed', doc._id);
});


/**
 * Methods
 {'train_id':,'train_uid':,'start_time':,'end_time':, }
 */  
function createNewTrain(data,callback){
    try{
    console.log('createNew Train  '+data.train_uid,data.train_id,data.start_time,data.end_time,data.timeline.length);
    }catch(err){console.log(err+"  ".red)}
	TrainModel.create(data,function(err,docs){
		if(err) {
			console.log('create TrainModel err '.red+err);
			callback(err, null);
		}
		else {
			//console.log('TrainModel insert   '.green+docs.length);
			callback(null, docs);
		}
	})	
}

function findTrain(condition,callback){
    //if(option.limit == undefined) { console.log('undefined limit'); option.limit = 0;}
	
	TrainModel.find(condition,'train_id train_uid start_time end_time geo  events timeline',{'limit':0,'skip':0}, function(err, docs){
		   if(err){ callback(err, null); } //
		   else
		   {
		       if(docs.length>0)
			   console.log("train model   findTrain   with  length   ".red +docs.length);			   
			   docs.forEach(function(doc){
				   //console.log("each doc     ".red+doc.train_uid+"   "+doc.schedule_end_date+"    "+doc.schedule_start_date +"   "+doc.schedule_days_runs+"   "+doc.time_schedule);
				   //console.log("findTrain   each doc     ".red+doc.train_uid+"   "+doc.geo+"   ");
			   });
			   callback(err,docs);
		   }
	});
}
// db.collection.find( { "field": { "$within": { "$box": [ coordinate0, coordinate1 ] } } } )  // http://docs.mongodb.org/manual/applications/geospatial-indexes/
// {'geo':{'$within':{'$box':[[0, 0],[3, 3] ]}}}
function findTrainByGeo(geo1,geo2,option,callback){
    if(option.limit == undefined) { console.log('undefined limit'); option.limit = 0;}
	
	TrainModel.find(condition,'train_id train_uid geo stop',{'limit':option.limit,'skip':option.skip}, function(err, docs){
		   if(err){ callback(err, null); } //
		   else
		   {
			   //console.log("#################################  find all   with  length   ".red +docs.length);			   
			   docs.forEach(function(doc){
				   //console.log("each doc     ".red+doc.train_uid+"   "+doc.schedule_end_date+"    "+doc.schedule_start_date +"   "+doc.schedule_days_runs+"   "+doc.time_schedule);
				   console.log("each doc     ".red+doc.train_uid+"   "+doc.geo+"   ");
			   });
			   callback(err,docs);
		   }
	});
}

function updateTrainInfo(condition,update,callback){

	var options = { new: true };
	//TrainModel.findOneAndUpdate(condition, update,options,function(err,ref){
	TrainModel.update(condition, update,options,function(err,ref){
		if(err) {
			console.log('err');
			callback(err, null);
		}
		else
		{
		      if(ref ==0) console.log(' not found the record for train'.red);
			  else if(ref ==1)console.log('found the record and update success'.green+ref);
			  callback(null,ref);
		}
	})
	
}

function deleteTrain(condition,callback){	
	if(TrainModel){
		TrainModel.remove(condition,function(err){
			  if(err){console.log('err remove');callback(err, null);}	
			  else {
				  console.log('remove good ');
				  callback(null);
			  }
		});
	}
}

function clearTrainCollection(callback){

    deleteTrain({},callback);
	
}

exports.createNewTrain = createNewTrain;
exports.findTrain = findTrain;
exports.findTrainByGeo = findTrainByGeo;
exports.updateTrainInfo = updateTrainInfo;
exports.clearTrainCollection = clearTrainCollection;