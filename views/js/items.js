var Addbuttons=document.querySelectorAll("button.Add");
var Removebuttons=document.querySelectorAll("button.Remove");
var zPrices=document.querySelectorAll(".ztoPrice");
var sPrices=document.querySelectorAll(".sgyPrice");

var order=document.querySelector("button.Order");
var click=document.querySelector("button.click");
// console.log(order);
var zLink=document.querySelector(".ztoLink").innerText;
var sLink=document.querySelector(".sgyLink").innerText;

    // var n=buttons.length;

    // console.log(n);
var zPrice=0;
var sPrice=0;



Addbuttons.forEach(function(button,index){
    button.addEventListener('click',function(){
        //console.log(zPrices[index].innerText);
        zPrice=zPrice+Number(zPrices[index].innerText);
        sPrice=sPrice+Number(sPrices[index].innerText);
        // console.log(zPrice);
        // console.log(sPrice);

    })
})

Removebuttons.forEach(function(button,index){
    button.addEventListener('click',function(){
        //console.log(zPrices[index].innerText);
        zPrice=zPrice-Number(zPrices[index].innerText);
        sPrice=sPrice-Number(sPrices[index].innerText);
        // console.log(zPrice);
        // console.log(sPrice);

    })
})

click.addEventListener('click',function(){
    if(zPrice!=0)
        {
            if(zPrice<sPrice)
            {
                // console.log("Zomato is cheap "+zPrice);
                // console.log(zLink);
                window.location.assign(zLink);
            }
               
            if(sPrice==0)
            {
                // console.log("Zomato is cheap "+zPrice);
                // console.log(zLink);
                window.location.assign(zLink);
                
            }
              
        }
    if(sPrice!=0)
    {
        if(sPrice<zPrice)
        {
            // console.log("Swiggy is Cheap "+sPrice);
            // console.log(sLink);
            window.location.assign(sLink);
        }
           
        if(zPrice==0)
        {
            // console.log("Swiggy is Cheap "+sPrice);
            // console.log(sLink);
            window.location.assign(sLink);
        }
             

    }
})


// order.addEventListener('click',function(){
//     console.log("Hi");
// })
