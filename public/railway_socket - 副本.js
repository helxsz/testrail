
function initWebsocket(){
            console.log('init train socket');
            var socket =  io.connect('http://localhost:8081/');
						
            socket.on('connect', function() {
                console.log('on connect');
            });
            socket.on('news', function(message){
			   console.log(message);
			   var array = JSON.parse(message);
			   console.log('receive news   .................................. '+array.length);
			   /**/
			   array.forEach(function(obj){	                   			   
			       parseActivationEvent(obj)			   
			   })
			   
            });
			
			socket.on('train_activation_event', function(msg){
               var obj = JSON.parse(msg);              
               parseActivationEvent(obj);			   
            }) ;			
            socket.on('train_movement_event', function(msg){
               var array = JSON.parse(msg);
			   parseMovementEvent(array);
			  			   

            }) ;			
/**/			
            socket.on('disconnect', function() {
                console.log('disconnected');
                // content.html("<b>Disconnected!</b>");
            });

            //socket.connect();
}


function parseActivationEvent(obj){

			   //$('#brand').text("abc"+Math.random(100));
			   //alert("1000");
			   console.log('train_activation_event    ',obj.train_uid,obj.train_id,obj.stanox,obj.time.length);
			   var beginTime = obj.time[0].departure;
			   var endTime = obj.time[obj.time.length-1].arrival;
			   var start = obj.time[0].stanox;
			   var a = new Array();
			   // 
			   for(var i =0;i<obj.time.length-1;i++){
			      	console.log(obj.time[i].stanox,obj.time[i].arrival,obj.time[i].departure,obj.time[i].pass,obj.time[i].platform);
                    if(obj.time[i].pass==null){
					    a.push([obj.time[i].stanox,obj.time[i].arrival,obj.time[i].departure,obj.time[i].platform]);
                    }else{
					    a.push([obj.time[i].stanox,obj.time[i].pass]);
                    }					
			   }

			   var sche = new Schedule({'trainId':obj.train_id,'trainUid':obj.train_uid,'start':obj.stanox,'timeline':a,
			                             'startTime':beginTime,'endTime':endTime,'passed_stations':0});
			   schedules.add(sche);
			   sche.save();

}

function parseMovementEvent(msg){

	            var groups =  _.groupBy(msg, function(obj){ return  obj.train_id}) ;	
	    //console.log(groups);
       
		for (var key in groups) {
            if (groups.hasOwnProperty(key)) {
              //console.log(key + " -> " + groups[key].length);
			  if(groups[key].length==2){
			    //console.log("----", new Date().getTime());
			    //console.log("---",groups[key][0].stanox,groups[key][0].next_stanox,groups[key][0].status,groups[key][0].next_event,groups[key][0].event,groups[key][0].timestamp);
			    //console.log("---",groups[key][1].stanox,groups[key][1].next_stanox,groups[key][1].status,groups[key][1].next_event,groups[key][1].event,groups[key][1].timestamp); 
			    //console.log(  (groups[key][0].timestamp - groups[key][1].timestamp)/1000/60 );
				//convert(groups[key][0].timestamp);
				
				if(groups[key][0].timestamp>groups[key][1].timestamp){
				    if(schedules.get(key)==null){
				        //console.log("not found schedule");
			            var sche = new Schedule({'trainId':groups[key][0].train_id,'last_event':groups[key][0].event,'last_update_time':groups[key][0].timestamp,
						'next_stanox':groups[key][0].next_stanox,'pre_routes':[groups[key][0].stanox],'stanox':groups[key][0].stanox,'status':groups[key][0].status
			                                      });
			            schedules.add(sche);
			            sche.save();					
				        //console.log("not found schedule")
getTrainRunning(key);						
                    	return; // 找不到schedule
				    }else{
				        schedules.get(key).set('last_event',groups[key][0].event);
				        schedules.get(key).set('last_update_time',groups[key][0].timestamp);
			            schedules.get(key).set('next_stanox',groups[key][0].next_stanox);
			            schedules.get(key).set('stanox',groups[key][0].stanox);	
                        schedules.get(key).set('status',groups[key][0].status);		
                        schedules.get(key).save();
getTrainRunning(key);						
					}
				}
				else{
	     		    if(schedules.get(key)==null){
				       // console.log("not found schedule");
			            var sche = new Schedule({'trainId':groups[key][1].train_id,'last_event':groups[key][1].event,'last_update_time':groups[key][1].timestamp,
						'next_stanox':groups[key][1].next_stanox,'pre_routes':[groups[key][1].stanox],'stanox':groups[key][1].stanox
			                                      });
			            schedules.add(sche);
			            sche.save();					
				       //  console.log("not found schedule");
getTrainRunning(key);						 
						 
                    	return; // 找不到schedule
				    }else{			       
				       schedules.get(key).set('last_event',groups[key][1].event);
				        schedules.get(key).set('last_update_time',groups[key][1].timestamp);
			            schedules.get(key).set('next_stanox',groups[key][1].next_stanox);
			            schedules.get(key).set('stanox',groups[key][1].stanox);	
                        schedules.get(key).set('status',groups[key][1].status);		
                        schedules.get(key).save();
getTrainRunning(key);						
                    } 					
				}
			  }	
               else if(groups[key].length==1){
			       if(schedules.get(key)==null){
				       // console.log("not found schedule");
			            var sche = new Schedule({'trainId':groups[key][0].train_id,'last_event':groups[key][0].event,'last_update_time':groups[key][0].timestamp,
						'next_stanox':groups[key][0].next_stanox,'pre_routes':[groups[key][0].stanox],'stanox':groups[key][0].stanox
			                                      });
			            schedules.add(sche);
			            sche.save();				
getTrainRunning(key);						
                    	return; // 找不到schedule
				    }else{
				        schedules.get(key).set('last_event',groups[key][0].event);
				        schedules.get(key).set('last_update_time',groups[key][0].timestamp);
			            schedules.get(key).set('next_stanox',groups[key][0].next_stanox);
			            schedules.get(key).set('stanox',groups[key][0].stanox);
						schedules.get(key).set('status',groups[key][0].status);
						schedules.get(key).save();
getTrainRunning(key);						
				   }
               }			   
            }			
        }	

}
var speed  = 140;
var trainsMap = new Object();
 var trainIcon = 'TrainYellow.png'; 
function getTrainRunning(key){


    var stanox = schedules.get(key).get('stanox');
	var next_stanox = schedules.get(key).get('next_stanox');
	if(stanox == null || next_stanox ==null) return;
		
    var route = routes.get([stanox,next_stanox]);
	var points;
	var dis;
    var status = schedules.get(key).get('status');
	var last_event = schedules.get(key).get('last_event');		
	console.log('getTrainRunning key  ',key,stanox,next_stanox,status,last_event);	  
	var st1 = stations.get(stanox), st2= stations.get(next_stanox);
	console.log('getTrainRunning marker   == null ',st1.get('lat'),st1.get('lng'),st2.get('lat'),st2.get('lng'));	   
	var marker;
	
    if(trainsMap[key]==null){	
		trainsMap[key] = marker;
        if(last_event=="DEPARTURE"){
          marker = new google.maps.Marker({       
            position: new google.maps.LatLng(st1.get('lat'),st1.get('lng')), 
            map: map
          });			
		  console.log(key,'DEPARTURE+++++++++++++++++++',last_event);
		  marker.setIcon(imageNormal);	
        var dis = distHaversine([st1.get('lat'),st1.get('lng')],[st2.get('lat'),st2.get('lng')])*10000;		
	    var n  = dis/speed;
	  	var hb_avg = (st2.get('lat')-st1.get('lat'))/n;
		var ib_avg = (st2.get('lng')-st1.get('lng'))/n;
		console.log(n , '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
		marker.hb = hb_avg;
		marker.ib = ib_avg;
        marker.n = 0;
		marker.id = key;           
		}else if(last_event == "ARRIVAL"){
		   console.log(key,'ARRIVAL----------------------',last_event);
           marker = new google.maps.Marker({       
            position: new google.maps.LatLng(st2.get('lat'),st2.get('lng')), 
            map: map,
           });			
		   console.log(key,'ARRIVAL',last_event);		   		   
		   marker.setIcon(imageStop);
		   
		}
	}else{
       marker = trainsMap[key];
       if(last_event=="DEPARTURE"){
		   console.log(key,'DEPARTURE',last_event);
		   marker.setIcon(imageNormal);
          var dis = distHaversine([st1.get('lat'),st1.get('lng')],[st2.get('lat'),st2.get('lng')])*10000;		
	      var n  = dis/speed;
	  	  var hb_avg = (st2.get('lat')-st1.get('lat'))/n;
		  var ib_avg = (st2.get('lng')-st1.get('lng'))/n;
		  console.log(n , '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
		  marker.hb = hb_avg;
		  marker.ib = ib_avg;
          marker.n = 0;
		  marker.id = key;
	   }else if(last_event == "ARRIVAL"){
		   console.log(key,'ARRIVAL',last_event);
		   marker.setIcon(imageStop);
	   }	   
    }
		
   
	if(status=="LATE") console.log(key,'Train is late',status);
	
    google.maps.event.addListener(marker, 'click', function() { 

		//map.panTo(marker.position);
      }); 	  
	google.maps.event.addListener(marker, 'mouseover', function() { 
	      console.log('marker    mouseover   '+marker.id);
		  overlay.setMarker(marker);
		  overlay.setTrain(marker.id);
          overlay.show();
	})	  
	google.maps.event.addListener(marker, 'mouseout', function() { 
	      //console.log('marker    mouseout   '+marker.stanox);
		  overlay.hide();
	})		
}




setInterval(function(){
	window.schedules.each(function(data){					    
		if(data!=null)
		{
			//console.log(schedules.length, data.get('trainId'),data.get('stanox'));
			var trainId = data.get('trainId');
			var stanox = data.get('stanox');
			//if(stations.get(stanox)!=null) console.log('  ',data.get('trainId'),stations.get(stanox).get('lat'), stations.get(stanox).get('lng'));
            			
			/*
			var stanox = data.get('stanox');
			var time = new Date();
			var s = Number( data.get('last_update_time'));
			var duration = Math.abs((time-s)/1000); 	
			console.log('duration  from lat update',duration );
			*/
			
			var marker = trainsMap[trainId];
			if(marker!=null  && marker.s!=1){
			  // marker
			        var n = marker.n;
					n++; marker.n = n;					
					var lat1 = Number( stations.get(stanox).get('lat'))+ n * marker.hb;
					var lng1 = Number( stations.get(stanox).get('lng')) + n*marker.ib;
					console.log('---------- update the geo    ',trainId,n,lat1,lng1  );
			   	    marker.setPosition (new google.maps.LatLng(lat1,lng1) );
			}		
			/*
			if(duration > 60*30){
                google.maps.event.clearInstanceListeners(marker);
                marker.setMap(null);
                delete marker;	
			    data.destory();			   
            }*/				
		}
	})

},5000);


function updateTrainMarker(marker,points){
    marker.points = points;
	marker.distance = distance;
    
}

function removeTrainMarker(data){
    var marker = data.get('marker');
	data.set({'marker':null});
    google.maps.event.clearInstanceListeners(marker);
    marker.setMap(null);
    delete marker;		
}


var imageNormal = new google.maps.MarkerImage(
					"TrainYellow.png",
					new google.maps.Size(125, 125),
					new google.maps.Point(0, 0),
					new google.maps.Point(0, 0)
);
var imageStop =   new google.maps.MarkerImage(
					"TrainRed.png",
					new google.maps.Size(125, 125),
					new google.maps.Point(0, 0),
					new google.maps.Point(0, 0)
);