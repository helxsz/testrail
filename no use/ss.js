var fs = require('fs'),util = require('util'),
    EventEmitter = require('events').EventEmitter;
		
var join = require('path').join, file = join(__dirname, 'uploads','test_schedule.json'); 		
		
var Dirty = exports.Dirty = function(path) {

  console.log("init dirty   "+path );
  EventEmitter.call(this);

  this._readStream = null;
  this._writeStream = null;

  this._load();
};	


Dirty.prototype._load = function() {
  var self = this, buffer = '', length = 0;

  console.log('load');
  
  if (!this.path) {
    process.nextTick(function() {
      //self.emit('load', 0);
    });
    return;
  }

  this._readStream = fs.createReadStream(this.path, {
    encoding: 'utf-8',
    flags: 'r'
  }).pipe(process.stdout);

  this._readStream
    .on('error', function(err) {
      if (err.code === 'ENOENT') {
        //self.emit('load', 0);
        return;
      }

      //self.emit('error', err);
    })
    .on('data', function(chunk) {
      buffer += chunk;
	  console.log(chunk);
      if (chunk.lastIndexOf('\n') == -1) return;
      var arr = buffer.split('\n');
      buffer = arr.pop();
      arr.forEach(function(rowStr) {
        if (!rowStr) {
          //self.emit('error', new Error('Empty lines never appear in a healthy database'));
          return
        }
        try {
          var row = JSON.parse(rowStr);
          console.log(row);
        } catch (e) {
          //self.emit('error', new Error('Could not load corrupted row: '+rowStr));
          return '';
        }

        return '';
      });
    })
    .on('end', function() {
      if (buffer.length) {
        //self.emit('error', new Error('Corrupted row at the end of the db: '+buffer));
      }
      //self.emit('load', length);
    });

};



var db = new Dirty(file);

/*****


*****/

var     lazy    = require("lazy"),
        fs  = require("fs");

 new lazy(fs.createReadStream(file))
     .lines
     .forEach(function(line){
         //console.log(line.toString());
		 var data = JSON.parse(line.toString());
		 if(typeof data.JsonAssociationV1 != 'undefined')
         {
		   //console.log(data.JsonAssociationV1.main_train_uid+"   "+data.JsonAssociationV1.assoc_train_uid     +"   "+data.JsonAssociationV1.assoc_start_date    +"   "+data.JsonAssociationV1.assoc_end_date    +"   "+data.JsonAssociationV1.assoc_days    +"   "+data.JsonAssociationV1.location   +"   "+data.JsonAssociationV1.CIF_stp_indicator);
         }else{
		     console.log(data.JsonScheduleV1.CIF_stp_indicator+"   "+  data.JsonScheduleV1.CIF_train_uid  +"   "+  data.JsonScheduleV1.schedule_days_runs   +"   "+  data.JsonScheduleV1.schedule_end_date   +"   "+  data.JsonScheduleV1.schedule_segment.schedule_location.length  +"   "+  data.JsonScheduleV1.schedule_start_date  );
			 var sche = data.JsonScheduleV1.schedule_segment.schedule_location;
			 //console.log(sche);
			 for(var i=0;i<sche.length;i++){
			      console.log(sche[i].tiploc_code +"  "+sche[i].arrival+"  "+sche[i].departure+"  "+sche[i].public_arrival+"  "+sche[i].public_departure +"  "+sche[i].platform);
			 }
	     }
	 }
 );
 
 /*********
 
 http://nodejs.org/api/zlib.html
 *********/
 
 var zlib = require('zlib');
 var gzip = zlib.createGzip();
var fs = require('fs');
var inp = fs.createReadStream('input.txt');
var out = fs.createWriteStream('input.txt.gz');
inp.pipe(gzip).pipe(out);