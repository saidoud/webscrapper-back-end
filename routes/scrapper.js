var express = require('express');
var router = express.Router();

// scrapper dependecies
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// constant
const url = 'https://www.mediamarkt.es';
const numCategory = 3;
const categoryUrl = "/es/category/portátiles-de-menos-de-14-155.html";



/* GET Category. */
router.get('/', function (req, res, next) {
    puppeteer.launch({ headless: false }).then(async browser => {
        console.log('Running tests..')
        const page = await browser.newPage()
        await page.goto(url, { waitUntil: "networkidle2" })

        // Accept Cookie
        await page.click("#pwa-consent-layer-accept-all-button");
        await page.waitForTimeout(1000)

        // Click Category
        await page.click("#mms-app-header-category-button");
        await page.waitForTimeout(2335)

        // Hover Category
        await page.hover('a[aria-label="Informática"]')

        const category = await page.evaluate(() => {
            var res = [];
            const name = Array.from(document.querySelectorAll('[data-keyboard-id="desktop-flyout"] ul[aria-label="Portátiles"] li a span'));
            const links = Array.from(document.querySelectorAll('[data-keyboard-id="desktop-flyout"] ul[aria-label="Portátiles"] li a'));

            const nameArr = name.map(name => name.textContent);
            const linksArr = links.map(links => links.getAttribute('href'));

            for (let i = 0; i < 3; i++) {
                let data = Object.assign({ id: i, name: nameArr[i], link: linksArr[i] });
                res.push(data);
            }
            return res;
        })

        console.log(category)

        await browser.close()
    }).catch(() => {
        console.log("Somthing Wrong")
    })

    res.send('Get Category');

});

/* GET Product. */
router.get('/product', function (req, res, next) {
    puppeteer.launch({ headless: false }).then(async browser => {
        console.log('Running tests..')
        const page = await browser.newPage()
        await page.goto(url + categoryUrl, { waitUntil: "networkidle2" })

        // Accept Cookie
        await page.click("#pwa-consent-layer-accept-all-button");
        await page.waitForTimeout(1000);

        const products = await page.evaluate(() => {
            var res = [];
            const name = Array.from(document.querySelectorAll('[data-test="mms-search-srp-productlist-item"] [data-test="product-title"]'));
            const url = Array.from(document.querySelectorAll('[data-test="mms-search-srp-productlist-item"] > a'))
            const price = Array.from(document.querySelectorAll('[data-test="mms-search-srp-productlist-item"] [data-test="product-price"] [data-test="mms-unbranded-price"] .StyledStrikePriceWrapper-jah2p3-5'));
            const brand = "brand product";
            const rating = Array.from(document.querySelectorAll('[data-test="mms-search-srp-productlist-item"] [aria-label="productRow.ratingLabel"]'));
            const availibility = "InStock";
            const delivery = "24h";
            const specificatins = "";

            const nameArr = name.map(item => item.textContent);
            const urlArr = url.map(item => item.getAttribute('href'));
            //const priceArr = url.map((item) => item.textContent);
            // const ratingArr = rating.map(item => parseInt(item.textContent.charAt(1)));
            const ratingArr = rating.map(item => item.textContent);
            return ratingArr;

        })

        console.log(products)

        // await browser.close()
    }).catch(() => {
        console.log("Somthing Wrong")
    })

    res.send('Get Product');
})


module.exports = router;