var express = require('express');
var router = express.Router();

// scrapper dependecies
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// url page
const url = 'https://www.mediamarkt.es';


/* GET Scrapper page. */
router.get('/', function (req, res, next) {
    puppeteer.launch({ headless: false }).then(async browser => {
        console.log('Running tests..')
        const page = await browser.newPage()
        await page.goto(url, { waitUntil: "networkidle2" })

        // Accept Cookie
        await page.click("#pwa-consent-layer-accept-all-button");
        await page.waitForTimeout(3000)

        // Click Category
        await page.click("#mms-app-header-category-button");
        await page.waitForTimeout(4335)

        // Hover Category
        await page.hover('a[aria-label="Informática"]')

        // await browser.close()
    }).catch(() => {
        console.log("Somthing Wrong")
    })

    res.send('respond with a resource');

});


module.exports = router;