var fs = require('fs');
var csv = require('fast-csv');

module.exports = function(pathFile, callback){
 var stream = fs.createReadStream(pathFile);
 var dict_df = {};
 var cols = []
 var firstLine = true;
 var csvStream = csv
   .parse({headers : true})
   .on("data", function(data){
     if(firstLine){
       cols = Object.keys(data);
       for(i in cols) dict_df[cols[i]] = [];
       firstLine = false;
     }
     for(i in data){
       dict_df[i].push(data[i]);
     }
   })
   .on("end", function(){
     console.log("END")
     callback(dict_df);
   });

stream.pipe(csvStream);
}
