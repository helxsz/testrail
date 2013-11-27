var mapView;
var Session;
window.AppRouter = Backbone.Router.extend({	 
    routes:{
    	'':'home'
    },
    initialize:function () {
    	console.log('init route');
		Session = new SessionModel();       		

        $('body').append( new HeaderView().render().el) ;
        
 	    if(mapView==undefined)
	    {
		   mapView= new MapView({map:'map'});
		   $('body').append(mapView.el);
	    }

    },
    home:function(){
    	console.log('home');
    }
});


var SessionModel = Backbone.Model.extend({
	
	validate : function(attrs) { //新增，验证属性是否合法

	},	
	save: function(attrs, options) {
	        options || (options = {});

	        options.contentType = 'application/json';
	        options.data = JSON.stringify(attrs);

	        Backbone.Model.prototype.save.call(this, attrs, options);
	},
    urlRoot: '/sessions',
    initialize: function () {
      var that = this;
      console.log("set up session model");
      // Hook into jquery
      // Use withCredentials to send the server cookies
      // The server must allow this through response headers
      $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        options.xhrFields = {
          withCredentials: true
        };
        // If we have a csrf token send it through with the next request
        if(typeof that.get('_csrf') !== 'undefined') {
          jqXHR.setRequestHeader('X-CSRF-Token', that.get('_csrf'));
          console.log('csrf  request  has');
        }
      });
    },
    login: function(creds) {
      // Do a POST to /session and send the serialized form creds
    	console.log("login the user     "+creds.username+"   "+creds.password);
      this.save({username: "Teddy"}, {
         success: function (responseText, status, xhr) {
        	  console.log('user login success' +responseText);
        	  console.log('user login success' +status);
        	  console.log('user login success' +xhr);

         },
         error : function(m,error) { //显示错误信息
        	 console.log('err login ');
       	     //$(".error").html(error);
         }
      });
    },
    logout: function() {
      // Do a DELETE to /session and clear the clientside data
    	console.log("log out the user");
      var that = this;
      this.destroy({
        success: function (model, resp) {
          model.clear()
          model.id = null;
          // Set auth to false to trigger a change:auth event
          // The server also returns a new csrf token so that
          // the user can relogin without refreshing the page
          that.set({auth: false, _csrf: resp._csrf});          
        }
      });      
    },
    getAuth: function(callback) {
      // getAuth is wrapped around our router
      // before we start any routers let us see if the user is valid
      this.fetch({
          success: callback
      });
    }    
 });







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
							console.log(a);   //打印对象，也即是地理位置
							
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
			
			//return a;
};		
/*
function makeWindowContent(params) {
      var content = "";
      content += "<strong>Route Information </strong> <br/><br/>";
      content += "<strong>Origin </strong> : " + params.origin + "<br/><br/>";
      content += "<strong>Destination </strong> : " + params.destination + "<br/><br/>";
      content += "<strong>Distance </strong> : " + params.distance + "<br/><br/>";
      content += "<strong>Duration </strong> : " + params.duration + "<br/><br/>";
      
      if(params.warnings) {
        content += "<strong>Warnings </strong> : ";
        for(var msg in params.warnings) {
          content += msg + "<br/>"
        }
      }
      infowindow.setContent(content);
}

// ---------------------------------------------------- //
// ------------- Marker Management Functions ---------- // 
    var infowindow = new google.maps.InfoWindow(windowOptions);
    var markers = [];
    var wayPoints = [];
    var windowMarker;

function clearMarkers() {
        if (markers.length) {
            markers.splice(0, markers.length);
            wayPoints.splice(0,wayPoints.length);
            directionsDisplay.setMap(null);   
            infowindow.close();
        }
}

    
function addMarker(marker) {
       markers.push(marker);
       if(markers.length > 2) {
         var waypoint = {location : markers[markers.length-2].getPosition(), stopover: false};
         wayPoints.push(waypoint);
       }
       if(markers.length > 1) {
         windowMarker = marker;
       }
}
*/
 /////////////////////////////////////////////////////////////////////////
//////////////////////////////////   http://backbonetutorials.com/infinite-scrolling/
/////////////////////////////////////////

$(function(){
	   console.log('abc    abc    abc');
	   var app = new AppRouter();
	   Backbone.history.start({pushState : true});

})



//////////////////////////////////////////////////////////////////////////////////
//=======================================================================================
// Map view searchchange
MapView = Backbone.View.extend({
        el: $('body'),// 父标签：BODY
		template:_.template($("#searchmapTemplate").html()),	
		
		initialize: function (option) {		//初始化的事情
		
			console.log(option.map);
			this.render();
			console.log('mapview-init');
			
			
			//-========================= 初始化地图
			if(navigator.geolocation)  
				navigator.geolocation.getCurrentPosition(this.success, this.error);
			else
				console.log('nono');			
			//	========================
		},
		events: {                      //事件绑定
		  "click #searchtext": "sendmsg3", //事件绑定，绑定Dom中id为searchtext的元素   按下注册按钮，触发事件，触发方法sendmsg3
		},
		render:function(){
			console.log('render');
			this.setElement(this.template());
		   return this;
		},
		sendmsg3:function(){
           console.log('mapview-sendmsg ');
		   
		   var searchMap=$("#searchtext")[0].value;  // 取值
			
		   console.log(searchMap);
		  
		   $.post("/mapsearch", {"location":searchMap},function(data) {
				console.log("success to search");
			});
		   //$.post("/register", {"account":account1,"password":password1},function(data) {
           //      console.log("success to submit");
           //})		   
		},
		//=================================success and error地图加载方法====================
		//success方法==========
		success:function (position) {	  
			console.log("success-map");
					
		   // initWebsocket();

		   $('#mapcontainer').append($('<div id="mapcanvas"  ></div>'));	//style="height:500px;width:860px"	   
		   var myOptions = {
			 zoom: 14,
			 center: new google.maps.LatLng(53.331693,-2.918243),
			 mapTypeControl: false,
			 mapTypeId: google.maps.MapTypeId.ROADMAP
		   };
		   
		   //以下是地图显示=================
		   map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);		   
		   console.log(position.coords.latitude+"    "+position.coords.longitude);   //显示下当前地理坐标		   
           var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);		   
		   marker = new google.maps.Marker({
			   position: latlng, 
			   map: map, 
			   title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
		   });		   
		   //setInterval( initMap,500);		
		   
		   //marker.bindPopup("<p>You are there! Your ID is " + userId + "</p>").openPopup();
		   
		   var a="here";
		   
		    a = JSON.stringify(getGeoCodeData(position.coords.latitude, position.coords.longitude));
		   console.log(a);
		   /*             */
google.maps.event.addListener(map, 'idle', function() {
    //initMap();

}); 		   
		   
		   google.maps.event.addListener(marker, 'mouseover', function() {    //点击触发事件
			  infowindow.open(map,marker);
			  
               //tooltip.open(this.getMap(), this);
		
		
		   });
		   google.maps.event.addListener(marker, 'mouseout', function() {    //点击触发事件
			  infowindow.close(map,marker);
			  
			   //tooltip.close();
		   });

                        var tooltip;
                        // Can pass string into Tooltip
                        tooltip = new Tooltip("Here");		   
		   
        var boxText = document.createElement("div");
        boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: yellow; padding: 5px;";
        boxText.innerHTML = "City Hall, Sechelt<br>British Columbia<br>Canada";
                
        var myOptions = {
                 content: boxText
                ,maxWidth: 0
                ,pixelOffset: new google.maps.Size(0, 0)
  
                ,boxStyle: { 
                  opacity: 0.75
                  ,width: "280px"
                 }
                ,closeBoxMargin: "10px 2px 2px 2px"
                ,closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
                ,infoBoxClearance: new google.maps.Size(1, 1)
                ,isHidden: false
                ,pane: "floatPane"
                ,enableEventPropagation: false
        };		   
   
		   var infowindow = new google.maps.InfoWindow(  myOptions  );
		   //infowindow.open(map, marker);	 
		},
		//取得数据方法=======		
		
		//error方法============
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
});
	
	
window.HeaderView = Backbone.View.extend({
    template:_.template($("#headerTemplate").html()),
    initialize: function () {
        this.render();
    },
    render: function () {
    	//console.log(this.template);
    	//this.$el.html(this.template); 
    	this.setElement(this.template());
        return this;
    }
})






//========================
// Tooltip Class Definition
//   extends OverlayView:
//   https://developers.google.com/maps/documentation/javascript/reference#OverlayView
//========================
var Tooltip
Tooltip = function(tip) {
    this.tip = tip;
    this.buildDOM();
};

$.extend(Tooltip.prototype, google.maps.OverlayView.prototype, {

    // build the DOM
    buildDOM: function() {
        // Body DIV
        this.bdiv = $("<div></div>").addClass('WindowBody').html(this.tip);
        // Window DIV
        this.wdiv = $("<div></div>").addClass('Window').append(this.bdiv);
        // Shadow DIV
        this.sdiv = $("<div></div>").addClass('WindowShadow');
        // Start Closed
        this.close();
    },

    // API - onAdd
    onAdd: function() {
        $(this.getPanes().floatPane).append(this.wdiv);
        $(this.getPanes().floatShadow).append(this.sdiv);
    },

    // API - onRemove
    onRemove: function() {
        this.wdiv.detach();
    },

    // API - draw
    draw: function() {
        var pos, left, top;
        // projection is accessible?
        if (!this.getProjection()) return;
        // position is accessible?
        if (!this.get('position')) return;
        // convert projection
        pos = this.getProjection().fromLatLngToDivPixel(this.get('position'));
        // top offset
        top = pos.y - this.getAnchorHeight() / 2;
        // left offset
        if (this.getMap().getCenter().lng() > this.get('position').lng()) {
            left = pos.x + this.wdiv.width() * 0.5;
        } else {
            left = pos.x - this.wdiv.width() * 1.5;
        }
        // window position
        this.wdiv.css('top', top);
        this.wdiv.css('left', left);
        // shadow position
        this.sdiv.css('top', (top - this.getAnchorHeight() / 2));
        this.sdiv.css('left', left);
        // shadow size
        this.sdiv.width(this.wdiv.width());
        this.sdiv.height(this.wdiv.height());
    },

    // open Tooltip
    open: function(map, anchor) {
        // bind to map
        if (map) this.setMap(map);
        // bind to anchor
        if (anchor) {
            this.set('anchor', anchor);
            this.bindTo('anchorPoint', anchor);
            this.bindTo('position', anchor);
        }
        // need to force redraw otherwise it will decide to draw after we show the Tooltip                    
        this.draw();
        // show tooltip
        this.wdiv.show();
        this.sdiv.show();
        // set property
        this.isOpen = true;
    },

    // close Tooltip
    close: function() {
        // hide tooltip
        this.wdiv.hide();
        this.sdiv.hide();
        // set property
        this.isOpen = false;
    },

    // correctly get the anchorPoint height
    getAnchorHeight: function() {
        // See: https://developers.google.com/maps/documentation/javascript/reference#InfoWindow
        //   "The anchorPoint is the offset from the anchor's position to the tip of the InfoWindow."
        return -1 * this.get('anchorPoint').y;
    }
});
