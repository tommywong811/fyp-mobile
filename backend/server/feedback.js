var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/fyp";
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
        extended: true
}));

app.post('/feedback', function(req, res) {
        if(req.body.feedback){
                MongoClient.connect(url, function(err, db){
                        if(err) throw err;
                        db.collection("feedback").insert({
                                data: req.body.feedback
                        });
                        db.close();

                })
                console.log("post request received, data: "+req.body.feedback)
                res.send("true");
        } else {
                console.log("post request received with no data")
                res.send("false");
        }
});

app.listen(8080, function() {
        console.log("listening on port 8080");
})
