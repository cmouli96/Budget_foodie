const puppeteer = require('puppeteer');

let browser = null;
let page = null;
const BASE_URL = 'https://zomato.com/';

const zomato = {

    initialize: async () => {
        // console.log('Starting the scraper..');

        browser = await puppeteer.launch({
            headless: false
        })
        
        page = await browser.newPage();
        page.on('console', message => {
            // console.log(`Message from puppeteer: ${message.text()}`);
        })


        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 0 });

        // console.log('Initialization completed..');
    },

    getProductDetails: async (link) => {

        // console.log(`Going to the Product Page.. ( ${link} )`);

        await page.goto(link, { waitUntil: 'networkidle2' ,timeout:0 });
      
        let details = await page.evaluate(() => {
            
            let restaurantName=document.querySelector('h1').innerText;
            let tags=document.getElementsByClassName("sc-gleUXh bWIcur","sc-cNnxps ekHnKq","sc-zDqdV kwiIvW","sc-iFUGim bfQsNp","sc-imapFV jFApCi","sc-cIsjWt etcNyM","sc-zDqdV kckyLf","sc-cNnxps ekHnKq");   
            let tag1=tags[0].innerText;
            let tag2=tag1.split("\n");
            let tag=tag2[0];
            let address=tag2[1];
            let r=document.getElementsByClassName("sc-elNKlv jlVypF","sc-fZwumE hnFLcq","sc-fZwumE hnFLcq","sc-eAyhxF jdTwqt");
            let r1=r[0].innerText;
            let r2=r1.split("\n");
            let rating=r2[0];
            let peopleRated=r2[2];

            let rates=[];
            let rate=document.getElementsByClassName('sc-17hyc2s-1 fnhnBd');
            let dishname=document.getElementsByClassName("sc-1s0saks-11 cDXzZl");
            let dishes=[];
            let n=dishname.length;
            let items=[];
            for(var i=0;i<n;i++)
            {
               let item={};
               item["itemName"]=dishname[i].innerText;
               item["description"]="---";
               let r3=rate[i].innerText.split("₹")[1];
               item["ztoPrice"]=r3;
               items.push(item);
            }

            for(var i=0;i<n;i++)
            {
                rates.push(rate[i].innerHTML);
            }
            return{
                restaurantName,
                tag,
                address,
                rating,
                peopleRated,
                items
            }


        });

        return details;
    },

    end: async () => {
        // console.log('Stopping the scraper..');
        
        await browser.close();
    }

}

module.exports = zomato;