// @ts-nocheck

import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async login() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://vision.maoyan.com', { waitUntil: 'networkidle2' });
    // 点击跳转登陆
    const loginBtn = await page.$('.username button');
    await Promise.all([loginBtn.click(), page.waitForNavigation()]);
    //输入账号密码
    const loginVoucherElement = await page.$('#loginVoucher');
    const passwordElement = await page.$('#password');
    const okButtonElement = await page.$('.login');
    await loginVoucherElement.type('liukexin08', { delay: 200 });
    await passwordElement.type('liukexin1998', { delay: 200 });
    //点击确定按钮进行登录
    //等待页面跳转完成，一般点击某个按钮需要跳转时，都需要等待 page.waitForNavigation() 执行完毕才表示跳转成功
    await Promise.all([okButtonElement.click(), page.waitForNavigation()]);
    console.log('vision 登录成功');
    await page.close();
    await browser.close();
    return 'vision 登录成功'
  }

  async interception() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const blockTypes = new Set(['image', 'media', 'font']);
    await page.setRequestInterception(true); //开启请求拦截
    page.on('request', async request => {
        const type = request.resourceType();
        const shouldBlock = blockTypes.has(type);
        if(shouldBlock){
            //直接阻止请求
            return request.abort();
         } else if(request.url() === 'https://vision.maoyan.com/api/user/userInfo') {
          console.log(request.url(),type, request.postData())
            //对请求重写
            // return request.continue({
            //     //可以对 url，method，postData，headers 进行覆盖
            //     method: 'GET',
            //     headers: Object.assign({}, request.headers(), {
            //         'puppeteer-test': 'true'
            //     }),
            // });
            // 修改请求返还结果
            await request.respond({
              status: 200,
              headers: {'Access-Control-Allow-Origin': '*'},
              contentType: 'application/json; charset=utf-8',
              body: JSON.stringify({ code: 0, data: 'hello puppeteer' }),
            });
        } else {
          request.continue();
        }
    });

    page.on('response', async res => {
      if (res.url() === 'https://vision.maoyan.com/api/user/userInfo') {
        console.log(res.status(),await res.text());
      }
    });

    await page.goto('https://vision.maoyan.com');
    await page.close();
    await browser.close();
  }

  async evaluate() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://vision.maoyan.com', {waitUntil: 'networkidle2'});
    //注册一个 Node.js 函数，在浏览器里运行
    await page.exposeFunction('md5', text =>
        crypto.createHash('md5').update(text).digest('hex')
    );
    //通过 page.evaluate 在浏览器里执行修改dom结构
    await page.evaluate(async () =>  {
        const logo = document.querySelector('.logo-animation');
        logo.remove();  // 把dom从页面移除
        console.log('删除dom成功！')
        //在页面中调用 Node.js 环境中的函数
        const myHash = await window.md5('PUPPETEER');
        console.log(`md5 of PUPPETEER is ${myHash}`);
    });
    await page.close();
    await browser.close();
  }

  async iframe() {
    const browser = await puppeteer.launch({headless: false, slowMo: 50});
    const page = await browser.newPage();
    await page.goto('https://star.maoyan.com');
    for (const frame of page.mainFrame().childFrames()){
        //根据 url 找到登录页面对应的 iframe
        console.log(frame.url())
        if (frame.url().includes('https://keeper.maoyan.com/business/login')){
            await frame.type('#loginVoucher', 'liukexin08');
            await frame.type('#password', 'liukexin1998');
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
    //通过 CDP 会话设置下载路径
    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath });
   
    await page.setContent(htmlContent, {waitUntil: 'networkidle2'});
    //点击按钮触发下载
    await (await page.waitForSelector('#download')).click();
    //等待文件出现，轮训判断文件是否出现
    const res = await this.waitForFile(tmpPath);
    console.log(res)

    //上传时对应的 inputElement 必须是<input>元素
    let inputElement = await page.waitForXPath('//input[@type="file"]');
    await inputElement.uploadFile(tmpPath);
    browser.close();
  }

  async emulate() {
    const iPhone = puppeteer.devices['iPhone 13']; // 设备
    const slow3G = puppeteer.networkConditions['Slow 3G']; // 网速
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.emulate(iPhone);
    await page.emulateNetworkConditions(slow3G);
    await page.goto('https://www.baidu.com');
    await browser.close();
  }

  async image_pdf() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://www.juejin.cn/");
    await page.screenshot({path: 'juejin.png'});
    await page.pdf({
      path: 'juejin.pdf', // 文件保存路径
      format: 'A4', // 页面大小
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
          } else {
            if (index * timeout > 10000) {
              reject(new Error(`文件 ${fileName} 未找到.`));
            }
          }
        });
      }, timeout);
    });
  }
}
