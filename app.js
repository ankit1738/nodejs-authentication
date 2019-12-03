const app = require('express')(),
bodyParser = require('body-parser'),
indexRoute = require('./routes/index.js'),
mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/authentication", {useNewUrlParser: true}, (err) => {
    if(err) console.log(err)
    else console.log("Database Connected Succesfully");
});

mongoose.Promise = global.Promise;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(indexRoute);

app.listen(3000, () => { 
    console.log("Server running on port 3000");
})