/*
40320 38306 38304 38302 38220 38218 38216 38218
*/
var sche1 = new Schedule({'trainId':'220011','startTime':720,'endTime':820}); // ,'timeline':[[]]
var sche2 = new Schedule({'trainId':'222011','startTime':320,'endTime':720});
schedules.add([sche1,sche2]);
console.log(sche1.get('trainId'));
console.log(schedules.get('220011'));
sche1.set({'running':true});
sche2.set({'running':false});
window.schedules = new scheduleCollection();
schedules.showTrainBeforeHalfAHour();
schedules.showTheRunningTrains();
sche1.save({'status':'ON_TIME'});
sche2.save({'status':'ON_TIME'});



setInterval(function(){
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
    console.log('interval');
    schedules.showAll(function(trains){	
	
	});
	
    //arrivalEventReceived('trainId');
			 // console.log( routes.at(0).get('stations') );
			 // console.log('fetch get by id', routes.get([38201,38202]).get('points'));
			 // console.log('fetch get by id', routes.get([38202,38201]));	

},5000);




function getTrainRouteStations(trainId){



}


function getGeoListByStations(){
    var geos= [53.21579073715244,-2.8958864745734445,53.26019,-2.9422970000000532];
	return geos;
}

function simulateTrainMoving(trainId){
    var train = window.schedules.get(trainId);
	var timeline = train.get('timeline');
	//console.log(timeline.length);
    for(var i=0;i<timeline.length;i++){
	   //console.log(timeline[i]);
	}
}

function arrivalEventReceived(trainId,status,cStanox,nStanox,timestamp){   
/*
    var train = window.schedules.get(trainId);
	var passed_stations = train.get('passed_stations'), timeline = train.get('timeline'), 
	expected_arrival_time = train.get('expected_arrival_time'), expected_to = train.get('to'),
	expected_event = train.get('expected_event');
	if(expected_event !='arrival') console.log(trainId,'wrong with the sechdule');
	passed_stations++;
	*/
	
	// verify the old things
	// 1    expected_event =  "arrival"
    // 2	// ctanox == expected_to, nStanox == next_stop;
	// status , timestamp - expected_arrival_time,  tell us whether we are late or not
		
	// calculate the next stop  tracks and distance 
	
	/*
    var s_block = timeline[passed_stations];
	var next_to = s_block[0];  // should 
    var next_arrival_time;
	var next_departure_time;
	var next_pass_time;	
	var duration = 0;
	if(s_block.length == 2) { // pass to next station
	   next_pass_time = s_block[1];
	   train.set({'expected_event':'departure'});
	   duration = next_pass_time - expected_arrival_time;  
	}
	else{  // arrival to the next station
	   next_arrival_time  = s_block[1];
	   next_departure_time = s_block[2];
	   train.set({'expected_event':'arrival'});
       duration = next_arrival_time - expected_arrival_time;  	   
	}
	train.set({'passed_stations':passed_stations});// add one passed station
    train.set({'expected_arrival_time':next_arrival_time});
	train.set({'to':next_to});
	train.set({'expected_departure_time':next_departure_time});
    // calculate the next running time
    //duration 
	// distance    [expected_to  next_to]
	// stanoxCollection
	var points = stanoxCollection.get([expected_to,next_to]).get('points');
	var from_geo = stations.get(expected_to);
	var to_geo = stations.get(next_to);
    if( points != null ){
	    // put from_geo+ points + to_geo + 
	}else{
	    points = stanoxCollection.get([next_to,expected]).get('points');
		if(points !=null){
		   	    // put from_geo+ points + to_geo + 
		}else{
		    console.log('the track is wrong ');
		}
	}
	*/
}

function departEventReceived(trainId,status,cStanox,nStanox,timestamp){
   // run
     var train = window.schedules.get(trainId);	 
}


function constructOneRoutes(){ 
   var stations = [38306,38304];
   var stationsgeo = [stationMap[stations[0]].getPosition(),stationMap[stations[1]].getPosition()];
   var geos= [53.21579073715244,-2.8958864745734445,53.26019,-2.9422970000000532];

   polyline.getPath().push( stationsgeo[0]);
   for(var j=0;j<geos.length;j+=2){
		//console.log("intermediate  points ",railRoutes[i].points[j]);
		polyline.getPath().push( new google.maps.LatLng(geos[j],geos[j+1]) );

   }
   polyline.getPath().push( stationsgeo[1] );
   polyline.setMap(map);   
}

function showTrainRoutes(trainid){
  var sta_list = [38306,38304];
  for(var i=0;i<sta_list.length-1;i++){
     polyline.getPath().push( stationMap[sta_list[i]].getPosition());
	 var geos = getGeoListByStations();
	 for(var j=0;j<geos.length;j+=2){
	 	//console.log("intermediate  points ",railRoutes[i].points[j]);
	    polyline.getPath().push( new google.maps.LatLng(geos[j],geos[j+1]) );
	 }
   } 
}