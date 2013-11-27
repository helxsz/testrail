$.ajax({
       type: "POST",
       url: "/example",
       data: '{ "name": "John", "time": "2pm" }',
});

var mapView;
/////////////////////////////////////////////////////////////////////////////////////////////////
// Map view searchchange
var map;
var myOptions = {
	zoom: 14,
	center: new google.maps.LatLng(53.331693,-2.918243),
	mapTypeControl: false,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};	
var polyline = new google.maps.Polyline({
		path: [],
		strokeColor: '#0000FF',
		strokeWeight: 4,
        strokeOpacity: 0.6,
		geodesic:true,
		editable:true,
});
//http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html , https://developers.google.com/maps/documentation/javascript/styling
var stylez = [
      {
        featureType: "all",
        stylers: [
          { hue: "#0000ff" },
          { saturation: -75 }
        ]
      },
      {
        featureType: "poi",
        elementType: "label",
        stylers: [
          { visibility: "off" }
        ]
      },
	  {
       featureType: "transit.line",
       elementType: "geometry.fill",
       stylers: [
		 { color: "#99FF33" },		 
		 { hue: '#ff2200'},
		 {saturation: '59'},
         {lightness: '-36'},
		 {gamma:'1.77'}
       ]
    }
];
var styledMapType = new google.maps.StyledMapType(stylez, {name: "Edited"});
//polyline.setMap(map);




console.log('interval');
/* 
    schedules.showTheRunningTrains(function(trains){	
	   	for(var i=0;i<trains.length;i++){
	       console.log('schedule running train   ',trains[i].get('trainId'));
		   var timeline = train[i].get('timeline');
		   for(var j=0;j<timeline.length;j++){
		       console.log( trains[i].get('trainId'),'   ', timeline.get(i)  );
		   }
	    } 	
	});
*/  
   // collection.each(function(model) { model.destroy(); } )
  
    //var storeVar = localStorage.getItem("ScheduleStorage");
    //console.log(storeVar);
	//console.log( localStorage.getItem("RouteStorage"));
    //console.log('interval');
    //schedules.showAll();
	//console.log( window.routes.get([36060,35001]).get('points') );
	
    //var ls = new Backbone.LocalStorage("ScheduleStorage");
    //console.log(ls.findAll());	
	
    //console.log(window.schedules.length);
	/*
	window.schedules.each(function(model){
          //console.log(model.get('trainId')+','+model.get('trainUid'))		  
		   var timeline = model.get('timeline');
		   var c_station, next_station; var departure, arrival;
		   var d = new Date();
		   var time = d.getHours()*60 + d.getMinutes()-100;
		   var found = false;
		   for(var j=0;j<timeline.length-1;j++){
			    c_station = timeline[j][0];  next_station = timeline[j+1][0];
			   if(timeline[j].length==4)       departure = timeline[j][2];
			   if(timeline[j].length==2)       arrival = timeline[j][1];
			   arrival = timeline[j+1][1];
		       console.log('----------------------------  checking '+model.get('trainId'),departure, timeline[j] ,timeline[j].length,time );			   
			   if( (time<=arrival) && (time>=departure)){

				  model.set({'at':j});
				  model.save(); found = true;
				  break;
			   }
		   }
		   var all_duration,duration;
           if(found ==true){
		      duration = departure - time; 
			  all_duration = arrival - time;		   
			  console.log('------------------------------------------------------------------------------------------'+
				' find it   '+duration,model.get('trainId'),arrival,departure,c_station,next_station,'station '+j);		   		  
		   }
		   
	})
*/	




/////////////////////////////////////////////////////////////////////////////////////////
window.stations;
window.routes;
var stationIcon = new google.maps.MarkerImage('assets/img/MerseyRailLogo3.png');
var stationMap = new Object();	

window.Station = Backbone.Model.extend({
	//urlRoot:"/stations",
    initialize: function(){		
		this.bind("remove", function() {
		  console.log('remove Station');
          this.destroy();
        });
    },	
	defaults:{
		"station":"",
		"web":"",
		"lng":0,
		"lat":0,
		"stanox":0,
		"tip":"",
		'marker': new google.maps.Marker()
	},
	idAttribute: 'stanox'
	
});

window.stationsCollection = Backbone.Collection.extend({
  //localStorage: new Backbone.LocalStorage("stationsStorage"),
  model: Station,
  url:"/stations",    
  initialize:function(){
      this.on("add", function(station) {
	     console.log('add new stations',station);
      });
      this.on("remove", function(station) {
	     console.log('remove a station',station);
      })
  },showAll:function(){
      this.each(function(model){
          console.log(model.get('web'),model.get('lat'),model.get('lng'),model.get('station'))
      })
  },refreshFromServer: function() {
        return Backbone.ajaxSync('read', this);    
    } 
});

///////////////////////////////////////////////////////////////////////////////////
/**/
window.Route = Backbone.Model.extend({
	defaults:{
		"stations":new Array(),
		"points":new Array(),
		"distance":0
	},
    idAttribute: 'stations',
	initialize:function(option){

  }
    	
});

//url:"http://localhost:8080/geo",
window.RouteCollection = Backbone.Collection.extend({
  localStorage: new Backbone.LocalStorage("RouteStorage"),
  model: Route, 
  initialize:function(){
      this.on("add", function(station) {
      });
      this.on("remove", function(station) {
      })
  },
  showAll:function(){
      this.each(function(model){
          console.log();
      })
  }
  /*,fetch:function() {
    // store reference for this collection
    var collection = this;
    $.ajax({
        type : 'GET',
        url : "http://localhost:8080/geo",
        dataType : 'json',
        success : function(data) {
            console.log(data.length);
			//console.log(JSON.stringify(data).toString());
			for(var i=0;i<data.length;i++){
			  console.log(data[i].stations,data[i].points);
			  var route = new stanoxPoints();
			  route.set('stations',data[i].stations);
			  route.set('points',data[i].points);
			  route.save();
			  collection.add(route);
			}
            // set collection data (assuming you have retrieved a json object)
            //collection.reset(data)
        }
    });
   }
   */
});



window.Schedule = Backbone.Model.extend({
	defaults:{
		"trainId":"",
		"trainUid":"",
		"start":"",
		"timeline":new Array(),
		"startTime":0,
		"endTime":0,	
		"stanox":0,
		
		"last_event":"",
		"last_update_time":"",
		"last_status":"",
		"delay":0,
		"next_stanox":0,
		"pre_routes":new Array()
		/*
		"expected_arrival_time":0,
		"expected_departure_time":0,
		"expected_event":'',
		"passed_stations":0,
		"to":"",
		"from":"",
		"status":"",
		"running":false,
		"currentFrames":new Array()
		*/
	},
	idAttribute: "trainId"
});

window.scheduleCollection = Backbone.Collection.extend({
  localStorage: new Backbone.LocalStorage("ScheduleStorage"), 
  model: Schedule, 
  initialize:function(){
      this.on("add", function(schedule) {
	      //console.log('schedule collection has '+schedule.get('trainId'),schedule.get('timeline').length);
      });
      this.on("remove", function(station) {
	      //console.log('schedule collection has '+schedule.get('trainId'),schedule.get('timeline').length);
      })
	  window.localStorage.clear();
	  this.each(function(model) { model.destroy(); } )
  },
  showAll:function(callback){
      this.each(function(model){
          //console.log(model.get('trainId')+','+model.get('trainUid'))
		   var timeline = model.get('timeline');
		   var c_station, next_station; var departure, arrival;
		   var d = new Date();
		   var time = d.getHours()*60 + d.getMinutes();
		   var found = false;
		   for(var j=0;j<timeline.length-1;j++){
			    c_station = timeline[j][0];  next_station = timeline[j+1][0];
			   if(timeline[j].length==4)       departure = timeline[j][2];
			   if(timeline[j].length==2)       arrival = timeline[j][1];
			   arrival = timeline[j+1][1];
		       //console.log( model.get('trainId'),departure, timeline[j] ,timeline[j].length,time );			   
			   if( (time<=arrival) && (time>=departure)){

				  model.set({'at':j});
				  model.save(); found = true;
				  break;
			   }
		   }
		   var all_duration,duration;
           if(found ==true){
		      duration = departure - arrival; 
			  all_duration = arrival - departure;		   
			  console.log('------------------------------------------------------------------------------------------'+
				' find it   '+duration,model.get('trainId'),arrival,departure,c_station,next_station,'station '+j);		   
		      
		   }
	  })
  },
  findRoutes:function(station,nextstation){
    var points = routes.get([station,nextstation]).get('points');
	var from_geo = stations.get(station);
	var to_geo = stations.get(nextstation);
    if( points != null ){
	    // put from_geo+ points + to_geo + 
	}else{
	    points = routes.get([station,nextstation]).get('points');
		if(points !=null){
		   	    // put from_geo+ points + to_geo + 
		}else{
		    console.log('the track is wrong ');
		}
	}
  },
  showTrainBeforeHalfAHour:function(){
    var sches =  this.filter(function(schedule) {
      var now = new Date();
      var hour        = now.getHours();
      var minute      = now.getMinutes();
      return ((hour*60+minute)-(schedule.get("startTime")) < 30);
    });  	
	for(var i=0;i<sches.length;i++){
	   console.log('schedule right now train   ',sches[i].get('trainId'));
	}
  },
  showTheRunningTrains:function(callback){
     var sches =  this.filter(function(schedule) {
	   var now = new Date();
       var hour        = now.getHours();
       var minute      = now.getMinutes();
	   var nowTime = hour*60+minute;
       return (  ( schedule.get("startTime")<= nowTime )&& (nowTime<=schedule.get("endTime")  ) );
    });  
	
		for(var i=0;i<sches.length;i++){
	       console.log('schedule running train   ',sches[i].get('trainId'));
	    } 
		console.log('showing  ',sches.length);
		return sches;
		
    //callback(sches);	
  }
});				

/*
window.TrainEvent = Backbone.Model.extend({
	//urlRoot:"http://localhost:8080/stations",
    initialize: function(){		
		this.bind("remove", function() {
		  console.log('remove Station');
          this.destroy();
        });
    },	
	defaults:{
		"train_id":"",
		"status":"",
		"stanox":0,
		"next_stanox":0,
		"event":"",
		'next_event': ""
	},
	idAttribute: 'train_id'
	
});

window.TrainEventCollection = Backbone.Collection.extend({
  model: TrainEvent,
  localStorage: new Backbone.LocalStorage("trainEventStorage"),    
  initialize:function(){
      this.on("add", function(station) {
	     console.log('add new stations',station);
      });
      this.on("remove", function(station) {
	     console.log('remove a station',station);
      })
  },
  showAll:function(){
      this.each(function(model){
          console.log(model.get('train_id'),model.get('status'),model.get('stanox'),model.get('next_stanox'));
      })
  }
});
window.trainEvents = new TrainEventCollection();
*/




rad = function(x) {return x*Math.PI/180;}

distHaversine = function(p1, p2) {
  var R = 6371; // earth's mean radius in km
  var dLat  = rad(p2[0] - p1[0]);
  var dLong = rad(p2[1] - p1[1]);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(rad(p1[0])) * Math.cos(rad(p2[0])) * Math.sin(dLong/2) * Math.sin(dLong/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;

  return d.toFixed(3);
}