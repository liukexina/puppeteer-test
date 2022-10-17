"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const puppeteer = require("puppeteer");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
    async login() {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('https://vision.maoyan.com', { waitUntil: 'networkidle2' });
        const loginBtn = await page.$('.username button');
        await Promise.all([loginBtn.click(), page.waitForNavigation()]);
        const loginVoucherElement = await page.$('#loginVoucher');
        const passwordElement = await page.$('#password');
        const okButtonElement = await page.$('.login');
        await loginVoucherElement.type('liukexin08', { delay: 200 });
        await passwordElement.type('liukexin1998', { delay: 200 });
        await Promise.all([okButtonElement.click(), page.waitForNavigation()]);
        console.log('vision 登录成功');
        return 'vision 登录成功';
    }
    async interception() {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        const blockTypes = new Set(['image', 'media', 'font']);
        await page.setRequestInterception(true);
        page.on('request', async (request) => {
            const type = request.resourceType();
            const shouldBlock = blockTypes.has(type);
            if (shouldBlock) {
                return request.abort();
            }
            else if (request.url() === 'https://vision.maoyan.com/api/user/userInfo') {
                console.log(request.url(), type, request.postData());
                await request.respond({
                    status: 200,
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    contentType: 'application/json; charset=utf-8',
                    body: JSON.stringify({ code: 0, data: 'hello puppeteer' }),
                });
            }
            else {
                request.continue();
            }
        });
        page.on('response', async (res) => {
            if (res.url() === 'https://vision.maoyan.com/api/user/userInfo') {
                console.log(res.status(), await res.text());
            }
        });
        await page.goto('https://vision.maoyan.com');
        await page.close();
        await browser.close();
    }
    async evaluate() {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('https://vision.maoyan.com', { waitUntil: 'networkidle2' });
        await page.exposeFunction('md5', text => crypto.createHash('md5').update(text).digest('hex'));
        await page.evaluate(async () => {
            const logo = document.querySelector('.logo-animation');
            logo.remove();
            console.log('删除dom成功！');
            const myHash = await window.md5('PUPPETEER');
            console.log(`md5 of PUPPETEER is ${myHash}`);
        });
        await page.close();
        await browser.close();
    }
    async iframe() {
        const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
        const page = await browser.newPage();
        await page.goto('https://star.maoyan.com');
        for (const frame of page.mainFrame().childFrames()) {
            console.log(frame.url());
            if (frame.url().includes('https://keeper.maoyan.com/business/login')) {
                await frame.type('#loginVoucher', 'liukexin08');
                await frame.type('#password', 'abc');
                await Promise.all([
                    frame.click('.login'),
                    page.waitForNavigation()
                ]);
                break;
            }
        }
        await page.close();
        await browser.close();
    }
    async trace() {
        const broswer = await puppeteer.launch();
        const page = await broswer.newPage();
        await page.tracing.start({
            path: 'baiduTrace.json',
        });
        await page.goto('https://www.baidu.com/');
        const jsInfo = await page.metrics();
        console.log({ jsInfo });
        await page.tracing.stop();
        await broswer.close();
    }
    async upload() {
        const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    
    <body>
      <input id="upload" type="file"/>
      <div id="download">下载图片</div>
      <script>
        const download = document.querySelector('#download');
        download.onclick = async () => {
          var response = await fetch("https://obj.pipi.cn/starPlan/43fc4f5c8038e0d5069e3d2023556fb9.png")
          var blob = await response.blob();
          const url =  URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = 'name.png';
          a.click();
          URL.revokeObjectURL(newUrl);
        }
      </script>
    </body>
    </html>`;
        const downloadPath = path.resolve(__dirname, './public');
        const tmpPath = path.resolve(downloadPath, "name.png");
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        const client = await page.target().createCDPSession();
        await client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath });
        await page.setContent(htmlContent, { waitUntil: 'networkidle2' });
        await (await page.waitForSelector('#download')).click();
        const res = await this.waitForFile(tmpPath);
        console.log(res);
        let inputElement = await page.waitForXPath('//input[@type="file"]');
        await inputElement.uploadFile(tmpPath);
        browser.close();
    }
    async emulate() {
        const iPhone = puppeteer.devices['iPhone 13'];
        const slow3G = puppeteer.networkConditions['Slow 3G'];
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.emulate(iPhone);
        await page.emulateNetworkConditions(slow3G);
        await page.goto('https://www.baidu.com');
        await browser.close();
    }
    async image_pdf() {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto("https://www.juejin.cn/");
        await page.screenshot({ path: 'juejin.png' });
        await page.pdf({
            path: 'juejin.pdf',
            format: 'A4',
        });
        await browser.close();
    }
    waitForFile(fileName) {
        return new Promise((resolve, reject) => {
            const timeout = 100;
            let index = 0;
            const timer = setInterval(() => {
                fs.access(fileName, fs.constants.R_OK, err => {
                    index++;
                    if (!err) {
                        resolve(`文件 ${fileName} 已出现.`);
                        clearInterval(timer);
                    }
                    else {
                        if (index * timeout > 10000) {
                            reject(new Error(`文件 ${fileName} 未找到.`));
                        }
                    }
                });
            }, timeout);
        });
    }
};
AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map