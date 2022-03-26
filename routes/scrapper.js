var express = require('express');
var router = express.Router();

// scrapper dependecies
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// constant
const url = 'https://www.mediamarkt.es';
const numCategory = 3;
const categoryUrl = "/es/category/convertibles-2-en-1-160.html";



/* GET Category. */
router.get('/category', function (req, res, next) {
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
            var result = [];
            const name = Array.from(document.querySelectorAll('[data-keyboard-id="desktop-flyout"] ul[aria-label="Portátiles"] li a span'));
            const links = Array.from(document.querySelectorAll('[data-keyboard-id="desktop-flyout"] ul[aria-label="Portátiles"] li a'));

            const nameArr = name.map(name => name.textContent);
            const linksArr = links.map(links => links.getAttribute('href'));

            for (let i = 0; i < 3; i++) {
                let data = Object.assign({ id: i, name: nameArr[i], url: linksArr[i] });
                result.push(data);
            }
            return result;
        })

        console.log(category)
        res.json({
            confirmation: 'success',
            data: category
        })

        await browser.close()
    }).catch((err) => {
        res.json({
            confirmation: 'Faild !',
            message: err.message
        })
    })
});

/* GET Product. */
router.post('/product', function (req, res, next) {
    const categoryUrl = req.body.category_url;

    puppeteer.launch({ headless: false }).then(async browser => {
        console.log('Running tests..')
        const page = await browser.newPage()
        await page.goto(url + categoryUrl, { waitUntil: "networkidle2" })

        // Accept Cookie
        await page.click("#pwa-consent-layer-accept-all-button");
        //  await page.waitForTimeout(1000);
        // scroll down for load image source
        await autoScroll(page);
        // get product info
        const products = await page.evaluate(() => {
            var result = [];

            const name = Array.from(document.querySelectorAll('[data-test="mms-search-srp-productlist-item"] [data-test="product-title"]'));
            const url = Array.from(document.querySelectorAll('[data-test="mms-search-srp-productlist-item"] > a'))
            const ratingNumber = Array.from(document.querySelectorAll('[data-test="mms-search-srp-productlist-item"] [aria-label="productRow.ratingLabel"]'));
            const image = Array.from(document.querySelectorAll('[data-test="product-image"] picture img'));
            const price = Array.from(document.querySelectorAll('[data-test="mms-search-srp-productlist-item"] [data-test="product-price"] > div > div > div'));
            const rating = Array.from(document.querySelectorAll('[data-test="mms-search-srp-productlist-item"] [data-test="mms-customer-rating"]'));
            const delivery = "24h";
            const brand = "brand product";
            const availibility = "InStock";
            const specificatins = "";

            const nameArr = name.map(item => item.textContent); //ok
            const urlArr = url.map(item => item.getAttribute('href')); //ok
            const ratingNumberArr = ratingNumber.map(item => parseInt(item.textContent.charAt(1))); //ok
            const imageArr = image.map(item => item.getAttribute('src')); //ok
            const priceArr = price.map(item => parseFloat(item.querySelector('div > div > span:nth-child(3)').textContent)); //ok
            const ratingArr = rating.map(item => 5 - item.querySelectorAll('[color="#cfcbca"]').length)

            // create products array
            for (let i = 0; i < nameArr.length; i++) {
                let data = Object.assign({
                    id: i,
                    name: nameArr[i],
                    url: urlArr[i],
                    ratingNumber: ratingNumberArr[i],
                    rating: ratingArr[i],
                    imageUrl: imageArr[i],
                    price: priceArr[i]
                });
                result.push(data);
            }
            return result;
        })

        console.log(products);
        res.json({
            confirmation: 'success',
            data: products

        })
        // await browser.close()
    }).catch((err) => {
        res.json({
            confirmation: 'Faild !',
            message: err.message
        })

    })
})

// Scroll Down for load image
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}


module.exports = router;