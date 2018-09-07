exports.fillCol = function(col, length){
  if(col.length >= length) return col;
  else{
    for(var i=0; i<(length-col.length); i++){
      col.push(null);
    }
    return col;
  }
}
