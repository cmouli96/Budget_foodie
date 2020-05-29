const swiggy = require("./swiggy");
const zomato = require('./zomato');
const db = require("./db").db;
const Restaurant = require("./models/restaurant");
const Toppick = require("./models/toppicks");        
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request=require('request-promise');
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(express.static(path.join(__dirname, 'views/js')))
app.use(express.static(path.join(__dirname, 'views')))
app.use(bodyParser.urlencoded({extended : true}));
 
var server = app.listen(3000, function(){
    // console.log("hey its working");
});

app.get('/', (req, res)=>{
    // swiggy.end();
    res.sendFile(__dirname + "/index.html");
});

app.get('/toppick', (req, res) => {
    
    (async () => {
                    let query = req.query.location;
                    await swiggy.initialize(query);
                    var url="https://developers.zomato.com/api/v2.1/locations?query="+query+"&apikey=ccfa077c40cc8120e254980fad6adade";
                    request(url,function(error,response,body){
                            if(!error&&response.statusCode==200)
                            {
                                res.redirect('/restaurant_details?valid=' + body);
                            }
                        
                     });
    })();   
});


app.get("/restaurant_details",function(req,res){
	
	var body = req.query.valid;
	var data=JSON.parse(body);
	var entity_type=data.location_suggestions[0].entity_type;
	var entity_id=data.location_suggestions[0].entity_id;
	var url="https://developers.zomato.com/api/v2.1/location_details?entity_id="+entity_id+"&entity_type="+entity_type+"&apikey=ccfa077c40cc8120e254980fad6adade";
	request(url,function(error,response,body){
        // console.log(url);
		if(!error&&response.statusCode==200)
		{
                        var data=JSON.parse(body);
                        data2 = [];
                        for(let i=0; i<data["best_rated_restaurant"].length; i++)
                        {
                                        obj = {};
                                        obj["restaurantName"] = data["best_rated_restaurant"][i]["restaurant"]["name"];
                                        obj["tag"] = "";
                                        obj["rating"] = data["best_rated_restaurant"][i]["restaurant"]["user_rating"]["aggregate_rating"];
                                        let url1=data["best_rated_restaurant"][i]["restaurant"]["url"];
                                        let url2=url1.split("?")[0];
                                        let ord="/order";
                                        let url3=url2.concat(ord);

                                        obj["ztolink"] = url3;
                                        data2.push(obj);
                        }
                        ( async () => {
                                    // console.log(data2[0]);
                                    const data1 = await swiggy.bestseller();
                                    // console.log(data1[0]);
                                    let rest = [];
                                    for(let i=0; i<data1.length; i++)
                                    {
                                        let j = 0;
                                        let flag = 0;
                                        while(j < data2.length)
                                        {
                                                if(data1[i]["restaurantName"] == data2[j]["restaurantName"])
                                                {
                                                        obj = {};
                                                        obj["restaurantName"] = data1[i]["restaurantName"];
                                                        obj["tag"] = data1[i]["tag"];
                                                        obj["rating"] = data1[i]["rating"];
                                                        obj["sgylink"] = data1[i]["sgylink"];
                                                        obj["ztolink"] = data2[j]["ztolink"];
                                                        rest.push(obj);
                                                        data2.splice(j,1);
                                                        flag = 1;
                                                        break;
                                                }
                                                j++;
                                        }
                                        if(flag == 0)
                                        {
                                                        let ob = data1[i];
                                                        ob["ztolink"] = "";
                                                        rest.push(ob);
                                        }
                                    }
                                    for(let j=0; j<data2.length; j++)
                                    {
                                                let ob = data2[j];
                                                ob["sgylink"] = "";
                                                rest.push(ob);
                                    }
                              //      await swiggy.end();
                                    
                                    res.render('toppick', {restrant : rest});
                        })();	 
			
		}
    });
    
});

app.get("/items", function(req, res){
    let sgylink = req.query.sgylink;
    let ztolink = req.query.ztolink;
    // console.log(sgylink);
    // console.log(ztolink);
  //  res.send(sgylink+"  "+ztolink);
                if(ztolink=="")
                {
                    // console.log("Jai Balayya");
                }
                else
                {
                    (async () => {			
                        await zomato.initialize();
                        let details = await zomato.getProductDetails(ztolink);
                        Restaurant.findOne({restaurantName : details["restaurantName"]},function(err,restrnt){
                            if (restrnt == null)
                            {
                                // console.log("hey its null");
                                details["zomato"] = "yes";
                                details["zomatoLink"]=ztolink;
                                const restrnt = new Restaurant(details);
                            //    console.log(restrnt);
                                restrnt.save(function(err,doc){
                                    if(err)
                                    {
                                        // console.log(err);
                                    }
                                })
                            }
                            else
                            {
                                let temp={};
                                details["items"].forEach(element => {
                                    temp[element["itemName"]]=element["ztoPrice"];
                                            });
                                // console.log(restrnt["items"].length);
                                // console.log(typeof(restrnt["items"]))
                                restrnt["items"].forEach(item => {
                                    if(temp[item["itemName"]] != undefined)
                                    {
                                    item["ztoPrice"] = temp[item["itemName"]];
                                    }
                                });
                                restrnt["zomato"] = "yes"; 
                                restrnt["zomatoLink"]=ztolink;
                                restrnt.save();
                            }
                            
                      //      console.log(restrnt);
                            res.render("items",{restaurant : restrnt});

                        })
                        await zomato.end();
                        })();
                }

                if(sgylink=="")
                {

                }
                        // console.log("Error!!");
                else
                {
                    (async ()=>{
                     //   await swiggy.initialize();
                        let data = await swiggy.retrieve(sgylink);
                        Restaurant.findOne({restaurantName : data["restaurantName"]},function(err,restrnt){
                        if (restrnt == null)
                        {
                            console.log("hey its null");
                            data["swiggy"] = "yes";
                            data["swiggyLink"]=sgylink;
                            const restrnt = new Restaurant(data);
                       //     console.log(restrnt);
                            restrnt.save(function(err,doc){
                                if(err)
                                {
                                    //  console.log(err);
                                }
                                
                            })
                        }
                        else
                        {
                            let temp = {};
                            data["items"].forEach(obj => {
                                temp[obj["itemName"]] = obj["sgyPrice"];
                            });
                            //console.log(temp);
                            // console.log(restrnt["items"].length);
                            // console.log(typeof(restrnt["items"]))
                            restrnt["items"].forEach(item => {
                                if(temp[item["itemName"]] != undefined)
                                {
                                   //console.log(item);
                                   item["sgyPrice"] = temp[item["itemName"]];
                                }
                            });
                            restrnt["swiggy"] = "yes"; 
                            restrnt["swiggyLink"]=sgylink;
                            //restrnt["items"] = data["items"]; 
                            restrnt.save();
                        }
                        
                        // console.log(restrnt);
                       // restrnt["swiggyLink"]=sgylink;
                        res.render("items",{restaurant : restrnt});
                        })           
                       // console.log(data);
                      //  await swiggy.end();
                    })(); 
                }
    
});


module.exports = server;