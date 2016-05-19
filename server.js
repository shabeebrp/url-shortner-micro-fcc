var express = require('express');
var app = express();
var path = require('path');
var validUrl = require('valid-url');
var mongo = require('mongodb').MongoClient;
var db = null;
mongo.connect(process.env.MONGOLAB_URI,function(err,dbi){
    if(err) throw err;
    console.log('connected to mongodb');
    db = dbi;
});
function verify(req,res,next){
    var url = req.url.substring(5);
    if(!validUrl.isUri(url))
        res.send({"error":"Wrong url format."});
    else
        next();
}
function insert(req,res,next){
    var collection = db.collection('url');
    var object = {};
    object['_id'] = Math.floor(Math.random()*1000);
    object['original_url'] = req.url.substring(5);
    object['short_url'] = req.protocol+'://'+req.get('host')+'/'+object['_id'];
    collection.insert(object,function(err){
        if(err){
            if(err.code && err.code == 11000)
                insert(req,res,next);
            else
                throw err;
        }else{
            res.send({original_url:object['original_url'] ,short_url:object['short_url']});
        }
    });  
}
function retrive(req,res,next){
    var collection = db.collection('url');
    console.log('identified');
    collection.find({_id:+(req.params.short)}).toArray(function(err,data){
        if (err) throw err;
        if(data.length == 0){
            res.send({error:'Given url not in databse'});
        }
        else{
            console.log('data found');
            res.redirect(data[0].original_url);
            
        }
    });
}
app.use(express.static(path.join(__dirname,'public')));
app.get(/^\/new/,verify,insert);
app.get('/:short',retrive);
app.listen(process.env.PORT || 3000, function(){
  console.log("Chat server listening at "+(process.env.PORT||3000));
});
