// index.js
const scrape = require('website-scraper');
const PuppeteerPlugin = require('website-scraper-puppeteer');
const path = require('path');

scrape({
    // Provide the URL(s) of the website(s) that you want to clone
    // In this example, you can clone the Our Code World website
    urls: ['https://www.bidv.com.vn/smartbanking/bfree/?fbclid=IwAR0tL2lbhOlNUl6-C9HF82tVnUWrmy-g8mFvKR2cc4BJgw_wzT1j5gX1ZH8'],
    // Specify the path where the content should be saved
    // In this case, in the current directory inside the ourcodeworld dir
    directory: path.resolve(__dirname, 'smartbanking'),
    // Load the Puppeteer plugin
    plugins: [ 
        new PuppeteerPlugin({
            launchOptions: { 
                // If you set  this to true, the headless browser will show up on screen
                headless: true
            }, /* optional */
            scrollToBottom: {
                timeout: 10000, 
                viewportN: 10 
            } /* optional */
        })
    ]
});