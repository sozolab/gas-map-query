//GAS version (limit is very low as 200).
function mapQuery(src, dest, type, result) {

  var finder = Maps.newDirectionFinder()
  .setOrigin(src)
  .setDestination(dest)
  .setLanguage("ja")

  if (type=="highway"){
    finder = finder
    .setMode(Maps.DirectionFinder.Mode.DRIVING);
    
  } else if (type=="toll"){
    finder = finder
    .setMode(Maps.DirectionFinder.Mode.DRIVING)
    .setAvoid(Maps.DirectionFinder.Avoid.HIGHWAYS);

  } else if (type=="drive"){
    finder = finder
    .setMode(Maps.DirectionFinder.Mode.DRIVING)
    .setAvoid(Maps.DirectionFinder.Avoid.TOLLS);

  } else if (type=="transit"){
    finder = finder
    .setMode(Maps.DirectionFinder.Mode.TRANSIT);

  } else if (type=="bicycle"){
    finder = finder
    .setMode(Maps.DirectionFinder.Mode.BICYCLING);

  } else if (type=="walk"){
    finder = finder
    .setMode(Maps.DirectionFinder.Mode.WALKING);
    
  }
  var route = finder.getDirections().routes[0];
  
  var value = route.legs[0];
  if (result=="distance"){ 
    value = value.distance.value/1000; //kilometer
  } else if (result=="duration"){
    value = value.duration.value/60; //minutes
  }

  return value;
}

function tmp(){
  mapQuery2("Kokura", "Tobata", "drive", "distance");
  mapQuery2("Kokura", "Tobata", "drive", "duration");
  mapQuery2("Kokura", "Tobata", "walk", "duration");
  mapQuery2("Tokyo", "Kyoto", "transit", "distance");
}

//API call version 
function mapQuery2(src, dest, type, result){
  var url = 'https://maps.googleapis.com/maps/api/directions/json?';

  var prop = PropertiesService.getScriptProperties();
  var key = prop.getProperty("ApiKey");
  
  var mode = "drive";
  var avoid="";
  
  if (type=="highway"){
  } else if (type=="toll"){
    avoid="highways";
  } else if (type=="drive"){
    avoid="tolls";
  } else if (type=="transit"){ //TODO: does not work?
    mode="transit"; 
  } else if (type=="bicycle"){  //TODO: not checked?
    mode="bicycling";
  } else if (type=="walk"){
    mode="walking";
  }
  
  
  //  Logger.log(key);
  var params ={method : 'get'};

  // fetch
  var str = url + "origin="+ src + "&destination="+dest + "&mode="+mode + "&avoid="+avoid+"&key="+key;
  Logger.log(str);
  var res = UrlFetchApp.fetch(str);
  var json = JSON.parse(res.getContentText());
 
  
  var value = json.routes[0].legs[0];
  if (result=="duration"){
    value = value.duration.value/60; //minutes
  } else {//"distance"
    value = value.distance.value/1000; //kilometer
  }

  
  Logger.log(value);

  return value;

//  return elem;
}

