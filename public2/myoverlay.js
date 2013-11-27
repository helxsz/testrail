function distance(lat1,lon1,lat2,lon2) {
    var R = 6371; // km (change this constant to get miles)
    var dLat = (lat2-lat1) * Math.PI / 180;
    var dLon = (lon2-lon1) * Math.PI / 180; 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    if (d>1) return Math.round(d)+"km";
    else if (d<=1) return Math.round(d*1000)+"m";
    return d;
}
/****

          MiniCanvas 

*****/

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// START CUSTOM MAP OVERLAY DEFINITION
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//make the main definition of our custom overlay here
function MiniCanvas(map, position, name,  numDocks) {
  	this.map_ = map;
	this.position_ = position;
	this.name_ = name;
	this.numDocks_ = parseInt(numDocks);
  	this.canvas_ = null;
	this.stationTip = null;
	this.canvasWidth_ = 12;
	this.canvasHeight_ = 6 + 13 + this.numDocks_ + 6;
  	this.setMap(map);
	
    this.background_canvas = null;
	
	console.log('canvas                 '+this.position_);
}
//http://samedwards.net/?p=14

	MiniCanvas.prototype = new google.maps.OverlayView();
	MiniCanvas.prototype.onAdd = function() {	
		var canvas = document.createElement("canvas");
		canvas.setAttribute("width", this.canvasWidth_);
		canvas.setAttribute("height", this.canvasHeight_);
		canvas.style.position = "absolute";		

	  	this.canvas_ = canvas;
	  	var panes = this.getPanes();
		//panes.overlayLayer.appendChild(canvas);
        //panes.overlayMouseTarget.appendChild(canvas);
		panes.floatPane.appendChild(canvas);
           this.stationTip = document.createElement("div");
		   this.stationTip.setAttribute("width", this.canvasWidth_);
		   this.stationTip.setAttribute("height", this.canvasHeight_);
		   this.stationTip.style.position = "absolute";			
           this.stationTip.innerHTML = this.name;
		   panes.floatPane.appendChild(this.stationTip);
		/////////////////////////////////////////////////////////////
	}

	//provide a method for detaching this overlay	
	MiniCanvas.prototype.remove = function() {
	    if(this.canvas_){
		  	this.canvas_.parentNode.removeChild(this.canvas_);
	  	    this.canvas_ = null;
		}
			
		if (this.stationTip) {
          this.stationTip.parentNode.removeChild(this.stationTip);
          this.stationTip = null;
        }
		
		if(this.background_canvas){
		  this.background_canvas.parentNode.removeChild(this.background_canvas);
		  this.background_canvas = null;
		}
	}
     
	 
	MiniCanvas.prototype.clickCanvas = function(){
        console.log("on mouse click  "+this.position_);
    }	
	
	MiniCanvas.prototype.onMouseOver = function(){
	    console.log('on mouse over');
	}
	 
	MiniCanvas.prototype.onMouseOut = function(){
	    console.log('on onMouseOut');
	}

	//define a draw method to render the graphics on canvas (at the same time define what happens when the user rollsover)
	MiniCanvas.prototype.draw = function() {
////////////////////////////////////////////////////////////////////////////	
	  	var overlayProjection = this.getProjection();
	  	var p = overlayProjection.fromLatLngToDivPixel(this.position_);
	  	var canvas = this.canvas_;
		canvas.p = this.p;
		if( map.getZoom() >14 ){
            //console.log(">14");
		}else{
            //console.log("<14");
        }		
		//add onmouseover and display a tooltip		
	    var self = this;	
		canvas.onmouseover = function(e) {
		this.style.cursor = "pointer";
/*
		var canvas1 = document.createElement("canvas");
		canvas1.setAttribute("width", 100);
		canvas1.setAttribute("height", 100);
		canvas1.style.position = "absolute";		
		
        // Create an empty project and a view for the canvas:
		this.background_canvas = canvas1;
        paper.setup(canvas1);
		var myCircle = new paper.Path.Circle(new paper.Point(50, 50), 30);
        myCircle.fillColor = 'black';			
			
	  	var panes = self.getPanes();
        panes.overlayMouseTarget.appendChild(canvas1);			
		console.log("on mouse over");
*/
		}
		
		canvas.onmouseout = function() {
			//document.getElementById("tooltip").style.visibility = "hidden";		
			console.log("on mouse out");
			if(this.background_canvas){
		       this.background_canvas.parentNode.removeChild(this.background_canvas);
		       this.background_canvas = null;
		    }
		}		
		canvas.onclick = this.clickCanvas;        
		canvas.style.width = this.canvasWidth_ + "px";
		canvas.style.height = this.canvasHeight_ + "px";
		
		if(canvas.getContext) {			
		    var context = canvas.getContext('2d');			
			context.clearRect(0,0,this.canvasWidth_,this.canvasHeight_);			
			var grad = context.createRadialGradient(6, this.canvasHeight_ - 6, 0, 6, this.canvasHeight_ - 6, 12);
			grad.addColorStop(0, 'rgba(0,0,0,0.5)');
			grad.addColorStop(0.5, 'rgba(0,0,0,0)');
			context.fillStyle = grad;
			context.fillRect(0, this.canvasHeight_ - 12, 12, 12);
	
			//draw a silhouette
			context.fillStyle = 'rgba(93, 59, 113, 0.2)';
			context.moveTo(6, this.canvasHeight_ - 6);
			context.beginPath();
			context.lineTo(0, this.canvasHeight_ - 6 - 13);
			context.lineTo(0, 6);
			context.arcTo(0, 0, 6, 0, 6);
			context.arcTo(12, 0, 12, 6, 6);
			context.lineTo(12, this.canvasHeight_ - 6 - 13);
			context.lineTo(6, this.canvasHeight_ - 6);
			context.closePath();
			context.fill();
			context.strokeStyle = 'rgba(93, 59, 113, 0.4)';
			context.stroke();
			var bikes = 5;
			//if we have 1 or more available bikes then
			if ( bikes >= 1) {				
				//draw a triangle for the cBottom
				context.fillStyle = 'rgba(93, 59, 113, 1)';
				context.moveTo(6, this.canvasHeight_ - 6);
				context.beginPath();
				context.lineTo(0, this.canvasHeight_ - 6 - 13);
				context.lineTo(12, this.canvasHeight_ - 6 - 13);
				context.lineTo(6, this.canvasHeight_ - 6);
				context.closePath();
				context.fill();				
				//draw a rectangle for the cMiddle (sAVailableBikes)
				context.fillStyle = 'rgba(126, 93, 145, 1)';
				context.moveTo(0, this.canvasHeight_ - 6 - 13);
				context.beginPath();
				context.lineTo(0, this.canvasHeight_ - 6 - 13 - bikes);
				context.lineTo(12, this.canvasHeight_ - 6 - 13 - bikes);
				context.lineTo(12, this.canvasHeight_ - 6 - 13);
				context.lineTo(0, this.canvasHeight_ - 6 - 13);
				context.closePath();
				context.fill();				
				//draw the bottom curve of the middle
				context.moveTo(0, this.canvasHeight_ - 6 - 13);
				context.beginPath();
				context.arc(6,this.canvasHeight_ - 6 - 13,6,0, Math.PI * 2, true);
				context.closePath();
				context.fill();				
				//draw a circle for the cTop
				context.fillStyle = 'rgba(166, 124, 191, 1)';
				context.moveTo(0, this.canvasHeight_ - 6 - 13 - bikes);
				context.beginPath();
				context.arc(6,this.canvasHeight_ - 6 - 13 - bikes,6,0, Math.PI * 2, true);
				context.closePath();
				context.fill();
			}
			
			            //Styles for label
      context.font = '40pt Calibri';
      context.fillStyle = 'blue';
      context.fillText('Hello World!', 15, 10);
		}
		//position the canvas based on the dimensions
		canvas.style.left = (p.x-6) + 'px';
	  	canvas.style.top = p.y - (parseInt(canvas.style.height) - 6) + 'px';
		//set the z-index of the overlay based on its level down the page
		canvas.style.zIndex = p.y;
		///////////////////////////////////////////////////////////////////////////////////
		if(this.stationTip!=null){
		   this.stationTip.style.left = (p.x-6) + 'px';
		   this.stationTip.style.top = p.y - (parseInt(canvas.style.height) - 6) + 'px';
		}
	}


/***************

MiniCanvas2

****************/


/*
//var overlay = new MiniCanvas2(map, new google.maps.LatLng(53.34,-2.9178), "abc",13);
// http://jsfiddle.net/mBzVR/4/
function MiniCanvas2(map, position, name,  numDocks) {

  	this.map_ = map;
	this.position_ = position;
	this.name_ = name;
	this.numDocks_ = parseInt(numDocks);
  	this.canvas_ = null;
	this.stationTip = null;
	this.canvasWidth_ = 32;
	this.canvasHeight_ = 36 + 13 + this.numDocks_ + 6;
  	this.setMap(map);
}
//http://samedwards.net/?p=14
function defineOverlay2() {
	MiniCanvas2.prototype = new google.maps.OverlayView();
	MiniCanvas2.prototype.onAdd = function() {	
		var canvas = document.createElement("canvas");
		canvas.setAttribute("width", this.canvasWidth_);
		canvas.setAttribute("height", this.canvasHeight_);
		canvas.style.position = "absolute";		
		
	  	this.canvas_ = canvas;
	  	var panes = this.getPanes();
		//panes.overlayLayer.appendChild(canvas);
        panes.overlayMouseTarget.appendChild(canvas);
		/////////////////////////////////////////////////////////////
	}

	//provide a method for detaching this overlay	
	MiniCanvas2.prototype.remove = function() {
	  	this.canvas_.parentNode.removeChild(this.canvas_);
	  	this.canvas_ = null;	
	}

	//define a draw method to render the graphics on canvas (at the same time define what happens when the user rollsover)
	MiniCanvas2.prototype.draw = function() {
		
	  	var overlayProjection = this.getProjection();
	  	var p = overlayProjection.fromLatLngToDivPixel(this.position_);
	  	var canvas = this.canvas_;
		canvas.p = this.p;
		//add onmouseover and display a tooltip	
		
		canvas.onmouseover = function(e) {
			this.style.cursor = "pointer";
			console.log("on mouse over");
		}
		
		canvas.onmouseout = function() {
			//document.getElementById("tooltip").style.visibility = "hidden";		
			console.log("on mouse out");
		}
		
		canvas.onclick = function(){
		   console.log("on mouse click");
		}
        
		canvas.style.width = this.canvasWidth_ + "px";
		canvas.style.height = this.canvasHeight_ + "px";
		
		if(canvas.getContext) {			
		    //var context = canvas.getContext('2d');			
            //context.arc(20, 0, 25, 0, Math.PI*2, false);
            //context.fill();
		    var context = canvas.getContext('2d');			
			context.clearRect(0,0,this.canvasWidth_,this.canvasHeight_);			
			var grad = context.createRadialGradient(6, this.canvasHeight_ - 6, 0, 6, this.canvasHeight_ - 6, 12);
			grad.addColorStop(0, 'rgba(0,0,0,0.5)');
			grad.addColorStop(0.5, 'rgba(0,0,0,0)');
			context.fillStyle = grad;
			context.fillRect(0, 0, 30, 30);
		}
		//position the canvas based on the dimensions
		canvas.style.left = (p.x-6) + 'px';
	  	canvas.style.top = p.y - (parseInt(canvas.style.height) - 6) + 'px';
		//set the z-index of the overlay based on its level down the page
		canvas.style.zIndex = p.y;

	}

}
*/
/*
function InfoBox(opts) {
  //google.maps.OverlayView.call(this);
  this.latlng_ = opts.latlng;
  this.map_ = opts.map;
  this.offsetVertical_ = -195;
  this.offsetHorizontal_ = 0;
  this.height_ = 165;
  this.width_ = 266;


  var me = this;
  this.boundsChangedListener_ =
    google.maps.event.addListener(this.map_, "bounds_changed", function() {
      return me.panMap.apply(me);
    });


  this.setMap(this.map_);
}


InfoBox.prototype = new google.maps.OverlayView();


InfoBox.prototype.remove = function() {
  if (this.div_) {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }
};

InfoBox.prototype.onAdd = function() {	
   this.createElement();
	//var panes = this.getPanes();
	//panes.overlayLayer.appendChild(canvas);
   // panes.overlayMouseTarget.appendChild(canvas);
		/////////////////////////////////////////////////////////////
}

InfoBox.prototype.draw = function() {
  // Creates the element if it doesn't exist already.

  if (!this.div_) return;

  // Calculate the DIV coordinates of two opposite corners of our bounds to
  // get the size and position of our Bar
  var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
  if (!pixPosition) return;

  // Now position our DIV based on the DIV coordinates of our bounds
  this.div_.style.width = this.width_ + "px";
  this.div_.style.left = (pixPosition.x + this.offsetHorizontal_) + "px";
  this.div_.style.height = this.height_ + "px";
  this.div_.style.top = (pixPosition.y + this.offsetVertical_) + "px";
  this.div_.style.display = 'block';
};


InfoBox.prototype.createElement = function() {
  var panes = this.getPanes();
  var div = this.div_;
  if (!div) {
    // This does not handle changing panes.  You can set the map to be null and
    // then reset the map to move the div.
    div = this.div_ = document.createElement("div");
    div.style.border = "0px none";
    div.style.position = "absolute";
    div.style.background = "url('http://gmaps-samples.googlecode.com/svn/trunk/images/blueinfowindow.gif')";
    div.style.width = this.width_ + "px";
    div.style.height = this.height_ + "px";
    var contentDiv = document.createElement("div");
    contentDiv.style.padding = "30px"
    contentDiv.innerHTML = "<b>Hello World!</b>";

    var topDiv = document.createElement("div");
    topDiv.style.textAlign = "right";
    var closeImg = document.createElement("img");
    closeImg.style.width = "32px";
    closeImg.style.height = "32px";
    closeImg.style.cursor = "pointer";
    closeImg.src = "http://gmaps-samples.googlecode.com/svn/trunk/images/closebigger.gif";
    topDiv.appendChild(closeImg);

    function removeInfoBox(ib) {
      return function() {
        ib.setMap(null);
      };
    }

    google.maps.event.addDomListener(closeImg, 'click', removeInfoBox(this));

    div.appendChild(topDiv);
    div.appendChild(contentDiv);
    div.style.display = 'none';
    panes.floatPane.appendChild(div);
    //this.panMap();
  } else if (div.parentNode != panes.floatPane) {
    // The panes have changed.  Move the div.
    div.parentNode.removeChild(div);
    panes.floatPane.appendChild(div);
  } else {
    // The panes have not changed, so no need to create or move the div.
  }
}


InfoBox.prototype.panMap = function() {
};

*/

//infobox code----------
var overlay;

function InfoBox(map) {
    google.maps.OverlayView.call(this);
    this.setMap(map);
	
	this.type = 0;  // 0 station/ 1train
}
InfoBox.prototype = new google.maps.OverlayView();
InfoBox.prototype.createElement = function() {
    var panes = this.getPanes();
    var div = this.div_;

    if (!div) {
        div = this.div_ = document.createElement("div");
        div.style.position = "absolute";
        div.setAttribute('id', "infobox");
        div.style.backgroundColor = 'white';
        div.style.border = '1px solid black';
        this.div_ = div;
        panes.floatPane.appendChild(div);
    }
}
InfoBox.prototype.setMarker = function(marker) {
    
    this.marker_ = marker;
}

InfoBox.prototype.setStation = function(stanox) {
    this.stanox_ = stanox;
	this.type = 0;
}

InfoBox.prototype.setTrain = function(trainid){
    this.trainid_ = trainid;
	this.type = 1;
}

InfoBox.prototype.draw = function() {
    this.createElement();
}
InfoBox.prototype.hide = function() {
    if (this.div_) {
        this.div_.style.visibility = "hidden";
    }
}
InfoBox.prototype.show = function() {
    if (this.div_) {
        var markerOffset = this.getProjection().fromLatLngToDivPixel(this.marker_.position);
        this.div_.style.top = markerOffset.y + 20 + 'px';
        this.div_.style.left = markerOffset.x - 40 + 'px';
		if(this.type==0){		
           this.div_.innerHTML = '<b>' +  window.stations.get(this.stanox_).get('station') + '</b>'+ '<b>' +  this.stanox_ + '</b>';		                      
           this.div_.style.visibility = "visible";		
		}else{
		   var model = window.schedules.get(this.trainid_);
           this.div_.innerHTML = '<b>' +  model.get('trainId') + '</b>'+ '<div>'+'from '+ model.get('stanox')  + '  to  '+ model.get('next_stanox')  + '</div>';		                      
           this.div_.style.visibility = "visible";
           		   
		}
    }
}

//infobox code end-----------