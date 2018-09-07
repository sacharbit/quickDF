var fs = require('fs');
var csv = require('fast-csv');

module.exports = function(pathFile, callback){
 var stream = fs.createReadStream(pathFile);
 var df = [];
 var csvStream = csv
   .parse({headers : true})
   .on("data", function(data){
     df.push(data);
   })
   .on("end", function(){
     console.log("END")
     callback(df);
   });

stream.pipe(csvStream);
}
