var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var scrapperRouter = require('./routes/scrapper');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

console.log("Server Started");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/scrapper', scrapperRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Scrapper Testing
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// puppeteer.launch({ headless: false }).then(async browser => {
//   console.log('Running tests..')
//   const page = await browser.newPage()
//   await page.goto('https://www.mediamarkt.es', { waitUntil: "networkidle2" })

//   // Accept Cookie
//   await page.click("#pwa-consent-layer-accept-all-button");
//   await page.waitForTimeout(3000)

//   // Click Category
//   await page.click("#mms-app-header-category-button");
//   await page.waitForTimeout(4335)


//   // let data = await page.evaluate(() => {
//   //   document.querySelector('#pwa-consent-layer-accept-all-button')
//   //   return document.querySelector('.StyledConsentLayerCTAs-g0yhcr-11').innerText
//   // })

//   // console.log(`All done, check the screenshot. ✨` + data);
//   // await browser.close()
// }).catch(() => {
//   console.log("Error")
// })

app.listen(8080, function () {
  console.log('app listening on port 8080!')
})

module.exports = app;
