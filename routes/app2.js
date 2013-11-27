var app = require('../app').app;
var request = require("request");
var fs = require('fs');
var lazy = require("lazy")
var scheduleModel = require('../model/schedule_model3');

app.get('/api', function(req, res) {
    var url;
    url = 'http://faxianla.com/mark/popular.jsn?offset=0&_=1332062171115';
    return request.get(url, function($err, $res, $body) {
      var data, i, img, info, json, key, _i, _len, _ref;
      data = JSON.parse($body);
      json = [];
      _ref = data.data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        info = {
          intro: i.title,
          src: i.image_url
        };
        key = new Buffer(JSON.stringify(info), 'utf-8').toString('base64');
        img = new Buffer(i.image_url, 'utf-8').toString('base64');
        console.log(img);
        json.push({
          id: key.replace(/\//gi, '|#|'),
          intro: i.title,
          src: img
        });
      }
      return res.send(json);
    });
});


app.get('/stations',function(req,res){
   
   var join = require('path').join, file = join(__dirname, '../uploads','data.json'); 
   var a = new Array();   
   new lazy(fs.createReadStream(file))
     .lines
     .forEach(function(line){
	    var d = JSON.parse(line.toString());
	    //console.log(d.lat+"   "+d.lng);
		a.push(d);
      }).on('pipe', function() {
         res.send(a);             
     });
});

app.post('/example',function(req,res){
    // not working
    //console.log(req.body.name+"  "+req.body.name,req.body.time);
   
    if (req.method == 'POST') {
    console.log("[200] " + req.method + " to " + req.url);     
    req.on('data', function(chunk) {
      console.log("Received body data:");
      console.log(chunk.toString());
	  var a = JSON.parse( chunk.toString() );
	  console.log(a.name,a.time);
    });   
    req.on('end', function() {
      // empty 200 OK response for now
      res.writeHead(200, "OK", {'Content-Type': 'text/html'});
      res.end();
    });
    
  } 
  
});


app.post('/trackGeo',function(req,res){
    // not working
    //console.log(req.body.name+"  "+req.body.name,req.body.time);
   
    if (req.method == 'POST') {
	var body = '';
    console.log("[200] " + req.method + " to " + req.url);     
    req.on('data', function(chunk) {      
      body+=chunk;
	  if(body.length > 1e6) {
         body = "";
         res.writeHead(413, {'Content-Type': 'text/plain'});
         res.connection.destroy();
      }	  
    });   
    req.on('end', function() {
	  console.log("Received body data:");      
	  var a = JSON.parse( body.toString() );
	  console.log(body.toString());
	  var stream = fs.createWriteStream('geo.json',{'flags': 'a'});
	  for(var i=0;i<a.length;i++){
	      console.log(a.length);
		  stream.write(JSON.stringify(a[i])+"\n");
	  }
	  stream.end();
      // empty 200 OK response for now
      res.writeHead(200, "OK", {'Content-Type': 'text/html'});
      res.end();
    });   
  }
});


app.get('/geo',function(req,res){
    console.log('/track geo');
	var join = require('path').join, file = join(__dirname, '../uploads','geo.json'); 
    var a = new Array(); 
    new lazy(fs.createReadStream(file))
     .lines
     .forEach(function(line){
	    var d = JSON.parse(line.toString());
		//console.log(line.toString());
	    //console.log(d.stations[0]+"   "+d.points.length);
		a.push(d);
      }).on('pipe', function() {
         res.send(a);             
     });
})


app.get('/schedule/:id',function(req,res){

    var id = req.params.id;
    console.log("retrieving schedule: "+id);
	scheduleModel.findOneScheduleTimeline({'train_uid':id},function(err,data){
	 
	    console.log(data);
		res.send(data);
	})
	
   
	
	
})