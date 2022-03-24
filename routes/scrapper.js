var express = require('express');
var router = express.Router();

// scrapper dependecies
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// url page
const url = 'https://www.mediamarkt.es';


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
        // let data = await page.evaluate(() => {
        //     return document.querySelectorAll('[data-keyboard-id="desktop-flyout"] ul[aria-label="Portátiles"]')
        // })


        const category = await page.evaluate(() => {
            var res = [];
            const name = Array.from(document.querySelectorAll('[data-keyboard-id="desktop-flyout"] ul[aria-label="Portátiles"] li a span'));
            const links = Array.from(document.querySelectorAll('[data-keyboard-id="desktop-flyout"] ul[aria-label="Portátiles"] li a'))
            const nameArr = name.map(name => name.textContent);
            const linksArr = links.map(links => links.getAttribute('href'))


            return linksArr[0];

        })

        console.log(category)

        // await browser.close()
    }).catch(() => {
        console.log("Somthing Wrong")
    })

    res.send('respond with a resource');

});

/* GET Product. */
router.get('/product', function (req, res, next) {
    // code
})


module.exports = router;