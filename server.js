var express = require("express");
var expressHandlebars = require("express-handlebars");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var logger = require("morgan");
var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger('dev'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static("public"));

app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", function(req, res) {
    // res.send('Main page');
     db.Equipment.find({})
     .then(function(dbEquipment) {
         res.render("home", {
             equipment: dbEquipment
         })
     })
})

//need mongoose connect line
mongoose.connect("mongodb://localhost/newTest", {useNewUrlParser: true});

app.get("/scrape", function(req, res) {

    axios.get('http://www.biosurplus.com/categories/3-used-centrifuges/').then(function(response) {

        var $ = cheerio.load(response.data);

        $("a.woocommerce-LoopProduct-link").each(function(i, element) {
            console.log("element", element);
            var link = element.attribs.href;
            console.log("Link", link)
            var values = $(element).children('p');
            console.log("Values");
            console.log(values.length);
            // for(var i = 0; i < values.length; i++) {
            //     // console.log(values[i]);
            //     console.log(values[i].children[0].data);
            // }
            db.Equipment.create({
                name: values[0].children[0].data, 
                id: values[1].children[0].data, 
                price: values[2].children[0].data, 
                link: link
            })
            .then(function(newEquipment) {
                console.log(newEquipment);
            })
            .catch(function(err) {
                console.log(err)
            });
        });

        res.send("Scrape Complete");

    });

});

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
