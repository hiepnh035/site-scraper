// index.js
const puppeteer = require('puppeteer');
const scrape = require('website-scraper');
const PuppeteerPlugin = require('website-scraper-puppeteer');
const path = require('path');
const USERNAME_SELECTOR = 'input[name=email]';
const PASSWORD_SELECTOR = 'input[name=password]';
const SUBMIT_SELECTOR = 'button[type=submit]';
const credentials = {
    username: "nhathuy7996@gmail.com",
    password: "xinhayquendi1"
};
const fs = require('fs').promises;
const userAgent = require('user-agents');
const puppeteerExtra = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')


async function startBrowser() {
    // puppeteerExtra.use(StealthPlugin());
    const browser = await puppeteerExtra.launch({headless: false, slowMo: 20});
    const page = await browser.newPage();
    return {browser, page};
  }

  async function closeBrowser(browser) {
    return browser.close();
  }
  
  async function playTest(url) {
    const {browser, page} = await startBrowser();
    await page.setViewport({
        width: 1920 + Math.floor(Math.random() * 100),
        height: 3000 + Math.floor(Math.random() * 100),
        deviceScaleFactor: 1,
        hasTouch: false,
        isLandscape: false,
        isMobile: false,
    });
    await Promise.all([
        page.coverage.startCSSCoverage()
    ]);
    
    // await page.setUserAgent(userAgent.toString());
    // await page.setJavaScriptEnabled(true);
    // await page.setDefaultNavigationTimeout(0);

    // const cookiesString = await fs.readFile('./cookies.json');
    // const cookies = JSON.parse(cookiesString);
    // await page.setCookie(...cookies);
    // console.log(cookies, 'xxx');

    await page.goto(url);
    // await page.click(USERNAME_SELECTOR);
    // await page.keyboard.type(credentials.username);
    // await page.click(PASSWORD_SELECTOR);
    // await page.keyboard.type(credentials.password);
    // await page.click(SUBMIT_SELECTOR);
    // await page.waitForNavigation();
   
    const html = await page.content();
    await fs.writeFile('./product-list.html', html);
    const cssCoverage = await Promise.all([
        page.coverage.stopCSSCoverage(),
    ]);
    // Investigate CSS Coverage and Extract Used CSS
    const css_coverage = [...cssCoverage];
    let css_used_bytes = 0;
    let css_total_bytes = 0;
    let covered_css = "";
    for (const entry of css_coverage[0]) {
        css_total_bytes += entry.text.length;
        console.log(`Total Bytes for ${entry.url}: ${entry.text.length}`);
        for (const range of entry.ranges){
            css_used_bytes += range.end - range.start - 1;
            covered_css += entry.text.slice(range.start, range.end) + "\n";
        }       
    }

    console.log(`Total Bytes of CSS: ${css_total_bytes}`);
    console.log(`Used Bytes of CSS: ${css_used_bytes}`);
    fs.writeFile("./exported_css.css", covered_css, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 

    await page.waitFor(5000);
    // await closeBrowser(browser);
  }
  
  (async () => {
    await playTest("https://www.bidv.com.vn/bidv/tin-tuc/thong-tin-bao-chi/bidv-trien-khai-chuong-trinh-tin-dung-dich-vu-dac-biet-dong-hanh-cung-nganh-y-chung-tay-vuot-dai-dich");
    process.exit(1);
  })();


