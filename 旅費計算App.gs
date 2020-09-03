//application specific codes.

var ss = SpreadsheetApp.getActiveSpreadsheet()
var sheet = ss.getActiveSheet();

/**
* セルが編集されたとき
*/
function onUpdate(e){
  var y = e.range.getRow();
  var x = e.range.getColumn();
  var cell = e.range;
  
  var name = sheet.getName();

  if (name=="旅費計算"){  
    if (y=1){ //1行目が変更されていたら
      calcMapQueries();
    }
    
  } 
}

function calcMapQueries(){
  var noteCell = sheet.getRange(1,7, 1,1);
//  noteCell.setValue("計算中:");
  
  try{

  var addresses = sheet.getRange(4,6,sheet.getLastRow()-3, 2).getValues(); //TODO : relative cells
  var resultCells = sheet.getRange(4, 10, sheet.getLastRow()-3, 2); //TODO: relative cells;
  
  
  var results = [];
  
  var prev="";
  for (var i=0; i<addresses.length; i++){
      noteCell.setValue("計算中:"+i);

    var [home, target] = addresses[i];

    var dist1, dist2;    
    if (home!=""){
      dist1 = mapQuery3(home, target, "drive", "distance");
      dist2 = (prev!="") ? mapQuery3(prev, target, "drive", "distance") : 0;
    } else {
      dist1 = null; dist2 = null;
    }
       //=if(A4<>"",mapQuery2(F4,G4,"drive","distance"),"")
       //=if(A4<>"",mapQuery2(G3,G4,"drive","distance"),"")
    results.push([dist1, dist2]);
    prev = target;
  }
  
  Logger.log(results);
  resultCells.setValues(results);
  noteCell.clearContent();
  } catch (e) {
    Logger.log(e);
    noteCell.setValue("エラー");
  }
 
}


function tmp(){
  mapQuery3("Tokyo", "Kyoto", "drive", "distance");
}

//cache version but does not works as a custom function from a Spreadsheet.
function mapQuery3(src, dest, type, result){
  var cache = ss.getSheetByName("MapQueryCache");
  
  var keys = cache.getRange(1, 1, cache.getLastRow(), 1).getValues().flat(); //src, dest, type, result
  var values = cache.getRange(1, 2, cache.getLastRow(), 1).getValues().flat(); //values
  
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

/** 
* Debug用。ダイアログを表示。
**/
function msg(value){
  Browser.msgBox(value);
}
