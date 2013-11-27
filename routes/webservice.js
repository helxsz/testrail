var request = require("request");
var cheerio = require("cheerio");
var colors = require("colors");

var app = require('../app').app;

app.get('/railway/departure', function (req, res, next) {
	console.log("/railway/arrival/  "+req.query["city"]);
	var city = req.query["city"];
	if(typeof city == undefined || city == undefined) { console.log("if it undefined"); city ="liverpool-james-street"; }
	
	getRailwayDepart(city,
	  function(err,data){
	      res.send(data);
	  });
});

app.get('/railway/arrival', function (req, res, next) {
	console.log("/railway/arrival/  "+req.query["city"]);
	var city = req.query["city"];
	if(typeof city == undefined || city == undefined) { console.log("if it undefined"); city ="liverpool-james-street";}
	getRailwayArrival(city,
	   function(err,data){
	       res.send(data);
	    }
	   );
});

app.get('/ferry/', function (req, res, next) {
	console.log("//////");
    getFerryData(function(err,data){
	     res.send(data);
	})
});

function getFerryData(callback){
  request({
     uri: "http://www.aisliverpool.org.uk/passing.php",
   }, function(error, response, body) {
     var a = new Array();
     var $ = cheerio.load(body);
     $(".shipinfo > tr").each(function() {
	   var obj = new Object();
	   
       var link = $(this);
	   var time = $(this).find('td:nth-child(1) a').text();
	   var type = $(this).find('td:nth-child(3) a').text();
       var status = $(this).find('td:nth-child(4)').text();
	   var desti = $(this).find('td:nth-child(5)').text();
	   
	   obj.link = link;obj.time = time; obj.status = status; obj.desti = desti;
	   a.push(obj)
	   console.log(time+"   "+type+"   "+status+"   "+desti);	  	  
   });
    console.log("get ferry data  "+a.length );
	callback(null,a);
  });
  
}


function getRailwayArrival(station,callback){
   request({
    uri: "http://www.thetrainline.com/Live/arrivals/"+station,
   }, function(error, response, body) {
      var $ = cheerio.load(body);
	  
	  var a = new Array();
      $(".results-contents li a").each(function() {
        var link = $(this);
	    //var href = link.attr("href");
	    var due = $(this).find('.due').text().replace(/(\r\n|\n|\r|\t)/gm,"");	  
	    var destination = $(this).find('.destination').text().replace(/(\r\n|\n|\r|\t)/gm,"");
	    var on_time = $(this).find('.on-time-yes .on-time').text().replace(/(\r\n|\n|\r|\t)/gm,"");
		if(on_time == undefined)  var on_time_no = $(this).find('.on-time-no').text().replace(/(\r\n|\n|\r|\t)/gm,"");
	    var platform = $(this).find('.platform').text().replace(/(\r\n|\n|\r|\t)/gm,"");
		
		var obj = new Object();
		obj.due = due;obj.destination = destination; obj.on_time = on_time; obj.platform = platform;
	    a.push(obj);
	    console.log("arrival  ".green+due+"  "+destination+"  "+on_time+"  "+platform+"  "+on_time_no);	  	  
    });
	console.log("get station data  "+a.length +"   "+ $(".updated-time").text());
	callback(null,a);
	
  });
}

function getRailwayDepart(station,callback){
   request({
    uri: "http://www.thetrainline.com/Live/departures/"+station,
   }, function(error, response, body) {
      var $ = cheerio.load(body);
	  var a = new Array();
      $(".results-contents li a").each(function() {
        var link = $(this);
	    //var href = link.attr("href");
	    var due = $(this).find('.due').text().replace(/(\r\n|\n|\r|\t)/gm,"");	  
	    var destination = $(this).find('.destination').text().replace(/(\r\n|\n|\r|\t)/gm,"");
	    var on_time = $(this).find('.on-time-yes .on-time').text().replace(/(\r\n|\n|\r|\t)/gm,"");
		if(typeof on_time == undefined)  var on_time_no = $(this).find('.on-time-no').text().replace(/(\r\n|\n|\r|\t)/gm,"");
	    var platform = $(this).find('.platform').text().replace(/(\r\n|\n|\r|\t)/gm,"");
		
		var obj = new Object();
		obj.due = due;obj.destination = destination; obj.on_time = on_time; obj.platform = platform;
	    a.push(obj);		
	    console.log("departure   ".red+due+"  "+destination+"  "+on_time+"  "+platform+"  ".red+on_time_no);	  	  
     });
	 console.log("get station data  "+a.length +"   "+  $(".updated-time").text());
	callback(null,a);

  });
  
  
}

