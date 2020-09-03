var ss = SpreadsheetApp.getActiveSpreadsheet()

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

function tmp(){
  mapQuery3("Tokyo", "Kyoto", "drive", "distance");
}

//cache version but does not works as a custom function from a Spreadsheet.
function mapQuery3(src, dest, type, result){
  var cache = ss.getSheetByName("MapQueryCache");
  
  var keys = cache.getRange(2, 1, cache.getLastRow()-1, 1).getValues().flat(); //src, dest, type, result
  var values = cache.getRange(2, 2, cache.getLastRow()-1, 1).getValues().flat(); //values
  
  var key = [src,dest,type, result].join(';');
  Logger.log(key);
  
  var ix = keys.indexOf(key);
  
  Logger.log(keys);
  Logger.log(values);
  Logger.log(ix);
  
  if (ix>=0){//found
    var value = values[ix];
  } else {
    var value = mapQuery2(src, dest, type, result);
    
    //ADD new cache
    var cells = cache.getRange(cache.getLastRow()+1, 1, 1, 2); //key, value cell to add
    cells.setValues([[key,value]]);
  }
  
  return value;

}
