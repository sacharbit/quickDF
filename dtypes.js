/*
int, float, string, char, boolean, date,
*/

exports.int = {
  checkType : function(value){
    return (typeof value == "number") && (parseInt(value) == value);
  },
  parse : function(strValue){
    return parseInt(strValue);
  }
}

exports.float = {
  checkType : function(value){
    return (typeof value == "number");
  },
  parse : function(strValue){
    return parseFloat(strValue);
  }
}

exports.string = {
  checkType : function(value){
    return (typeof value == "string");
  },
  parse : function(strValue){
    return strValue;
  }
}

exports.char = {
  checkType : function(value){
    return (typeof value == "string") && value.length == 1;
  },
  parse : function(strValue){
    return strValue[0];
  }
}

exports.boolean = {
  checkType : function(value){
    console.log(typeof value);
    return (typeof value == "boolean");
  },
  parse : function(strValue){
    if(strValue == "true") return true;
    else if(strValue == "false") return false;
    else return null;
  }
}

exports.datetime = {
  checkType : function(value){
    return value instanceof Date;
  },
  parse : function(strValue){
    return Date.parse(strValue);
  }
}
