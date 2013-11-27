/**
 * Module dependencies.
 */	
var mongoose = require('../app').mongoose;
var ObjectId = mongoose.Schema.ObjectId;
var colors = require('colors');
////////////////////////////////////////////////////////////////////////////////
// {"main_train_uid":"Y63390","assoc_train_uid":"Y63237","assoc_start_date":"2013-03-29T00:00:00Z","assoc_end_date":"2013-03-29T00:00:00Z","assoc_days":"0000100","location":"KKBY","CIF_stp_indicator":"C"}

/**
 * Schema definition
 */
var RailReferenceSchema = mongoose.Schema({
		 stanox:{ type: Number},
		 tiploc:{ type: String, unique:true, index: true },
		 atco:{ type: String},
		 CrsCode:{ type: String },
         StationName:{ type: String },
		 Easting:Number,
		 Northing:Number,
});

/**
 * Define model.
 */
var RailReferenceModel = mongoose.model('RailReference',RailReferenceSchema);
exports.RailReferenceModel = RailReferenceModel;

/**
 * Pre hook.
 */
RailReferenceSchema.pre('save', function(next, done){
  //console.log('RailReferenceModel  save');
  next();
});

RailReferenceSchema.post('save', function (doc) {
  console.log('%s has been saved', doc._id);
});

RailReferenceSchema.post('remove', function (doc) {
  console.log('%s has been removed', doc._id);
});
/**
 * Methods
 */
 
function createNewRailReference(data,callback){
	RailReferenceModel.create(data,function(err,docs){
		if(err) {
			console.log('createNewRailReference  err '.red+err);
			callback(err, null);
		}
		else {
			//console.log('RailReferenceModel insert   '.green+docs.length);
			callback(null, docs);
		}
	})	
}


function findRailReferences(condition,callback){

	RailReferenceModel.find({},'tiploc stanox',{'limit':10,'skip':0}, function(err, docs){
		   if(err){ callback(err, null); } //
		   else
		   {
			   console.log("#################################  find all");
			   //console.log(docs); // Does not work
			   docs.forEach(function(doc){
				   console.log("each doc     "+doc.people+"   "+doc.questions+"    "+doc.tags );
			   });
			   callback(err,docs);
		   }
	});
}

//  rail_referenceModel.findOneRailReference({'tiploc':'ABGLELE'},function(err,data){console.log("data:".red+"   "+data);});
function findOneRailReference(condition,callback){
	RailReferenceModel.findOne(condition,function(err, doc){
		if(err){callback(err, null);}
		else{
			//console.log("# findOneRailReference find one");
			//console.log(doc);
			callback(null, doc);
		}
	})	
}
// rail_referenceModel.findStanoxByTicloc('ABGLELE',function(err,data){console.log("data:".red+"   "+data);});
function findStanoxByTicloc(ticloc,callback){
	RailReferenceModel.findOne({'tiploc':ticloc},'stanox',function(err, doc){
		if(err){callback(err, null);}
		else{
			//console.log("#findStanoxByTicloc  find one");
			//console.log(doc);
			callback(null, doc);
		}
	})	
}

/****
    	   rail_referenceModel.RailReferenceModel.find({'stanox':{'$ne':null}},'tiploc stanox',{'limit':100,'skip':0},function(err,data){
    			if(err) console.log(err);
    			else console.log('RailReference find    '.green+data.length);
				console.log(data);   			
    	   });	

*/
function findAllStanoxNotNull(callback){

    	RailReferenceModel.find({'stanox':{'$ne':null}},'tiploc stanox',{'limit':0,'skip':0},function(err,data){
    			if(err) {console.log(err);callback(err,null);}
    			else {
				  console.log('RailReference find    '.green+data.length);
				  //console.log(data);
                  callback(null,data);				  
                }				
    	});	
}


/****
		rail_referenceModel.updateRailReference({'tiploc':'ABGLELE'},{'$set':{'stanox':40073}},
		                                           function(err,data)
												   { 
												       console.log("update success".red+"    "+data);
												   });

****/

function updateRailReference(condition,update,callback){
	var options = { new: false };
	RailReferenceModel.findOneAndUpdate(condition, update,options,function(err,ref){
		if(err) {
			console.log('err      '.red +err);
			callback(err, null);
		}
		else
		{
			  //console.log('update  on '+ref);	
			  callback(null,ref);
		}
	})
}

function deleteRailReference(condition,callback){
	
	if(RailReferenceModel){
		RailReferenceModel.remove(condition,function(err){
			  if(err){console.log('err remove');callback(err, null);}	
			  else {
				  console.log('remove good ');
				  callback(null);
			  }
		});
	}
}

function clearRailReferenceCollection(callback){

    deleteRailReference({},callback);
	
}

exports.createNewRailReference = createNewRailReference;
exports.findRailReferences =findRailReferences;
exports.findOneRailReference = findOneRailReference;
exports.updateRailReference = updateRailReference;
exports.deleteRailReference = deleteRailReference;
exports.clearRailReferenceCollection = clearRailReferenceCollection;
exports.findStanoxByTicloc = findStanoxByTicloc;
exports.findAllStanoxNotNull = findAllStanoxNotNull;