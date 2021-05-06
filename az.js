const puppeteer = require('puppeteer');
let url = 'https://www.amazon.in/';
let page;
let obj = [];
let arr = [];
let fs = require("fs");

(async function fn() {
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"] // to go full screen
    });

    let pagesArr = await browser.pages();
    page = pagesArr[0];
    await page.goto(url);

    await page.waitForSelector("#twotabsearchtextbox", { visible: true });
    console.log(1);
    await page.waitForSelector("#nav-search-submit-button", { visible: true });
    console.log(2);
    await page.type("#twotabsearchtextbox", "Smartphone under 10000", { delay: 100 });
    console.log(3);
    await page.click("#nav-search-submit-button");
    console.log(2);
    await page.waitForSelector(".a-link-normal.a-text-normal", { visible: true });
    await page.waitForSelector(".a-size-medium.a-color-base.a-text-normal", { visible: true });
    obj = await page.evaluate(function () {
        let allItems = document.querySelectorAll(".a-link-normal.a-text-normal");
        let names = [];
        let cost = [];
        let ratings = [];
        for (let i = 0; i < 10; i++) {
            if(!allItems[i]){
                continue;
            }
            let element = allItems[i].innerText;
            if(i%2 == 0){
                names.push(element);
            }else{
                cost.push(element);
            }
        }

        let allRatings = document.querySelectorAll(".a-icon-alt");
        let obj = {};

        for (let i = 0; i < 5; i++) {
            if(!allRatings[i]){
                continue;
            }
            let element = allRatings[i].innerText;
            ratings.push(element);
        }

        for (let i = 0; i < 5; i++) {
            let t = {
                product: names[i],
                price : cost[i],
                rating : ratings[i]
            }
            obj[i] = t;
        }

        return obj;
    });
   
    fs.writeFileSync("data.json",JSON.stringify(obj));
    
})();