window.schedules;


window.AppRouter = Backbone.Router.extend({	 
    routes:{
    	'':'home'
    },
    initialize:function () {
    	console.log('init route');
		stations = new stationsCollection();
        routes = new RouteCollection();
        schedules = new scheduleCollection();	
		
 	    if(mapView==undefined)  $('body').append(new MapView({stations:stations}).el);			
        $('body').append( new HeaderView().render().el) ;
		//$('body').append( new SideBarView().render().el) ;
		//$('body').append( new HelpBarView().render().el) ;
		$('body').append( new TimeTemplate().render().el) ;
		
		$('#arrBtn').click= function(){
		
		   console.log('arr ben');
		};
		$('#deplBtn').click= function(){
		
		   console.log('arr ben');
		};		
		
		////////////////////////////////////////////////////////////////////////
       /*
       stanoxCollection.fetch({
	       success:function(collection,response){
	    	  console.log('fetch the stanoxCollection data success');
			 
	          collection.each(function(data){
	            console.log(data);								
	          }) 			

	      },
	      error:function(collection, response){
	          console.log(collection);
	          console.log(response);
	          console.log('error');
	      }
	   })
	   */
		 $.getScript("/railway_socket.js", function(){
              console.log("Running railway_socket.js");
			  initWebsocket();
			  initWebsocket();
         });
		 
	   
    $.ajax({
        type : 'GET',
        url : "http://localhost:8080/latest",
        dataType : 'json',
        success : function(data, textStatus, jqXHR) {
		    //console.log('latest   schedule   '+data.error);
            console.log('latest   schedule   '+data.length);
			console.log('latest schedule '+data);
            //data.forEach(function(item){});
			   //console.log(item.platform);
            for(var i=0;i<data.length;i++)			  
			{
     			//parseActivationEvent(data[i]);
			   var beginTime = data[i].start_time;
			   var endTime = data[i].end_time;
			   //console.log('train_activation_event    ',data[i].train_uid,data[i].train_id,beginTime,endTime);
			   ////////////////////////////////////////////////////////////////////////////////////////////////
			   
			   ////////////////////////////////////////////////////////////////////////////////////////////////
              var model =  window.schedules.get('trainId');
               if(model==null){
			       var model = new Schedule({'trainId':data[i].train_id,'trainUid':data[i].train_uid,'startTime':beginTime,'endTime':endTime});
				   window.schedules.add(model);
				   model.save();
			   }else{
                   model.set({'trainUid':data[i].train_uid});
                   model.save();				   
               }			   
		    }	
        },
		error:function(err){console.log(err)}
    }).done(function(){
	     console.log(' this query is done   ------------------------------------------- ');	
	});		
	},
    home:function(){
    	console.log('home');
    }
});

function getTrainSchedule(uid){

    $.ajax({
        type : 'GET',
        url : "http://localhost:8080/"+uid,
        dataType : 'json',
        success : function(data, textStatus, jqXHR) {
		    //console.log('latest   schedule   '+data.error);
            console.log('latest   schedule   '+data.length);
			console.log('latest schedule '+data);
            //data.forEach(function(item){});
			   //console.log(item.platform);
            for(var i=0;i<data.length;i++)			  
			{
     			//parseActivationEvent(data[i]);
			   var beginTime = data[i].start_time;
			   var endTime = data[i].end_time;
			   console.log('train_activation_event    ',data[i].train_uid,data[i].train_id,beginTime,endTime);
			   ////////////////////////////////////////////////////////////////////////////////////////////////
			   
			   ////////////////////////////////////////////////////////////////////////////////////////////////
              var model =  window.schedules.get('trainId');
               if(model==null){
			       var model = new Schedule({'trainId':data[i].train_id,'trainUid':data[i].train_uid,'startTime':beginTime,'endTime':endTime});
				   window.schedules.add(model);
				   model.save();
			   }else{
                   model.set({'trainUid':data[i].train_uid});
                   model.save();				   
               }			   
		    }	
        },
		error:function(err){console.log(err)}
    }).done(function(){
	     console.log(' this query is done   ------------------------------------------- ');	
	});   
}


function parseActivationEvent(obj){

			   //$('#brand').text("abc"+Math.random(100));
			   //alert("1000");
			   console.log('train_activation_event    ',obj.train_uid,obj.train_id,obj.time_schedule.length);
			   var beginTime = obj.time_schedule[0].departure;
			   var endTime = obj.time_schedule[obj.time_schedule.length-1].arrival;
			   var a = new Array();
			   // 
			   for(var i =0;i<obj.time_schedule.length-1;i++){
			      	//console.log(obj.time[i].stanox,obj.time[i].arrival,obj.time[i].departure,obj.time[i].pass,obj.time[i].platform);
                    if(obj.time_schedule[i].pass==null){
					    a.push([obj.time_schedule[i].tiploc_code,obj.time_schedule[i].arrival,obj.time_schedule[i].departure,obj.time_schedule[i].platform]);
                    }else{
					    a.push([obj.time_schedule[i].tiploc_code,obj.time_schedule[i].pass]);
                    }					
			   }

			   var sche = new Schedule({'trainId':obj.train_id,'trainUid':obj.train_uid,'timeline':a,
			                             'startTime':beginTime,'endTime':endTime,'passed_stations':0});
			   schedules.add(sche);
			   sche.save();

}
//////////////////////////////////////////////////////////////////////////////////////////////////
var editble = false;
var r_times = 0;
var path = new google.maps.MVCArray;
var stationPath = new Array();  // temporary
var tempPoints = new Array();  // temporary
var railRoutes = new Array();  // 




MapView = Backbone.View.extend({
        self:this,
        el: $('body'),
		template:_.template($("#searchmapTemplate").html()),			
		initialize: function (option) {		
			this.render();
			console.log('map view-init');
			//this.listenTo(this.model, 'change', this.render);
		},
		events: {                      		  
		},
		render:function(){
		   this.setElement(this.template());
		   google.maps.event.addDomListenerOnce(window, 'load', this.initGM);
		   return this;
		},
		initGM:function(e){                		
		   		$('#mapcontainer').append($('<div id="mapcanvas" ></div>'));		   
	            map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);
	            map.mapTypes.set("Edited", styledMapType);
                map.setMapTypeId('Edited');	
				map.setTilt(30);
				
                var stamen_map = new google.maps.StamenMapType('watercolor');
                stamen_map.set('name', 'Stamen watercolor');
                map.mapTypes.set('stamen', stamen_map);				
				
				overlay = new InfoBox(map);
				var test1 = new MiniCanvas(map, new google.maps.LatLng(53.3234,-2.9178), "abc",13);
			
				google.maps.event.addListener(map, 'bounds_changed', function(event){
				    var bounds =  map.getBounds();
		            var ne = bounds.getNorthEast();
		            var sw = bounds.getSouthWest();
					//window.stations.
					//console.log('bounds changed   ',ne,sw);
	                
					window.stations.each(function(data){
                        if(bounds.contains(new google.maps.LatLng(data.get('lat'),data.get('lng'))) )							
				        {
						       // console.log("bounds   contains  ",bounds.toString());
							   if(data.get('marker')==null){
							     createMarker(data);
							     //console.log('create marker  at bounds changed');
							   }
                        }else{
						      if(data.get('marker')!=null)
							  {
							     removeMarker(data);   
								 //console.log('remove marker  at bounds changed');
							  }
						}
					})

/*					
					var storeVar = localStorage.getItem("ScheduleStorage");
					console.log(storeVar.length);
					window.schedules.each(function(data){					    
						if(data!=null)
						{
						  console.log(schedules.length, data.get('train_Id'));
						  if(stations.get('stanox')!=null)
                          console.log('  ',data.get('trainId'),stations.get('stanox').get('lat'), stations.get('stanox').get('lng'));	
						  var stanox = data.get('stanox');
						}
					})	
                        if(bounds.contains(new google.maps.LatLng(stations.get('stanox').get('lat'),stations.get('stanox').get('lng'))) )							
				        {
						       // console.log("bounds   contains  ",bounds.toString());
							   if(data.get('marker')==null){
							     createMarker(data);
							     //console.log('create marker  at bounds changed');
							   }
                        }else{
						      if(data.get('marker')!=null)
							  {
							     removeMarker(data);   
								 //console.log('remove marker  at bounds changed');
							  }
						}
*/						
										
				})
				
				google.maps.event.addListenerOnce(map, 'idle', function(event){
                   	 console.log('----------------------------------------------------'+window.stations.length);
		             window.stations.fetch({
	                     success:function(collection,response){		
			             setTimeout(function(){
			               //showTrainRoutes(34);
				           //stations.showAll();
			            },1000);
	                },
	                error:function(collection, response){
	                    console.log(collection);
	                    console.log(response);
	                    console.log('error');
	                 }			
                   }).done(function(){				   
				      //window.stations.localStorage = new Backbone.LocalStorage("stationsStorage");
					  	 console.log('fetch the data success  station ------------------------'+window.stations.length);
	                     window.stations.each(function(data){
	                        //console.log(data.get('station')+"   "+data.get('lat')+"   "+data.get('lng')+"  "+data.get('stanox'));	
                          	var bounds =  map.getBounds();
							 //console.log("bounds   idle  ",bounds.toString());
                            if(bounds.contains(new google.maps.LatLng(data.get('lat'),data.get('lng'))))							
				            {
							   console.log('create marker  at idle');
							   createMarker(data);
                            }								
	                     })	
						 
						 
						 /////////////////////////////////////////////////////////////
						 
						     $.ajax({
        type : 'GET',
        url : "http://localhost:8080/geo",
        dataType : 'json',
        success : function(data) {
            //console.log(data.length);
			//console.log(JSON.stringify(data).toString());
			for(var i=0;i<data.length;i++){
			  //console.log(data[i].stations,data[i].points);
			  var route = new Route();
			  route.set('stations',data[i].stations);
			  route.set('points',data[i].points);
			  routes.add(route);
			  route.save();			  
			}
			
			console.log('routes   length',routes.length);
			for(var i =0;i<routes.length;i++){
                  //console.log(routes.at(i).get('stations'),routes.at(i).get('points'));
				  var instance = routes.at(i);
				  var sta = instance.get('stations');  var points = instance.get('points');
				  var s1_lat = window.stations.get(sta[0]).get('lat'), s1_lng = window.stations.get(sta[0]).get('lng');
				  var s2_lat = window.stations.get(sta[1]).get('lat'), s2_lng = window.stations.get(sta[1]).get('lng');
				  var dis = distHaversine([s1_lat,s1_lng],[s2_lat,s2_lng])*100000;
				 // console.log(dis);
				  instance.set('distance',dis);
				  instance.save();
			}
        }
    });
					  
				   });
                });				
				/*
                google.maps.event.addListener(map, 'center_changed', function() {
                       // console.log('center_changed');
                });
                */				
				google.maps.event.addListener(map, 'rightclick', function(event){
				       var lat = event.latLng.lat();
                       var lng = event.latLng.lng();   
                       console.log("Lat=" + lat + "; Lng=" + lng);
					   r_times++;
					   if(r_times==1) { //start
					      editble = true;
						  $('#map-time').text('select path');
					   }else if(r_times==2){
			              polyline.setMap(map);
					      $('#map-time').text('change path');
					   }else if(r_times==3){ //stop
					      //////////calculate
						  calculatePoint(polyline);
						  
						  sendRoutePointsToServer();
					      ///////// reset
					      r_times = 0;
						  editble = false;
                          stationPath = new Array();
						  tempPoints = new Array();
						  polyline.setPath([]);
						  $('#map-time').text('not edit');						  
						  //////////
						  setTimeout(function(){
						      rebuildRoute();
						      setTimeout(function(){polyline.setPath([]);},2000);
						  },2000);						  
					   }					   
				});								
///////////////////////////////////////////////////////////////////////////////////////
			
				google.maps.event.addListener(polyline, 'rightclick', function(event) {
				       var lat = event.latLng.lat();
                       var lng = event.latLng.lng();   
                       console.log("polyline   right   Lat=" + lat + "; Lng=" + lng);  
                       tempPoints.push(event.latLng);					   
                });		
				google.maps.event.addListener(polyline, 'mousemove', function(event) {
                       // console.log('Geographical Coordinates: ' + event.latLng.lat() + ', ' + event.latLng.lng());
			            $('#geo').text(event.latLng.lat() + ',' + event.latLng.lng());
                });
                 				
				
//////////////////////////////////////////////////////////////////////////////////////
                 ///////////////////////////////////////////////////////////////////////////////////////////////

		},
         close: function () {
            console.log('Kill: ', this); 
            this.unbind(); // Unbind all local event bindings
            this.remove(); // Remove view from DOM 
            this.model.unbind( 'change', this.render, this ); // Unbind reference to the model
            this.options.parent.unbind( 'close:all', this.close, this ); // Unbind reference to the parent view	
            delete this.$el; // Delete the jQuery wrapped object variable
            delete this.el; // Delete the variable reference to this node			
         }
});

function removeMarker(data){
    var marker = data.get('marker');
	data.set({'marker':null});
    google.maps.event.clearInstanceListeners(marker);
    marker.setMap(null);
    delete marker;	
	
}
var offset = Math.floor(Math.random() * 3) * 16; // pick one of the three icons in the sprite

// Calculate desired pixel-size of the marker
var size = Math.floor(4*(10-1) + 8);
var scaleFactor = size/16;

var infowindow = new google.maps.InfoWindow({});
function createMarker(data) {
      var marker = new google.maps.Marker({       
        position: new google.maps.LatLng(data.get('lat'),data.get('lng')), 
        map: map,
        title: data.get('stanox'),		
		icon: 'aa.png'		
      }); 
	  //console.log(pos+ "  "+name+"   "+stanox);	  
	  marker.stanox = data.get('stanox');
	  //marker.name = data.get('station');
	  //marker.web = data.get('web');
	  stationMap[data.get('stanox')] = marker;
	  
	  data.set({'marker':marker});
	  
      google.maps.event.addListener(marker, 'click', function() { 
		if(editble)
		{
		    if(r_times == 1){
			    console.log('select path  '+marker.getPosition()+"   "+marker.stanox);
				polyline.getPath().push(marker.getPosition());
				var obj = new Object();
				obj.stanox = marker.stanox;  obj.pos = marker.getPosition();  // should change				
				stationPath.push(obj);
			}
		}		
		console.log(  stations.get(marker.stanox).get('station'),  stations.get(marker.stanox).get('web')  );		
		loadDeparture(stations.get(marker.stanox).get('web'));
		map.panTo(marker.position);
		
		   //
		   infoWindow.setContent("<div>abc</div>");
           infowindow.open(marker);
		
      }); 
	  
	  google.maps.event.addListener(marker, 'mouseover', function() { 
	      console.log('marker    mouseover   '+marker.stanox);
		  //////////////////////////
		  overlay.setMarker(marker);
		  overlay.setStation(marker.stanox);
          overlay.show();
	  })
	  
	  google.maps.event.addListener(marker, 'mouseout', function() { 
	      console.log('marker    mouseout   '+marker.stanox);
		  overlay.hide();
	      //////////////////////////
	  })
	  
      return marker;  
}




/************************************************
      edit the polyline and route
************************************************/

function calculatePoint(pl){
        var fir_st = stationPath[0].stanox;
		var fir_pos = stationPath[0].pos;
		var sec_st,sec_pos;
		var index = 1;
        for (var i =1;i<stationPath.length;i++){
		   console.log('dest station point  '+fir_pos +"    "+stationPath[i].pos);
		   sec_st = stationPath[i].stanox;  sec_poc = stationPath[i].pos;
		   
		   var stationRoute = new Object();
		   stationRoute.stations = [fir_st,sec_st];
		   stationRoute.points = new Array();
		   var k=0;
		   while( tempPoints[index].lat() !=  stationPath[i].pos.lat() ){
		       console.log('station ('+fir_st+"  "+sec_st+")   "+tempPoints[index].lat());
			   index ++;
			   stationRoute.points.push(tempPoints[index]);
		   }
		   railRoutes.push(stationRoute);
		   console.log('---  '+stationRoute.stations.length+'   '+stationRoute.points.length);
		   fir_st = sec_st; fir_pos = sec_pos;
		}	
}	

function rebuildRoute(){
    console.log('rebuildRoute  '+railRoutes.length);
    for(var i=0;i<railRoutes.length;i++){
	    //console.log(railRoutes[i].stations[0],railRoutes[i].stations[1]);
		//console.log(stationMap[railRoutes[i].stations[0]].getPosition(),stationMap[railRoutes[i].stations[1]].getPosition());
		//console.log('intermediate points length '+railRoutes[i].points.length);
		/**/
		polyline.getPath().push(stationMap[railRoutes[i].stations[0]].getPosition());
		for(var j=0;j<railRoutes[i].points.length;j++){
		   //console.log("intermediate  points ",railRoutes[i].points[j]);
		   polyline.getPath().push( railRoutes[i].points[j] );
		}
        polyline.getPath().push(stationMap[railRoutes[i].stations[1]].getPosition());
		polyline.setMap(map);
	}
}

function sendRoutePointsToServer(){
    var a = new Array();
    for(var i=0;i<railRoutes.length;i++){
        var route = new Object();
		route.stations = [railRoutes[i].stations[0],railRoutes[i].stations[1]];
		route.points = new Array();
		for(var j=0;j<railRoutes[i].points.length;j++){		     
		   route.points.push(railRoutes[i].points[j].lat());
		   route.points.push(railRoutes[i].points[j].lng());
		}
		a.push(route);
	}
    $.ajax({
       type: "POST",
       url: "http://localhost:8080/trackGeo",
       data: JSON.stringify(a),
	   success:function(){console.log('success   bla');}
    });
}
/************************************************
                       View 
************************************************/

window.HeaderView = Backbone.View.extend({
    template:_.template($("#headerTemplate").html()),
    initialize: function () {
        this.render();
		//this.listenTo(this.model, 'change', this.render);
    },
	events:{
	  'click #helpBtn': 'showHelp',
	  'click #tableBtn': 'showTimePanel'
	},
    render: function () {
    	this.setElement(this.template());
        return this;
    },
    close: function () {
        console.log('Kill: ', this); 
        this.unbind(); // Unbind all local event bindings
        this.remove(); // Remove view from DOM 
        //this.model.unbind( 'change', this.render, this ); // Unbind reference to the model
        //this.options.parent.unbind( 'close:all', this.close, this ); // Unbind reference to the parent view	
        delete this.$el; // Delete the jQuery wrapped object variable
        delete this.el; // Delete the variable reference to this node			
    },
	showHelp:function(){
	    if(  $('#stripedTable1').is(":visible") )
		$('#stripedTable1').hide();
		else 
		$('#stripedTable1').show();
	},
	showTimePanel:function(){
	    if(  $('#timetable').is(":visible") )
		$('#timetable').hide();
		else 
		$('#timetable').show();	
	}
})
//sidebar
window.SideBarView = Backbone.View.extend({
    template:_.template($("#sideBarTemplate").html()),
    initialize: function () {
        this.render();
		//this.listenTo(window.schedules, 'add', this.render);
	    window.schedules.bind('add', this.onModelAdded, this);
		window.schedules.bind('remove',this.onModelRemoved,this);
		console.log('sidebar view');
    },
    render: function () { 
    	this.setElement(this.template());
        return this;
    },
    close: function () {
        console.log('Kill: ', this); 
        this.unbind(); // Unbind all local event bindings
        this.remove(); // Remove view from DOM 
        this.model.unbind( 'add', this.onModelAdded, this ); // Unbind reference to the model
        this.options.parent.unbind( 'close:all', this.close, this ); // Unbind reference to the parent view	
        delete this.$el; // Delete the jQuery wrapped object variable
        delete this.el; // Delete the variable reference to this node			
    },
	onModelAdded: function(model) {
        //do something
		$('.section-text p').html(model.get('trainUid')+" "+model.get('start')+"  "+model.get('startTime'));
		console.log('on   model   loaded  '+model.get('trainUid'),model.get('start'),model.get('startTime'));
     },
	onModelRemoved: function(model) {
        //do something
		console.log('on   model   loaded  '+model);
     }		 
})

window.HelpBarView = Backbone.View.extend({
    template:_.template($("#helpBarTemplate").html()),
    initialize: function () {
        this.render();
		//this.listenTo(this.model, 'change', this.render);
		//this.model.on('change', this.render, this); 
		//this.options.parent.on('close:help', this.close, this); 
		console.log('helpBarTemplate view');
		$.getScript("/paper.js", function(){
              console.log("Running paper.js");
			  
         });
    },
    render: function () { 
    	this.setElement(this.template());
        return this;
    },
    close: function () {
        console.log('Kill: ', this); 
        this.unbind(); // Unbind all local event bindings
        this.remove(); // Remove view from DOM 
        //this.model.unbind( 'change', this.render, this ); // Unbind reference to the model
        //this.options.parent.unbind( 'close:all', this.close, this ); // Unbind reference to the parent view	
        delete this.$el; // Delete the jQuery wrapped object variable
        delete this.el; // Delete the variable reference to this node			
    }	
})
/*
window.InfoBarView = Backbone.View.extend({
    template:_.template($("#infoBarTemplate").html()),
    initialize: function () {
        this.render();
		//this.listenTo(this.model, 'change', this.render);
		//this.model.on('change', this.render, this); 
		//this.options.parent.on('close:help', this.close, this); 
		console.log('helpBarTemplate view');
		$.getScript("/paper.js", function(){
              console.log("Running paper.js");
			  
         });
    },
    render: function () { 
    	this.setElement(this.template());
        return this;
    },
    close: function () {
        console.log('Kill: ', this); 
        this.unbind(); // Unbind all local event bindings
        this.remove(); // Remove view from DOM 
        //this.model.unbind( 'change', this.render, this ); // Unbind reference to the model
        //this.options.parent.unbind( 'close:all', this.close, this ); // Unbind reference to the parent view	
        delete this.$el; // Delete the jQuery wrapped object variable
        delete this.el; // Delete the variable reference to this node			
    }	
})
*/
window.TimeTemplate = Backbone.View.extend({
    template:_.template($("#TimeTemplate").html()),
    initialize: function () {
        this.render();
		console.log('TimeTemplate view');
    },
	events:{
	   'click #map-time': 'clickTime',
	},
    render: function () { 
    	this.setElement(this.template());
        return this;
    },
	clickTime:function(){
	    this.trigger('close:help');
		if(navigator.geolocation)   navigator.geolocation.getCurrentPosition(this.success, this.error);
		else console.log('geolocation not supported');		
		
	},
    close: function () {
        console.log('Kill: ', this); 
        this.unbind(); // Unbind all local event bindings
        this.remove(); // Remove view from DOM 
        //this.model.unbind( 'change', this.render, this ); // Unbind reference to the model
        //this.options.parent.unbind( 'close:all', this.close, this ); // Unbind reference to the parent view	
        delete this.$el; // Delete the jQuery wrapped object variable
        delete this.el; // Delete the variable reference to this node			
    },
	success:function (position) {	  	
		   console.log("success-map   find me  at "+position.coords.latitude+"    "+position.coords.longitude); 
           		   
           var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
           /*		   
		   var myPlace = new google.maps.Marker({
			   position: latlng, 
			   map: map, 
			   title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
		   });
		   */

          var myPlace = new MarkerWithLabel({
             position: latlng,
             map: map,
             labelContent: "You are here!",
             labelAnchor: new google.maps.Point(22, 0),
             labelClass: "labels" // the CSS class for the label
          });		   
		   
		   var bounds =  map.getBounds();
		   var ne = bounds.getNorthEast();
		   var sw = bounds.getSouthWest();
		   console.log("are you in this region    "+bounds.contains(latlng));
		   
		   window.setTimeout(function() {
                   map.panTo(myPlace.getPosition());
           }, 3000);
		   
		   /*
		   google.maps.event.addListener(myPlace, 'mouseover', function() {    
			  infowindow.open(map,myPlace);		
		   });
		   google.maps.event.addListener(myPlace, 'mouseout', function() {    
			  infowindow.close(map,myPlace);
		   });
           	 */		   
		},		
		error:function (e) {
				var msg;
				switch(e.code) {
				case e.PERMISSION_DENIED:
					msg = "Permission was denied";			break;
				case e.POSITION_UNAVAILABLE:
					msg = "Location data not available";	break;
				case e.TIMEOUT:
					msg = "Location request timeout";		break;
				case e.UNKNOWN_ERROR:
					msg = "An unspecified error occurred";	break;
				default:
					msg = "An unspecified error occurred";	break;
				}		   
		   console.log(msg);
		 }
})

function loadArrival(city){ //  
	    $.getJSON('http://localhost:8080/railway/arrival?city='+city, function(data) {
            var items = []; 
			var n = 0;
			$('#timebody').html('');
            $.each(data, function(key, val) {
			    var dest = val.destination;
		        var dueTime = val.due;
		        var departTime = val.on_time;
		        var platform = val.platform;	
			    n++;
			/*
			    var row = $('<li id="12" class="train_info">'+ 
			                         '<span class="dest"> </span> <span class="dueTime"> </span> <span class="departTime"></span> <span class="platform"></span>'+
							'</li>');
				row.appendTo($('#timeList'));
				
				row.find('.dest').text(dest);	
				row.find('.dueTime').text(dueTime);
				row.find('.departTime').text(departTime);
				row.find('.platform').text(platform);			
                items.push('<li id="' + key + '">' + val + '</li>');
			*/	
			 
			 if(n<9){
			    var row = $('<tr>'+ 
			                         '<td class="dest"> </td> <td class="dueTime"> </td> <td class="departTime"></td> <td class="platform"></td>'+
							'</tr>');	
                row.appendTo($('#timebody'));
                row.find('.dest').text(dest);	
				row.find('.dueTime').text(dueTime);
				row.find('.departTime').text(departTime);
				row.find('.platform').text(platform);				
			}	
				//console.log(key+"   "+val.destination+"  "+val.due+"  "+val.on_time+"   "+val.platform);
            }); 
		});	
}

function loadDeparture(city){  
        $.getJSON('http://localhost:8080/railway/departure?city='+city, function(data) {
            var items = []; 
			$('#timebody').html('');
			var n = 0;
            $.each(data, function(key, val) {
			    var dest = val.destination;
		        var dueTime = val.due;
		        var departTime = val.on_time;
		        var platform = val.platform;
                n ++;				
			    /*
			    var row = $('<li id="12" class="train_info">'+ 
			                         '<span class="dest"> </span> <span class="dueTime"> </span> <span class="departTime"></span> <span class="platform"></span>'+
							'</li>');
				row.appendTo($('#timeList'));
				
				row.find('.dest').text(dest);	
				row.find('.dueTime').text(dueTime);
				row.find('.departTime').text(departTime);
				row.find('.platform').text(platform);			
                items.push('<li id="' + key + '">' + val + '</li>');
				
				console.log(key+"   "+val.destination+"  "+val.due+"  "+val.on_time+"   "+val.platform);
				*/
				
				if(n<10){
			    var row = $('<tr>'+ 
			                         '<td class="dest"> </td> <td class="dueTime"> </td> <td class="departTime"></td> <td class="platform"></td>'+
							'</tr>');	
                row.appendTo($('#timebody'));
                row.find('.dest').text(dest);	
				row.find('.dueTime').text(dueTime);
				row.find('.departTime').text(departTime);
				row.find('.platform').text(platform);
                }				
            }); 
		});	
}


function getGeoCodeData(lat,lng){
				//console.log('onGeoData', pos.coords.accuracy, pos.coords.speed, pos.coords.altitude, pos.coords.altitudeAccuracy);
			var coder = new google.maps.Geocoder();
			var point = new google.maps.LatLng(lat, lng);
			if (coder) {
				coder.geocode(
				{'latLng': point }, 
				function (results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						if (results[0]) {
							var a = results[0];
							console.log(a);  							
							for (var i = a.address_components.length - 1; i >= 0; i--){
								var n = a.address_components[i];
								if (n['types'][0] == 'country') _country = n['long_name'];
								if (n['types'][0] == 'administrative_area_level_1') _state = n['long_name'];
								if (n['types'][0] == 'administrative_area_level_2') _city = n['long_name'];
								if (n['types'][0] == 'administrative_area_level_3') _city = n['long_name'];
								if (n['types'][0] == 'locality') _city = n['long_name'];
								if (n['types'][0] == 'sublocality') _city = n['long_name'];
							};
							
							return a;
						} else {}
					} 
					else {}
				});
			}
};	



$(function(){
	   var app = new AppRouter();
	   Backbone.history.start({pushState : true});
	   
	   //initWebsocket();	
})


function formatTime(d) {	
	hr = "";
	min = "";
	n = "";
	if (d.getHours()<12) {
		n = "AM"
	} else {
		n = "PM"
	}	
	if (d.getHours() > 12) {
	    hr = d.getHours() - 12;
	} else {
		hr = d.getHours();
	}
	if (hr < 10) {
		hr = "0" + hr;
	}
	if (d.getMinutes() < 10) {
		min = "0" + d.getMinutes();
	} else {
		min = d.getMinutes();
	}
	s = hr + ":" + min + n;	
	return(s);
}

function parseToTime(timeNum){
   
}


