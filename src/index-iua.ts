import Fastify, {FastifyInstance} from 'fastify';
import {FastifyRequest} from "fastify/types/request";
import {hcPages} from './@dsunegin/fastify-hc-pages';
const formBodyPlugin = require('fastify-formbody');
import {Page} from 'puppeteer';
const bearerAuthPlugin = require('fastify-bearer-auth');

// Load custom .env file if CONFIG environment variable is set
const envconf = process.env.CONFIG ? require('dotenv').config({ path: process.env.CONFIG }) : require('dotenv').config();
if (envconf.error) {    throw envconf.error;} // ERROR if Config .env file is missing

// Default Config Values if not set in .env config file
const PORT = process.env.PORT || 3000;
const PAGES_NUM = process.env.PAGES_NUM || 1;
const PAGE_TIMEOUT = process.env.PAGE_TIMEOUT || 60000;
const keys: Array<string> | null = process.env.BEARER ? process.env.BEARER.split('|') : null;


const server: FastifyInstance = Fastify({});
const hcOpt: Object = {
    /**
     * Number of Pages to launch.
     * Change according to the number of requests and machine resources.
     */
    pagesNum: PAGES_NUM,
    pageOptions: {
        /**
         * @see https://pptr.dev/#?product=Puppeteer&version=v8.0.0&show=api-pagesetuseragentuseragent
         */
        /*userAgent: process.env.USER_AGENT ? process.env.USER_AGENT : UA_default,*/
        /**
         * @see https://pptr.dev/#?product=Puppeteer&version=v8.0.0&show=api-pagesetdefaulttimeouttimeout
         */
        pageTimeoutMilliseconds: PAGE_TIMEOUT,
        /**
         * @see https://pptr.dev/#?product=Puppeteer&version=v8.0.0&show=api-pageemulatemediatypetype
         */
        /*emulateMediaTypeScreenEnabled: false,*/
        /**
         * Add Accept-Language HTTP header
         */
        /*acceptLanguage: '',*/
        /**
         * @see https://pptr.dev/#?product=Puppeteer&version=v8.0.0&show=api-pagesetviewportviewport
         */
        /*viewport: null,*/
    },
    /**
     * @see https://pptr.dev/#?product=Puppeteer&version=v8.0.0&show=api-puppeteerlaunchoptions
     */
    launchOptions: {
        //headless: false,
        args: [
           /* '--headless',
            '--no-sandbox',
            '--disable-setuid-sandbox'*/
            

        ]
    },
};
interface RequestBody {
    text?: string;
    tl?: string;
    sl?: string;
}

const slArr = [
    {lang:"ru", href:"russko"},
    {lang:"uk", href:"ukrainsko"}
];
const tlArr = [
    {lang:"ru", href:"russkiy"},
    {lang:"uk", href:"ukrainskiy"}
];
const gTranslate = async (sl: string = 'ru', tl: string = 'uk', text: string = '') => {
    // Make result you need in callback function with Page
    return await server.runOnPage<string | null>(async (page: Page) => {
        if (sl != 'auto') {let slr=slArr.filter(el => el.lang == sl); sl = slr[0].href;}
        let tlr=tlArr.filter(el => el.lang == tl);
        if ( tlr.length >0 ) {tl = tlr[0].href;}

        const goto_url = `https://perevod.i.ua/${sl}-${tl}/`;

        // Disable Redirect on Page
        // Modify \windows\system32\drivers\etc\hosts
        // to prevent AdBlock redirect from site perevod.i.ua :
        // 127.0.0.1 cdn.admixer.net

        await page.goto(goto_url);
        await page.waitForSelector('#first_textarea');
        await page.waitForTimeout(1000);

        // string that we want to translate and type it on the textarea
        if (text.length ==0) return '';

        await page.evaluate((text) => {
            const input = document.createElement('input');
            document.body.appendChild(input);
            input.value = text;
            input.focus();
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
        },text);

        await page.click('#first_textarea');
        await page.waitForTimeout(500);
        await page.keyboard.down('Control');
        await page.keyboard.down('Shift');
        await page.keyboard.press('KeyV');
        await page.keyboard.up('Control');
        await page.keyboard.up('Shift');
        await page.waitForTimeout(1000);

        await page.click('input.button[name="commit"]');
        await page.waitForTimeout(5000);

        // wait for the result container available
        await page.waitForSelector('#second_textarea');

        // get the result string (translated text)
        return await page.evaluate(() => {
            let el = document.querySelector('#second_textarea');

            return el?.innerHTML ? el.innerHTML : '' ;
        }) ;
    });

};

// Work together with Puppeteer's Page in callback function.
server.post('/translate', async (request: FastifyRequest, reply) => {
    let reqbody: RequestBody | any = request.body;
    const result = await gTranslate(reqbody?.sl,reqbody?.tl,reqbody?.text);
    reply.send(result)
});
// Quick Test in browser.
// Result MUST be a string: Привет, мой дорогой друг
server.get('/translate', async (request: FastifyRequest, reply) => {
    const result = await gTranslate('auto','ru','Hello my dear friend');
    reply.send(result)
});

const start = async () => {
    try {
        // Register this plugin
        if (keys) await server.register(bearerAuthPlugin, {keys});
        await server.register(formBodyPlugin);
        await server.register(hcPages, hcOpt);
        await server.listen(PORT);
        console.log(`Server listen on port: ${PORT}`);
        
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start().then();
