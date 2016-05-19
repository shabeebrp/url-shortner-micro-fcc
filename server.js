var express = require('express');
var app = express();
var path = require('path')
var mongo = require('mongodb').MongoClient;
mongo.connect(process.env.MONGOLAB_URI,function(err,db){
    if(err) throw err;
    console.log('connected to mongodb');
})
app.use(express.static(path.join(__dirname,'public')));
app.get('/',function(req,res){
   res.end('Hello World');
})
app.listen(process.env.PORT || 3000, function(){
  console.log("Chat server listening at "+(process.env.PORT||3000));
});
