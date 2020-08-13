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

