var express = require('express');
var router = express.Router();

// scrapper dependecies
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())


/* GET Scrapper page. */
router.get('/', function (req, res, next) {
    puppeteer.launch({ headless: false }).then(async browser => {
        console.log('Running tests..')
        const page = await browser.newPage()
        await page.goto('https://www.mediamarkt.es', { waitUntil: "networkidle2" })

        // Accept Cookie
        await page.click("#pwa-consent-layer-accept-all-button");
        await page.waitForTimeout(3000)

        // Click Category
        await page.click("#mms-app-header-category-button");
        await page.waitForTimeout(4335)
        // await browser.close()
    }).catch(() => {
        console.log("Error")
    })

    res.send('respond with a resource');

});


module.exports = router;