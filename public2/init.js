
var stations = new Object();
function initMap()
{

// Create array containing the points for the tracks on the loop line
    var routeLoop = [
      new google.maps.LatLng(53.394718,-3.013679),		//Hamilton Square
      new google.maps.LatLng(53.404786,-2.991964),		//James Street
	  new google.maps.LatLng(53.408593,-2.989148),		//Moorfields
	  new google.maps.LatLng(53.407332,-2.977783),		//Lime Street UG
	  new google.maps.LatLng(53.404684,-2.979226),		//Liverpool Central
	  new google.maps.LatLng(53.404786,-2.991964),		//James Street
	  new google.maps.LatLng(53.394718,-3.013679),		//Hamilton Square
	  ];
    	 
// Create track polyline object properties
	var polyline = new google.maps.Polyline({
      path: routeLoop, 
	  map: map,
      strokeColor: "#ff0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
	
// Create array containing the points for the tracks on the West Kirby line
	var routeWestkirby = [
      new google.maps.LatLng(53.373182,-3.183777),		//WestKirby
      new google.maps.LatLng(53.390054,-3.178589),		//Hoylake
	  new google.maps.LatLng(53.394791,-3.171428),		//Manor Road
	  new google.maps.LatLng(53.399458,-3.154283),		//Meols
	  new google.maps.LatLng(53.407225,-3.113514),		//Moreton
	  new google.maps.LatLng(53.408067,-3.099582),		//Leasowe
	  new google.maps.LatLng(53.409158,-3.078677),		//Bidston
	  new google.maps.LatLng(53.40446,-3.057606),		//Birkenhead North
	  new google.maps.LatLng(53.39743,-3.039104),		//Birkenhead Park
	  new google.maps.LatLng(53.393372,-3.022664),		//Conway Park
	  new google.maps.LatLng(53.394718,-3.013679),		//Hamilton Square
	  ];
	
	
// Create track polyline object properties
    var polyline = new google.maps.Polyline({
      path: routeWestkirby, 
	  map: map,
      strokeColor: "#ff0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
	
	
// Create array containing the points for the tracks on the New Brighton line
	var routeNewBrighton = [
      new google.maps.LatLng(53.437419,-3.047944),		//New Brighton
      new google.maps.LatLng(53.428078,-3.069788),		//Wallaey Grove Road
	  new google.maps.LatLng(53.422906,-3.069139),		//Wallaey Village
	  new google.maps.LatLng(53.40446,-3.057606),		//Birkenhead North
	  new google.maps.LatLng(53.39743,-3.039104),		//Birkenhead Park
	  new google.maps.LatLng(53.393372,-3.022664),		//Conway Park
	  new google.maps.LatLng(53.394718,-3.013679),		//Hamilton Square
	  ];
	

// Create track polyline object properties
    var polyline = new google.maps.Polyline({
      path: routeNewBrighton, 
	  map: map,
      strokeColor: "#ff0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
	
	
// Create array containing the points for the tracks on the Chester line
	var routeChester = [
      new google.maps.LatLng(53.196709,-2.879622),		//Chester
      new google.maps.LatLng(53.208794,-2.891735),		//Bache
	  new google.maps.LatLng(53.26019,-2.942297),		    //Capenhurst
	  new google.maps.LatLng(53.297241,-2.976914),		//Hooton
	  new google.maps.LatLng(53.307626,-2.981053),		//Eastham Rake
	  new google.maps.LatLng(53.321868,-2.986903),		//Bromborough 
	  new google.maps.LatLng(53.329957,-2.989579),		//Bromborough Rake
	  new google.maps.LatLng(53.339945,-2.993994),		//Spital
	  new google.maps.LatLng(53.349181,-2.998522),		//Port Sunlight
	  new google.maps.LatLng(53.357762,-3.003656),		//Bebington
	  new google.maps.LatLng(53.372659,-3.010806),		//Rock Ferry
	  new google.maps.LatLng(53.383271,-3.016391),		//Green Lane
	  new google.maps.LatLng(53.388332,-3.020824),		//Birkenhead Central
	  new google.maps.LatLng(53.394718,-3.013679),		//Hamilton Square
	  ];
	
	
// Create track polyline object properties
    var polyline = new google.maps.Polyline({
      path: routeChester, 
	  map: map,
      strokeColor: "#ff0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
	

// Create array containing the points for the tracks on the Ellesmere Port Line 
	var routeEllesmereport = [
      new google.maps.LatLng(53.282207,-2.896453),		//Ellesmere Port
      new google.maps.LatLng(53.284064,-2.924069),		//Overpool
	  new google.maps.LatLng(53.285534,-2.943303),		//Little Sutton
	  new google.maps.LatLng(53.297241,-2.976914),		//Hooton
	  new google.maps.LatLng(53.307626,-2.981053),		//Eastham Rake
	  new google.maps.LatLng(53.321868,-2.986903),		//Bromborough 
	  new google.maps.LatLng(53.329957,-2.989579),		//Bromborough Rake
	  new google.maps.LatLng(53.339945,-2.993994),		//Spital
	  new google.maps.LatLng(53.349181,-2.998522),		//Port Sunlight
	  new google.maps.LatLng(53.357762,-3.003656),		//Bebington
	  new google.maps.LatLng(53.372659,-3.010806),		//Rock Ferry
	  new google.maps.LatLng(53.383271,-3.016391),		//Green Lane
	  new google.maps.LatLng(53.388332,-3.020824),		//Birkenhead Central
	  new google.maps.LatLng(53.394718,-3.013679),		//Hamilton Square
	  ];
	
	
// Create track polyline object properties
    var polyline = new google.maps.Polyline({
      path: routeEllesmereport, 
	  map: map,
      strokeColor: "#ff0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
	
	// Create array containing the points for the tracks on the Southport Line 
	var routeSouthport = [
      new google.maps.LatLng(53.646546,-3.002583),		//Southport
      new google.maps.LatLng(53.634003,-3.014449),		//Birkdale
	  new google.maps.LatLng(53.622308,-3.024867),		//Hillside
	  new google.maps.LatLng(53.602055,-3.042805),		//Ainsdale
	  new google.maps.LatLng(53.566057,-3.071977),		//Freshfield
	  new google.maps.LatLng(53.553509,-3.071043),		//Formby
	  new google.maps.LatLng(53.525124,-3.057182),		//Hightown
	  new google.maps.LatLng(53.497499,-3.049757),		//Hall Road
	  new google.maps.LatLng(53.487707,-3.039994),		//Blundellsands and Crosby
	  new google.maps.LatLng(53.474967,-3.025575),		//Waterloo
	  new google.maps.LatLng(53.466285,-3.005769),		//Seaforth and Litherland	  
	  new google.maps.LatLng(53.45342,-2.994783),		//Bootle New Strand
	  new google.maps.LatLng(53.446641,-2.995867),		//Bootle Oriel Road
	  new google.maps.LatLng(53.437522,-2.987584),		//Bank Hall
	  new google.maps.LatLng(53.429979,-2.991543),		//Sandhills
	  new google.maps.LatLng(53.408593,-2.989148),		//Moorfields 
	  ];
	
	// Create track polyline object properties
    var polyline = new google.maps.Polyline({
      path: routeSouthport, 
	  map: map,
      strokeColor: "#ff0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
	
	
	
	// Create array containing the points for the tracks on the Ormskirk Line 
	  var routeOrmskirk = [
      new google.maps.LatLng(53.569345,-2.881186),		//Ormskirk
      new google.maps.LatLng(53.554298,-2.895227),		//Aughton Park
	  new google.maps.LatLng(53.542834,-2.904492),		//Town Green
	  new google.maps.LatLng(53.506664,-2.930858),		//Maghull
	  new google.maps.LatLng(53.486868,-2.950746),		//Old Roan
	  new google.maps.LatLng(53.473936,-2.956288),		//Aintree
	  new google.maps.LatLng(53.461914,-2.963315),		//Orrell Park
	  new google.maps.LatLng(53.457361,-2.966738),		//Walton
	  new google.maps.LatLng(53.440915,-2.981109),		//Kirkdale
	  new google.maps.LatLng(53.429979,-2.991543),		//Sandhills
	  new google.maps.LatLng(53.408593,-2.989148),		//Moorfields	  
	
	  ];
	
	
// Create track polyline object properties
    var polyline = new google.maps.Polyline({
      path: routeOrmskirk, 
	  map: map,
      strokeColor: "#ff0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
	
	
	
	// Create array containing the points for the tracks on the Liverpool South Parkway Line 
	  var routeLiverpoolSouthParkway = [
      new google.maps.LatLng(53.357967,-2.889211),		//Liverpool South Parkway
      new google.maps.LatLng(53.358761,-2.911999),		//Cressington
	  new google.maps.LatLng(53.364613,-2.927234),		//Aigburth
	  new google.maps.LatLng(53.506664,-2.930858),		//Sy Michels
	  new google.maps.LatLng(53.486868,-2.950746),		//Brunswick
	  new google.maps.LatLng(53.473936,-2.956288),		//Liverpool Central
	  ];
	
	
// Create track polyline object properties
    var polyline = new google.maps.Polyline({
      path: routeLiverpoolSouthParkway, 
	  map: map,
      strokeColor: "#ff0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
	
	
// Create track polylines 
    polyline.setMap(map);
	
	//======================STATION MARKERS AND INFO======================
	
// Create station icon calling MerseyRail logo
    var station = new google.maps.MarkerImage('assets/img/MerseyRailLogo3.png');
	
// Create station positions
	
      var aigburth = new google.maps.LatLng(53.364613,-2.927234);
	  var aigburth.stanox = 1122;
      var ainsdale = new google.maps.LatLng(53.602055,-3.042805);
	  var aintree = new google.maps.LatLng(53.473936,-2.956288);
	  var aughtonPark = new google.maps.LatLng(53.554298,-2.895227);
	  var bache = new google.maps.LatLng(53.208794,-2.891735);
	  var bankHall = new google.maps.LatLng(53.437522,-2.987584);
	  var bebington = new google.maps.LatLng(53.357762,-3.003656);
	  var bidston = new google.maps.LatLng(53.409158,-3.078677);
	  var birkdale = new google.maps.LatLng(53.634003,-3.014449);
	  var birkenheadCentral = new google.maps.LatLng(53.388332,-3.020824);
	  var birkenheadNorth = new google.maps.LatLng(53.40446,-3.057606);
	  var birkenheadPark = new google.maps.LatLng(53.39743,-3.039104);
      var blundellsandsAndCrosby = new google.maps.LatLng(53.487707,-3.039994);
	  var bootleNewStrand = new google.maps.LatLng(53.45342,-2.994783);
	  var bootleOrielRoad = new google.maps.LatLng(53.446641,-2.995867);
	  var bromborough = new google.maps.LatLng(53.321868,-2.986903);
	  var bromboroughRake = new google.maps.LatLng(53.329957,-2.989579);
	  var brunswick = new google.maps.LatLng(53.383256,-2.976112);
	  var capenhurst = new google.maps.LatLng(53.26019,-2.942297);
	  var chester = new google.maps.LatLng(53.19672,-2.879518);
	  var conwayPark = new google.maps.LatLng(53.393372,-3.022664);
	  var cressington = new google.maps.LatLng(53.358761,-2.911999);
	  var easthamRake = new google.maps.LatLng(53.307626,-2.981053);
	  var ellesmerePort = new google.maps.LatLng(53.282207,-2.896453);
	  var fazakerley = new google.maps.LatLng(53.469133,-2.936729);
	  var formby = new google.maps.LatLng(53.553509,-3.071043);
	  var freshfield = new google.maps.LatLng(53.566057,-3.071977);
	  var greenLane = new google.maps.LatLng(53.383271,-3.016391);
	  var hallRoad = new google.maps.LatLng(53.497499,-3.049757);
	  var hamiltonSquare = new google.maps.LatLng(53.394718,-3.013679);
      var hightown = new google.maps.LatLng(53.525124,-3.057182);
	  var hillside = new google.maps.LatLng(53.622308,-3.024867);
	  var hooton = new google.maps.LatLng(53.297241,-2.976914);
	  var hoylake = new google.maps.LatLng(53.390054,-3.178589);
	  var huntsCross = new google.maps.LatLng(53.360726,-2.855898);
	  var jamesStreet = new google.maps.LatLng(53.404786,-2.991964);
	  var kirkby = new google.maps.LatLng(53.486205,-2.902829);
	  var kirkdale = new google.maps.LatLng(53.440915,-2.981109);
      var leasowe = new google.maps.LatLng(53.408067,-3.099582);
	  var limestreet = new google.maps.LatLng(53.407332,-2.977783);
	  var littleSutton = new google.maps.LatLng(53.285534,-2.943303);
	  var liverpoolCentral = new google.maps.LatLng(53.404684,-2.979226);
	  var southParkway = new google.maps.LatLng(53.357967,-2.889211);
	  var maghull = new google.maps.LatLng(53.506664,-2.930858);
	  var manorRoad = new google.maps.LatLng(53.394791,-3.171428);
	  var meols = new google.maps.LatLng(53.399458,-3.154283);
	  var moorfields = new google.maps.LatLng(53.408593,-2.989148);
	  var moreton = new google.maps.LatLng(53.407225,-3.113514);
	  var newBrighton = new google.maps.LatLng(53.437419,-3.047944);
	  var oldRoan = new google.maps.LatLng(53.486868,-2.950746);
	  var ormskirk = new google.maps.LatLng(53.569345,-2.881186);
	  var orrellPark = new google.maps.LatLng(53.461914,-2.963315);
	  var overpool = new google.maps.LatLng(53.284064,-2.924069);
	  var portSunlight = new google.maps.LatLng(53.349181,-2.998522);
	  var riceLane = new google.maps.LatLng(53.457662,-2.962355);
	  var rockFerry = new google.maps.LatLng(53.372659,-3.010806);
      var sandhills = new google.maps.LatLng(53.429979,-2.991543);
	  var seaforthLitherland = new google.maps.LatLng(53.466285,-3.005769);
	  var southport = new google.maps.LatLng(53.646546,-3.002583);
	  var spital = new google.maps.LatLng(53.339945,-2.993994);
	  var stMichaels = new google.maps.LatLng(53.375943,-2.952919);
	  var townGreen = new google.maps.LatLng(53.542834,-2.904492);
	  var groveRoad = new google.maps.LatLng(53.428078,-3.069788);
	  var wallaseyVillage = new google.maps.LatLng(53.422906,-3.069139);
	  var walton = new google.maps.LatLng(53.457361,-2.966738);
	  var waterloo = new google.maps.LatLng(53.474967,-3.025575);
	  var westKirby = new google.maps.LatLng(53.373191,-3.183763);
	  
	  stations['Aigburth'] = aigburth;
	  stations['Ainsdale'] = ainsdale;
	  
	  
	  
	  
	  
	  
// Create station markers
    

    var marker1 = new google.maps.Marker({position: aigburth, map: map, icon: station, title:"Aigburth"});
	
	var marker1 = new google.maps.Marker({position: ainsdale, map: map, icon: station, title:"Ainsdale"});
	var marker1 = new google.maps.Marker({position: aintree, map: map, icon: station, title:"Aintree"});
	var marker1 = new google.maps.Marker({position: aughtonPark, map: map, icon: station, title:"Aughton Park"});
	var marker1 = new google.maps.Marker({position: bache, map: map, icon: station, title:"Bache"});
	var marker1 = new google.maps.Marker({position: bankHall, map: map, icon: station, title:"Bank Hall"	});
	var marker1 = new google.maps.Marker({position: bebington, map: map, icon: station, title:"Bebington"});
	var marker1 = new google.maps.Marker({position: bidston, map: map, icon: station, title:"Bidston"});
	var marker1 = new google.maps.Marker({position: birkdale, map: map, icon: station, title:"Birkdale"});
	var marker1 = new google.maps.Marker({position: birkenheadCentral, map: map, icon: station, title:"Birkenhead Central"});
	var marker1 = new google.maps.Marker({position: birkenheadNorth, map: map, icon: station, title:"Birkenhead North"});
	var marker1 = new google.maps.Marker({position: birkenheadPark, map: map, icon: station, title:"Birkenhead Park"});
	var marker1 = new google.maps.Marker({position: blundellsandsAndCrosby, map: map, icon: station, title:"Blundellsands and Crosby"});
	var marker1 = new google.maps.Marker({position: bootleNewStrand, map: map, icon: station, title:"Bootle New Strand"});
	var marker1 = new google.maps.Marker({position: bootleOrielRoad, map: map, icon: station, title:"Bootle Oriel Road"});
	var marker1 = new google.maps.Marker({position: bromborough, map: map, icon: station, title:"Bromborough"});
	var marker1 = new google.maps.Marker({position: bromboroughRake, map: map, icon: station, title:"BromboroughRake"	});
	var marker1 = new google.maps.Marker({position: brunswick, map: map, icon: station, title:"Brunswick"});
	var marker1 = new google.maps.Marker({position: capenhurst, map: map, icon: station, title:"Capenhurst"});
	var marker1 = new google.maps.Marker({position: chester, map: map, icon: station, title:"Chester"});
	var marker1 = new google.maps.Marker({position: conwayPark, map: map, icon: station, title:"Conway Park"});
	var marker1 = new google.maps.Marker({position: cressington, map: map, icon: station, title:"Cressington"});
	var marker1 = new google.maps.Marker({position: easthamRake, map: map, icon: station, title:"Eastham Rake"});
	var marker1 = new google.maps.Marker({position: ellesmerePort, map: map, icon: station, title:"Ellesmere Port"	});
	var marker1 = new google.maps.Marker({position: fazakerley, map: map, icon: station, title:"Fazakerley"});
	var marker1 = new google.maps.Marker({position: formby, map: map, icon: station, title:"Formby"});
	var marker1 = new google.maps.Marker({position: freshfield, map: map, icon: station, title:"Freshfield"});
	var marker1 = new google.maps.Marker({position: greenLane, map: map, icon: station, title:"Green Lane"});
	var marker1 = new google.maps.Marker({position: hallRoad, map: map, icon: station, title:"Hall Road"});
	var marker1 = new google.maps.Marker({position: hamiltonSquare, map: map, icon: station, title:"Hamilton Square"});
	var marker1 = new google.maps.Marker({position: hightown, map: map, icon: station, title:"Hightown"});
	var marker1 = new google.maps.Marker({position: hillside, map: map, icon: station, title:"Hillside"});
	var marker1 = new google.maps.Marker({position: hooton, map: map, icon: station, title:"Hooton"});
	var marker1 = new google.maps.Marker({position: hoylake, map: map, icon: station, title:"Hoylake"});
	var marker1 = new google.maps.Marker({position: huntsCross, map: map, icon: station, title:"Hunts Cross"	});
	var marker1 = new google.maps.Marker({position: jamesStreet, map: map, icon: station, title:"James Street"});    
	var marker1 = new google.maps.Marker({position: kirkby, map: map, icon: station, title:"Kirkby"});
	var marker1 = new google.maps.Marker({position: kirkdale, map: map, icon: station, title:"Kirkdale"});
	var marker1 = new google.maps.Marker({position: leasowe, map: map, icon: station, title:"Leasowe"});
	var marker1 = new google.maps.Marker({position: limestreet, map: map, icon: station, title:"Lime Street"});
	var marker1 = new google.maps.Marker({position: littleSutton, map: map, icon: station, title:"Little Sutton"});
	var marker1 = new google.maps.Marker({position: liverpoolCentral, map: map, icon: station, title:"liverpool Central"	});
	var marker1 = new google.maps.Marker({position: southParkway, map: map, icon: station, title:"South Parkway"});
	var marker1 = new google.maps.Marker({position: maghull, map: map, icon: station, title:"Maghull"});
	var marker1 = new google.maps.Marker({position: manorRoad, map: map, icon: station, title:"Manor Road"});
	var marker1 = new google.maps.Marker({position: meols, map: map, icon: station, title:"Meols"});
	var marker1 = new google.maps.Marker({position: moorfields, map: map, icon: station, title:"Moorfields"});
	var marker1 = new google.maps.Marker({position: moreton, map: map, icon: station, title:"Moreton"});
	var marker1 = new google.maps.Marker({position: newBrighton, map: map, icon: station, title:"New Brighton"	});
	var marker1 = new google.maps.Marker({position: oldRoan, map: map, icon: station, title:"Old Roan"});
	var marker1 = new google.maps.Marker({position: ormskirk, map: map, icon: station, title:"Ormskirk"});
	var marker1 = new google.maps.Marker({position: orrellPark, map: map, icon: station, title:"Orrell Park"});
	var marker1 = new google.maps.Marker({position: overpool, map: map, icon: station, title:"Overpool"});
	var marker1 = new google.maps.Marker({position: portSunlight, map: map, icon: station, title:"Port Sunlight"});
	var marker1 = new google.maps.Marker({position: riceLane, map: map, icon: station, title:"Rice Lane"});
	var marker1 = new google.maps.Marker({position: rockFerry, map: map, icon: station, title:"Rock Ferry"});
	var marker1 = new google.maps.Marker({position: sandhills, map: map, icon: station, title:"Sandhills"});
	var marker1 = new google.maps.Marker({position: seaforthLitherland, map: map, icon: station, title:"Seaforth and Litherland"});
	var marker1 = new google.maps.Marker({position: southport, map: map, icon: station, title:"Southport"});
	var marker1 = new google.maps.Marker({position: spital, map: map, icon: station, title:"Spital"});
	var marker1 = new google.maps.Marker({position: stMichaels, map: map, icon: station, title:"St Michaels"	});
	var marker1 = new google.maps.Marker({position: townGreen, map: map, icon: station, title:"Town Green"});  
	var marker1 = new google.maps.Marker({position: groveRoad, map: map, icon: station, title:"Grove Road"});
	var marker1 = new google.maps.Marker({position: wallaseyVillage, map: map, icon: station, title:"Wallasey Village"});
	var marker1 = new google.maps.Marker({position: walton, map: map, icon: station, title:"Walton"});
	var marker1 = new google.maps.Marker({position: waterloo, map: map, icon: station, title:"Waterloo"	});
	var marker1 = new google.maps.Marker({position: westKirby, map: map, icon: station, title:"WestKirby"});  	
}