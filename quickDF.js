var import_csv = require("./importCSV");
var utils = require("./utils");
var dt = require("./dtypes");
console.log(dt);

// functions done :
// length,
// setDTypes,
// shape,
// getLine,
// map,
// filter,
// addCol,
// drop,
// select,
// head


// functions todo :
// this.load
// this.groupby
// this.setLine
// this.sort_values
// this.toString or this.show
// this.to_html
// this.to_markdown

Array.prototype.dtype = "";
Array.prototype.setDType = function(typeStr){
  console.log(typeStr)
  return this.map(dt[typeStr].parse);
}

var DataFrame = function(dict = {}, orient="columns", cols = null, dtypes = null){
  this.columns = [];

  var maxLength = 0;
  switch(orient){
    case "columns" :
    for(i in dict) maxLength = Math.max(maxLength, dict[i].length);
    for(i in dict){
      if(dict[i] instanceof Array && (cols == null || cols.indexOf(i) != -1)){
        this[i] = utils.fillCol(dict[i], maxLength);
        this.columns.push(i);
        }
    }
    break;
    case "records" :
    for(i in dict){
      for(col in dict[i]){
        if(cols == null || cols.indexOf(col) != -1){
          if(this[col] === undefined){this[col] = []; this.columns.push(col);}
          this[col].push(dict[i][col]);
        }
      }
    }
    break;
  }
  if(cols != null && dtypes != null){
    if(cols.length != dtypes.length) throw new Error("dtypes and cols are not the same length");
    for(i in cols){
      this[cols[i]].dtype = dt[dtypes[i]];
    }
  }

}

DataFrame.prototype.to_html = function(){
  var table = "<table><thead><th>" + this.columns.join("</th><th>") + "</th></thead><tbody>";
  var footers = "</tbody></table>";
  for(var i=0; i<this.length(); i++){
    console.log("thissss");
    var str = "<tr>";
    for(var j=0; j<this.columns.length; j++){
      if(this.columns[i].hasOwnProperty()){
        var col = this.columns[j];
        str+= "<td>"+this[col][i]+"</td>";
      }
    }
    str+="</tr>";
    table+=str;
  }
  table+=footers;
  return table;
}

/* @return : length of dataframe */
DataFrame.prototype.length = function(){
  for(i in this){
    if(this[i].hasOwnProperty()) return this[i].length;
  }
}

DataFrame.prototype.setDTypes = function(cols = [], dtypes = []){
  if(cols.length != dtypes.length) throw new Error("dtypes and cols are not the same length");
  for(var i=0; i<cols.length; i++){
    var col = cols[i];
    this[col] = this[col].setDType(dtypes[i]);
  }
  return this;
}

/* @return : shape of dataframe */
DataFrame.prototype.shape = function(){
  var cols = this.columns.length
  var rows = this.length();
  return [cols, rows];
}

/* @param numLine : index of the line
   @param type : type of the returned object ("json", "array")
   @return : line at the index numLine
*/
DataFrame.prototype.getLine = function(numLine, type="json"){

  switch(type){
    case "json" :
      var line = {};
      for(i in this.columns){
        var col = this.columns[i]
        line[i] = this[col][numLine];
      }
      break;
    case "array" :
      var line = [];
      for(i in this.columns){
        var col = this.columns[i]
        line.push(this[col][numLine]);
      }
      break;
  }
  return line;
}

/*
Applies the function func to the to every line of the dataframe
  @param func : function that you apply to the dataframe
  @return : new Dataframe where the function got applied
*/
DataFrame.prototype.map = function(func){
  var new_df = [];
  var len = this.length();
  for(var i=0; i<len; i++){
    new_df.push(func(this.getLine(i)));
  }
  return new DataFrame(new_df, orient="records");
}

/*
  @param func : function that return a boolean for each line of the dataframe (ex: x => x.colName == "coucou")
  @return : a new dataframe that satisfy the condition in func
*/
DataFrame.prototype.filter = function(func){
  var new_df = [];
  var len = this.length();
  for(var i=0; i<len; i++){
    var line = this.getLine(i);
    if(func(line)) new_df.push(line);
  }
  return new DataFrame(new_df, orient="records");
}

/*
  @param nameCol : name of the column
  @param col : data in the column
  @return : a new dataframe with the new column
*/
DataFrame.prototype.addCol = function(nameCol, col = []){
  this.columns.push(nameCol);
  this[nameCol] = utils.fillCol(col, this.length());
  return this;
}

DataFrame.prototype.drop = function(nameCol){
  delete this[nameCol];
  return this;
}

/*
  @param cols : array of column names
  @return : new dataframe with only those columns
*/
DataFrame.prototype.select = function(cols){
  var new_df = new DataFrame();
  for(i in cols) new_df.addCol(i, this[i]);
  return new_df;
}

/*
  @param numLine : number of lines you want to get
  @return : new dataframe with the first numLines lines
*/

DataFrame.prototype.head = function(numLines = 5){
  var dict = {};
  for(i in this.columns){
    var col = this.columns[i];
    dict[col] = this[col].slice(0, numLines)
  }
  return new DataFrame(dict);
}

/*
  @param : filename : name of the file that you want the data from
  @param callback : the function that treats the data
*/
var importCSV = function(filename, callback){
  import_csv(filename, function(data){
    callback(new DataFrame(data));
  });
}

exports.DataFrame = DataFrame;
exports.importCSV = importCSV;
