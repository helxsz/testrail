var colors = require('colors');
var app = require('../app').app;
var rail_referenceModel = require('../model/rail_reference_model');
var csv = require('csv');
var fs = require('fs');
var async = require('async');

app.get('/test/reference',function(req,res){
	rail_referenceModel.RailReferenceModel.count(function(err,data){
    	console.log("get References  number: count  %d".green,data);
		if(err) res.send(500,err);
		else res.json(200,{'count':data});
	});    
});

app.get('/test/reference/clear',function(req,res){
   clearDatabase();
   res.send(200);
})

app.get('/test/reference/update',function(req,res){
   checkAndUpdateReferences();
   res.send(200);
})



function checkAndUpdateReferences(){
	rail_referenceModel.RailReferenceModel.count(function(err,data){
    	console.log("checkAndUpdateReferences  : count  %d".green,data);
		if(data==0){
            importReferences(function(err,data){});
		}else{
		    
		}
	});
}

function importReferences(callback){
    
    async.series({
        importData: function(callback){
		    var join = require('path').join, file = join(__dirname, '../uploads/','RailReferences.csv');
            parser = csv()
            .from.stream(  fs.createReadStream(file) , {columns: true}   )
            .on('record', function(row,index){
                console.log('#'+index+' '+row.AtcoCode.green+'    '+row.TiplocCode.green+'     '+row.CrsCode.green+'    '+row.StationName.green+'    '+row.Easting.green+'    '+row.Northing.green);
                rail_referenceModel.createNewRailReference({'tiploc':row.TiplocCode,'atco':row.AtcoCode,'CrsCode':row.CrsCode,'StationName':row.StationName,'Easting':row.Easting,'Northing':row.Northing},function(err,docs){
		   
    	        });			
		    })
            .on('end',function(error){
                process.stdout.write("\n");
				
			    rail_referenceModel.RailReferenceModel.count(function(err,data){
    	            console.log("RailReference count %d".green,data);
					callback(null, 2);
	            });
            })
            .on('error',function(error){
                console.log(error.message.red);
				callback(null, 2);
            });            			
        },
	    updateData: function(callback){
		    var join = require('path').join, file = join(__dirname, '../uploads/','tiplocs.csv');
		    parser = csv()
            .from.stream(  fs.createReadStream(file) , {columns: true}   )
            .on('record', function(row,index){               
                console.log('#'+index+'     '+row.stanox.green+'     '+row.tiploc.green);			   
		   	    rail_referenceModel.updateRailReference({'tiploc':row.tiploc},{'$set':{'stanox':row.stanox}},
		            function(err,data){ 
					    console.log("update success".red+"    "+data);
			        });													 
            })
            .on('end',function(error){
                  process.stdout.write("\n");
				  callback(null,3);
            })
            .on('error',function(error){
                console.log(error.message.red);
                callback(null,3);
		    });		    
	    },
	    test:function(callback){
			rail_referenceModel.findStanoxByTicloc('ABGLELE',function(err,data){console.log("data:".red+"   "+data);});							   
	        // rail_referenceModel.findAllStanoxNotNull(function(){});
		    callback(null,4);
	    }
    },
    function(err, results) {
        //console.log('async    '+results.clearDB+"   "+results.importData+"  "+results.updateData);
		if(err) callback(err,null);
		else callback(null,results);
    });
}


function updateReference2(){

		
}



function clearDatabase(){
     rail_referenceModel.clearRailReferenceCollection(function(){});
}
