"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HCPages = void 0;
const puppeteer_1 = require("puppeteer");
const ChromeLauncher = require('chrome-launcher');
const axios = require('axios');
const request = require('request');
const util = require('util');

const defaultPagesNum = 3;
const defaultPageOptions = {
    userAgent: '',
    pageTimeoutMilliseconds: 60000,
    emulateMediaTypeScreenEnabled: false,
    acceptLanguage: '',
};
const defaultLaunchOptions = {
    args: [
       /* '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',*/
    ],
};
const  wait = async (ms) => {
    return new Promise( (resolve) => {setTimeout(resolve, ms)});
}
class HCPages {
    constructor(browser, pagesNum, pageOptions = {}) {
        this.pagesNum = pagesNum;
        this.pageOptions = { ...defaultPageOptions, ...pageOptions };
        this.browser = browser;
        this.pages = [];
        this.readyPages = [];
        this.currentPromises = [];
    }
    async destroy() {
        await this.closePages();
        await this.closeBrowser();
    }
    async runCallback(page, callback) {
        const result = await callback(page);
        this.readyPages.push(page);
        return result;
    }
    async runOnPage(callback) {
        let page = this.readyPages.pop();
        while (!page) {
            await Promise.race(this.currentPromises);
            page = this.readyPages.pop();
        }
        const promise = this.runCallback(page, callback);
        this.currentPromises.push(promise);
        const result = await promise;
        this.currentPromises.splice(this.currentPromises.indexOf(promise), 1);
        return result;
    }
    async createPages() {
        const pages = [];
        for (let i = 0; i < this.pagesNum; i++) {
            const page = await this.browser.newPage();
            await this.applyPageConfigs(page);
            console.log(`page number ${i} is created`);
            pages.push(page);
        }
        return pages;
    }
    async applyPageConfigs(page) {
        const { pageTimeoutMilliseconds, userAgent, emulateMediaTypeScreenEnabled, acceptLanguage, viewport, } = this.pageOptions;
        if (pageTimeoutMilliseconds) {
            page.setDefaultTimeout(pageTimeoutMilliseconds);
            //page.setDefaultNavigationTimeout(pageTimeoutMilliseconds);
            console.log(`defaultTimeout set ${pageTimeoutMilliseconds}`);
        }
        if (viewport) {
            await page.setViewport(viewport);
            console.log(`viewport set ${JSON.stringify(page.viewport())}`);
        }
        if (userAgent) {
            await page.setUserAgent(userAgent);
            console.log(`user agent set ${userAgent}`);
        }
        if (emulateMediaTypeScreenEnabled) {
            await page.emulateMediaType('screen');
            console.log('emulateMediaType screen');
        }
        if (acceptLanguage) {
            await page.setExtraHTTPHeaders({
                'Accept-Language': acceptLanguage,
            });
            console.log(`Accept-Language set: ${acceptLanguage}`);
        }
    }
    async closePages() {
        for (let i = 0; i < this.pagesNum; i++) {
            await this.pages[i].close();
            console.log(`page number ${i} is closed`);
        }
    }
    async closeBrowser() {
        await this.browser.close();
        console.log('browser is closed');
    }
}
exports.HCPages = HCPages;
HCPages.init = async (pagesNum = defaultPagesNum, pageOptions = undefined, launchOptions = undefined) => {
    const newFlags = ChromeLauncher.Launcher.defaultFlags().filter(flag => flag !== '--disable-extensions' && flag !== '--mute-audio');

    /*  VARIANT 2
    let chrome = await ChromeLauncher.launch({
        chromeFlags: launchOptions.args || defaultLaunchOptions.args

    });

    const response = await axios.get(`http://localhost:${chrome.port}/json/version`);
    const { webSocketDebuggerUrl } = response.data;

    // Connecting the instance using `browserWSEndpoint`
    const browser = await puppeteer_1.connect({ browserWSEndpoint: webSocketDebuggerUrl });
*/
  
    const opts = {
        /*chromeFlags: ['--headless'],*/
        logLevel: 'info',
        output: 'json'
    };

// Launch chrome using chrome-launcher.
    const chrome = await ChromeLauncher.launch(opts);
    opts.port = chrome.port;

// Connect to it using puppeteer.connect().
    const resp = await util.promisify(request)(`http://localhost:${opts.port}/json/version`);
    const {webSocketDebuggerUrl} = JSON.parse(resp.body);
    const browser = await puppeteer_1.connect({browserWSEndpoint: webSocketDebuggerUrl});
    console.info(browser);

    console.log(`browser.verison is ${await browser.version()}`);
    const hcPages = new HCPages(browser, pagesNum, pageOptions);
    hcPages.pages = await hcPages.createPages();
    hcPages.readyPages = hcPages.pages;
    return hcPages;
};
//# sourceMappingURL=hc-pages.js.map