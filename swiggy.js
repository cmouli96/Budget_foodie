const puppeteer = require('puppeteer');
let page = null;
let browser = null;
const restrntInfo = {

    initialize : async function(location)
                {

                                let url = "https://www.swiggy.com";
                                browser = await puppeteer.launch({headless : false});
                                page = await browser.newPage();
                                //page.setDefaultNavigationTimeout(0); 
                                await page.goto(url, { waitUntil: "networkidle2" });
                                await page.type('#location', location);

                                const [response] = await Promise.all([
                                    page.waitForNavigation(),
                                    setTimeout(function(){page.click("._3lmRa")}, 9000)
                                ]); 

                                // console.log("new page url", page.url());
                
                },
     
    getUrls  : async function()  
                {             
                                const x =    await page.evaluate(async () => {
                                const restrntUrls = [];
                                const promise =   await new Promise((resolve, reject) => {
                                        var totalHeight = 0;
                                        var distance = 100;
                                        var timer = setInterval(() => {
                                            var scrollHeight = document.body.scrollHeight;
                                            window.scrollBy(0, distance);
                                            totalHeight += distance;
                            
                                            if(totalHeight >= scrollHeight){
                                                clearInterval(timer);
                                                resolve();
                                            }
                                        }, 200);
                                    })
                                    
                                 
                                    const anchorTags = document.querySelector("div._2GhU5").querySelectorAll("a"); 
                                    const len = anchorTags.length;
                                    // console.log("swiggy page" + len);
                                    for(let i=0; i<len; i++)
                                    { 
                                        restrntUrls.push(anchorTags[i].href); 
                                    }
                                  
                                    return restrntUrls;
                                       
                                });      
                                       
                            return x;                                                    
                },
    getTop   : async function()
               {
                                    let url = "https://www.swiggy.com/restaurants";
                                    await page.goto(url, { waitUntil: "networkidle2" });
                                    let data = await page.evaluate(()=>{
                                        let x = document.querySelector("div._1Z9MR");
                                        if(x == null)
                                        {
                                            return null;
                                        }
                                        x = document.querySelector("div._1Z9MR").querySelectorAll("div._3XX_A");
                                        data = [];
                                        for(let i=0; i<x.length; i++)
                                        {
                                            obj = {};
                                            obj[name] = x[0].querySelector("div.nA6kb").innerText;
                                            obj[tag] = x[0].querySelector("div._1gURR").innerText;
                                            obj[rating] = x[0].querySelector("div._9uwBC.wY0my").innerText;
                                            obj[url] = x[0].querySelector("a").href;
                                            data.push(obj);
                                        }
                                        return data;
                                    });

               },
    bestseller : async function()
                {
                                    let url = "https://www.swiggy.com/collections/46726?type=rcv2";
                                    await page.goto(url, { waitUntil: "networkidle2" });
                                    let data1 = await page.evaluate(async ()=>{

                                                    const promise =   await new Promise((resolve, reject) => {
                                                        var totalHeight = 0;
                                                        var distance = 100;
                                                        var timer = setInterval(() => {
                                                            var scrollHeight = document.body.scrollHeight;
                                                            window.scrollBy(0, distance);
                                                            totalHeight += distance;
                                            
                                                            if(totalHeight >= scrollHeight){
                                                                clearInterval(timer);
                                                                resolve();
                                                            }
                                                        }, 200);
                                                    });
                                                
                                                let x = document.querySelector("div._2QhOV");
                                                if(x == null)
                                                    return null;
                                                let y = x.querySelectorAll("div._3XX_A");
                                                let data = [];
                                                for(let i=0; i < y.length; i++)
                                                {
                                                    let obj = {};
                                                    let test = y[i].querySelector("div.nA6kb");
                                                    if(test ==  null)
                                                        continue;
                                                    obj["restaurantName"] = y[i].querySelector("div.nA6kb").innerText;
                                                    obj["tag"]=y[i].querySelector("div._1gURR").innerText;
                                                    obj["rating"] = y[i].querySelector("div._9uwBC").innerText;
                                                    obj["sgylink"] = y[i].querySelector("a").href;
                                                    data.push(obj);
                                                }
                                                return data;
                                    });
                                    return data1; 
                },
    retrieve :   async function(link)
                {
                    await page.goto(link, {waitUntil : "networkidle2" })
                            .catch("invalid url");
                    // console.log("new page url", page.url());
        
                    let data = await page.evaluate(() => {
                            let restaurantNameTag = document.querySelector("h1._3aqeL");
                            if(restaurantNameTag == null)
                            {
                                return null;
                            }
                            let restaurantName = document.querySelector("h1._3aqeL").innerText;
                            let tag = document.querySelector("div._3Plw0.JMACF").innerText;
                            let address = document.querySelector("div.Gf2NS._2Y6HW").innerText;
                            let rating = document.querySelector("div._2l3H5 > span").innerText;
                            let peopleRated = document.querySelector("span._1iYuU").innerText;
                    
                            return {
                                restaurantName, 
                                tag,
                                address, 
                                rating,
                                peopleRated
                            }
                     });
                    //console.log(data);
                    if(data == null)
                    {
                        return null;
                    }
                    data["weblink"] = link;
                    data["items"] = "";
                    
                    const data2 = await page.evaluate(
                        function()
                        {
                                            let x = document.querySelector("div._1J_la").innerText
                                            let arr = x.split("\n")
                                            let arr1 = []
                                            let len = arr.length - 1
                                            init = 0
                                            if(arr[0] == "Recommended" || arr[1] == "Recommended")
                                            {
                                                for(let i=3; i < len; i++)
                                                {
                                                    if(arr[i].includes("ITEM"))
                                                    {
                                                        init = i;
                                                        break;
                                                    }
                                                }
                                            }
                                            for(let i=init; i <= len; i++)
                                            {
                                                if(arr[i] == "BESTSELLER"  || arr[i].includes("ITEM") || arr[i].includes("Out of") || arr[i] == "ADD" || arr[i] == "+" || arr[i] == "Customisable" || arr[i].includes("available") )
                                                {
                                
                                                    continue;
                                                }
                                                if( (i < len && arr[i+1].includes("ITEM")) || (i <= len-2 && isNaN(Number(arr[i])) && arr[i+2].includes("ITEM")) || arr[i].includes("MUST TRY")) 
                                                {
                                                        continue;
                                                }
                                                arr1.push(arr[i])
                                            }
                                        
                                            let j = 0
                                            let leng = arr1.length - 1
                                            let items = []
                                            while( j <= leng )
                                            {
                                                let item = {}
                                                item["itemName"] = arr1[j++];
                                                if(isNaN(Number(arr1[j])))
                                                    item["description"] =  arr1[j++];
                                                else
                                                    item["description"] = "---";
                                                if(!isNaN(Number(arr1[j])))
                                                {
                                                        price = arr1[j++];
                                                        if(price > 100000)
                                                        { 
                                                            price = price % 1000;
                                                        }
                                                        else if(price > 1000)
                                                        {
                                                            price = price % 100;
                                                        }
                                                        item["sgyPrice"] = price;
                                                }
                                                else
                                                {
                                                        // console.error("price found as text");
                                                }
                                                items.push(item);
                                            }
                                            return items;
                    }
                    );
                    data["items"] = data2;
                    return data;

                },
    selectItems : async function()
                {
                    url = "https://www.swiggy.com/restaurants/dominos-pizza-richmond-town-central-bangalore-bangalore-23846";
                    itemname = "Margherita\n";

                },

    end : async function ()
          {
                await browser.close()
          }   

}

module.exports = restrntInfo;


