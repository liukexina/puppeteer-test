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
    await page.goto('https://pgy.xiaohongshu.com/', { waitUntil: 'networkidle2' })
    // 点击跳转登陆
    const loginBtn = await page.$('.login-btn');
    await loginBtn.click()
    // await Promise.all([loginBtn.click(), page.waitForNavigation()]);
    //输入账号密码
    const loginVoucherElement = await page.$('.login-box input[placeholder=手机号]');
    const passwordElement = await page.$('.login-box input[placeholder=验证码]');
    const okButtonElement = await page.$('.login-box button');

    await loginVoucherElement.type('12345678901', { delay: 200 });
    await passwordElement.type('151488', { delay: 200 });
    //点击确定按钮进行登录
    //等待页面跳转完成，一般点击某个按钮需要跳转时，都需要等待 page.waitForNavigation() 执行完毕才表示跳转成功
    await okButtonElement.click()
    // await Promise.all([okButtonElement.click(), page.waitForNavigation()]);
    // await page.close();
    // await browser.close();
    return 'pgy 登录成功'
  }

  async setCookie() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const cookies = [
      {
        "domain": ".pgy.xiaohongshu.com",
        "expirationDate": 1696854570.122242,
        "hostOnly": false,
        "httpOnly": true,
        "name": "feratlin-status",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "online",
        "id": 1
      },
      {
        "domain": ".pgy.xiaohongshu.com",
        "expirationDate": 1696854570.122332,
        "hostOnly": false,
        "httpOnly": true,
        "name": "feratlin-status.sig",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "uBZJqsDDK9NbcHCALtzq7uIWcElHVIDWaGpKRyVXpts",
        "id": 2
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1731209968.052552,
        "hostOnly": false,
        "httpOnly": false,
        "name": "_porch_uuid",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "906878337749439",
        "id": 3
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1726737648,
        "hostOnly": false,
        "httpOnly": false,
        "name": "a1",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "18ab1e4607abylwcwo4umymgqgd83t0b7rel8rpz700000355059",
        "id": 4
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1726809171.678125,
        "hostOnly": false,
        "httpOnly": false,
        "name": "abRequestId",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "d8f1d1dd35ee93c3e4bae0baae9e44a1",
        "id": 5
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1696841888.333493,
        "hostOnly": false,
        "httpOnly": false,
        "name": "access-token-hera.beta.xiaohongshu.com",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "internal.hera.AT-1b221eb694954ed7b20c158a5b7ddd2d-dc6ccaab39044d528e3582a1376bdd7d",
        "id": 6
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1696841888.333477,
        "hostOnly": false,
        "httpOnly": false,
        "name": "access-token-hera.xiaohongshu.com",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "internal.hera.AT-1b221eb694954ed7b20c158a5b7ddd2d-dc6ccaab39044d528e3582a1376bdd7d",
        "id": 7
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1697362986.979435,
        "hostOnly": false,
        "httpOnly": false,
        "name": "access-token-local.sit.xiaohongshu.com",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "customer.ares.AT-034726683cf2485ea2612bf52f2002a8-a9864fe67e0745f4ba282295974ab0c0",
        "id": 8
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1697372784.67025,
        "hostOnly": false,
        "httpOnly": false,
        "name": "access-token-pgy.beta.xiaohongshu.com",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "customer.ares.AT-cc441ab6eddd4919a24009adbb8009fb-beb3482fe28146508fa5a18505048190",
        "id": 9
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1697372784.670222,
        "hostOnly": false,
        "httpOnly": false,
        "name": "access-token-pgy.xiaohongshu.com",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "customer.ares.AT-cc441ab6eddd4919a24009adbb8009fb-beb3482fe28146508fa5a18505048190",
        "id": 10
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1726738643.830275,
        "hostOnly": false,
        "httpOnly": true,
        "name": "access-token-yunxiao.devops.xiaohongshu.com",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "internal.yanxiao.AT-d734940c5d49465ea6975d1ba4e7853c-28388568cfe941dfbae648a552d80a74",
        "id": 11
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1731327984.52189,
        "hostOnly": false,
        "httpOnly": true,
        "name": "customer-sso-sid",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "652269046400000000000006",
        "id": 12
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1697372784.521832,
        "hostOnly": false,
        "httpOnly": true,
        "name": "customerBeakerSessionId",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "69bd9818c5730cac95d09ed2eff3d6c8fe6539b6gAJ9cQAoWBAAAABjdXN0b21lclVzZXJUeXBlcQFLAlgOAAAAX2NyZWF0aW9uX3RpbWVxAkdB2UiaQSo9cVgJAAAAYXV0aFRva2VucQNYAAAAAHEEWA4AAABfYWNjZXNzZWRfdGltZXEFR0HZSKf8K7ZGWAMAAABfaWRxBlggAAAANzEyZDJlY2FmYzMxNGNiNGE4YjNhNTA1NzgxZTJiMTlxB1gGAAAAdXNlcklkcQhYGAAAADVjMjY0N2YwOTYzNGIxNDc4ODY0ODI5OXEJWAMAAABzaWRxClgYAAAANjUyMjY5MDQ2NDAwMDAwMDAwMDAwMDA2cQt1Lg==",
        "id": 13
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1729761674.152345,
        "hostOnly": false,
        "httpOnly": true,
        "name": "customerClientId",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "306440345585019",
        "id": 14
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1728304170.732606,
        "hostOnly": false,
        "httpOnly": false,
        "name": "gid",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "yY0Dyd4KydWDyY0Dyd4K8FFUW0Dv1ESEl476duWv6kAkf188Yq98DY888q2282j8D0S282f8",
        "id": 15
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1696841888.333428,
        "hostOnly": false,
        "httpOnly": false,
        "name": "hera.beaker.session.id",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "1696755488384065314022",
        "id": 16
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1697247589.496327,
        "hostOnly": false,
        "httpOnly": true,
        "name": "hulk.sso.jwt",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVG9rZW4iOiJjMzExMmJmNTliOGQ0NmI0YjdlZWJkYWVmZWY4MGU1Ni1jMjRkMDc4N2UyZDU0MDk0YmI3NTNmMjRhODAyOWE5NiIsInVzZXJJZCI6IjY0NjQ4NjJjNjQwMDAwMDAwMDAwMDAwYSIsInVzZXJTdWJzeXN0ZW1zSW5mbyI6e30sImlhdCI6MTY5NjY0Mjc4OSwiZXhwIjoxNjk3MjQ3NTg5fQ.8BAT8wrhy0_R6JQm2oulTWS_17r0E5EaDDLC2RoS6cI",
        "id": 17
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1697254754,
        "hostOnly": false,
        "httpOnly": false,
        "name": "newresults",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "",
        "id": 18
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1729762643.146061,
        "hostOnly": false,
        "httpOnly": true,
        "name": "porch_beaker_session_id",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "eb2b13d6a1d2ae89ae28c77f458e917756735209gAJ9cQAoWAMAAABfaWRxAVggAAAAY2Q5NDJkNWVjODRmNDQ1MTk2MDU2NzU1MTYxMWRiZjZxAlgOAAAAX2FjY2Vzc2VkX3RpbWVxA0p5psxkWAoAAABleHBpcmVkX2F0cQRKeU1DZVgNAAAAcG9yY2gtdXNlci1pZHEFWBgAAAA2NDY0ODYyYzY0MDAwMDAwMDAwMDAwMGFxBlgQAAAAcG9yY2gtYXV0aC10b2tlbnEHWEEAAABjMzExMmJmNTliOGQ0NmI0YjdlZWJkYWVmZWY4MGU1Ni1jMjRkMDc4N2UyZDU0MDk0YmI3NTNmMjRhODAyOWE5NnEIWA4AAABfY3JlYXRpb25fdGltZXEJSnmmzGR1Lg==",
        "id": 19
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1726738643.146118,
        "hostOnly": false,
        "httpOnly": true,
        "name": "redpass_did",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "E0867EF1-DE5E-548D-9775-FB5E1BE2FCF5",
        "id": 20
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1697247586.388835,
        "hostOnly": false,
        "httpOnly": true,
        "name": "SESSION",
        "path": "/",
        "sameSite": "lax",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "M2I4YjI4NGUtZDJhMi00OThjLTgwMzMtNzBiNDExNDVmYWUy",
        "id": 21
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1704425968.05236,
        "hostOnly": false,
        "httpOnly": true,
        "name": "sit_porch_beaker_session_id",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "2ca4f33e6cc21d5354e0ff73769a7bf19ac4b57cKGRwMQpWcG9yY2gtdXNlci1pZApwMgpWNjQ2NDg2MmM2NDAwMDAwMDAwMDAwMDBhCnAzCnNWX2lkCnA0ClYxZTFiMjVjMDY0YzMxMWVlYWM5NWNmMDg1Yzk5NmY5YwpwNQpzVl9hY2Nlc3NlZF90aW1lCnA2CkYxNjk2NjQ5OTY4LjE1NTk5OTkKc1Zwb3JjaC1hdXRoLXRva2VuCnA3ClZkOWYxNmE4ZWI1MjM0YjI3YWJiNDc4NWQwODAyODZhZi1mYmRmMDhhOWRlYjU0OWRiYmI5N2M5NDZkM2IzMzcxNApwOApzVl9jcmVhdGlvbl90aW1lCnA5CkYxNjk2NjQ5OTY4LjE1NTk5OTkKc1ZleHBpcmVkX2F0CnAxMApJMTcwNDQyNTk2OApzLg==",
        "id": 22
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1697372784.670136,
        "hostOnly": false,
        "httpOnly": false,
        "name": "solar.beaker.session.id",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "1696767984835095352917",
        "id": 23
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1697254754,
        "hostOnly": false,
        "httpOnly": false,
        "name": "timeslogin",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "2b79b21b8bd9366ca9cf0e2427536d20",
        "id": 24
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1726809176.182804,
        "hostOnly": false,
        "httpOnly": true,
        "name": "web_session",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "030037a23884a23ff4719b9673224ab7cb4d7b",
        "id": 25
      },
      {
        "domain": ".xiaohongshu.com",
        "hostOnly": false,
        "httpOnly": false,
        "name": "webBuild",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": true,
        "storeId": "0",
        "value": "3.10.6",
        "id": 26
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1726737648,
        "hostOnly": false,
        "httpOnly": false,
        "name": "webId",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "d8f1d1dd35ee93c3e4bae0baae9e44a1",
        "id": 27
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1696922353,
        "hostOnly": false,
        "httpOnly": false,
        "name": "websectiga",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "82e85efc5500b609ac1166aaf086ff8aa4261153a448ef0be5b17417e4512f28",
        "id": 28
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1731209968.0525,
        "hostOnly": false,
        "httpOnly": true,
        "name": "x-user-id",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "6464862c640000000000000a",
        "id": 29
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1731327984.521908,
        "hostOnly": false,
        "httpOnly": true,
        "name": "x-user-id-pgy.xiaohongshu.com",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "59ca5ab1800086001714efbf",
        "id": 30
      },
      {
        "domain": ".xiaohongshu.com",
        "expirationDate": 1728199153,
        "hostOnly": false,
        "httpOnly": false,
        "name": "xsecappid",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "xhs-pc-web",
        "id": 31
      }
    ]
    for (let i = 0; i < cookies.length; i++) {
      await page.setCookie(cookies[i]);
    }
    return { browser, page }
  }

  async interception() {
    const { browser, page } = await this.setCookie();
    const blockTypes = new Set(['image', 'media', 'font']);
    await page.setRequestInterception(true); //开启请求拦截
    page.on('request', async request => {
      const type = request.resourceType();
      const shouldBlock = blockTypes.has(type);
      if (shouldBlock) {
        //直接阻止请求
        return request.abort();
      } else if (request.url() === 'https://pgy.xiaohongshu.com/api/solar/user/info') {
        console.log(request.url(), type, request.postData())
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
          headers: { 'Access-Control-Allow-Origin': '*' },
          contentType: 'application/json; charset=utf-8',
          body: JSON.stringify({
            code: 0,
            data: {
              "loginAccount": "3643414222",
              "nickName": "haojia郝葭",
              "avatar": "https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo30p58buock46g49rclsdb3rtv9fo5cvg?imageView2/2/w/120/format/jpg",
              "userId": "59ca5ab1800086001714efbf",
              "email": "982174036@qq.com",
              "sellerId": "5c2647f02ba68e69a96f2b17",
              "role": "brand",
              "sellerType": 4,
              "redId": "Jekdk61",
              "arkSellerId": null,
              "arkShopName": null,
              "arkShopAvatar": null,
              "permissions": [
                "Home",
                "liveKolList"
              ],
              "secondPermissions": [],
              "accountType": 2,
              "defaultTab": "cooperation",
              "tabList": [
                "cooperator_b"
              ],
              "professionalInfo": {
                "professionalCode": "beautycareCollectionShop",
                "professionalName": "美护集合店",
                "certificateType": 4,
                "strong": true,
                "status": 1
              },
              "companyName": "offlineMockCompanyName",
              "baccountNo": null,
              "buserId": "5c2647f09634b14788648299"
            }
          }),
        });
      } else {
        request.continue();
      }
    });

    page.on('response', async res => {
      if (res.url() === 'https://pgy.xiaohongshu.com/api/solar/user/info') {
        console.log(res.status(), await res.text());
      }
    });

    await page.goto('https://pgy.xiaohongshu.com/', { waitUntil: 'networkidle2' })
    await page.close();
    await browser.close();
  }

  async evaluate() {
    const { browser, page } = await this.setCookie();
    await page.goto('https://pgy.xiaohongshu.com/solar/home?tab=0', { waitUntil: 'networkidle2' })
    //注册一个 Node.js 函数，在浏览器里运行
    await page.exposeFunction('md5', text =>
      crypto.createHash('md5').update(text).digest('hex')
    );
    //通过 page.evaluate 在浏览器里执行修改dom结构
    await page.evaluate(async () => {
      const logo = document.querySelector('.ratlin-tooltip-sticky');
      logo.remove();  // 把dom从页面移除
      console.log('删除dom成功！')
      //在页面中调用 Node.js 环境中的函数
      const myHash = await window.md5('PUPPETEER');
      console.log(`md5 of PUPPETEER is ${myHash}`);
    });
    // await page.close();
    // await browser.close();
  }

  async iframe() {
    const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
    const page = await browser.newPage();
    const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    
    <body>
      <iframe src="https://juejin.cn/" width="1000" height="500"/>
    </body>
    </html>`
    await page.setContent(htmlContent);
    for (const frame of page.mainFrame().childFrames()) {
      //根据 url 找到页面对应的 iframe
      if (frame.url().includes('https://juejin.cn/')) {
        await frame.type('.search-input', '18846180523');
        break;
      }
    }
    // await page.close();
    // await browser.close();
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

    await page.setContent(htmlContent, { waitUntil: 'networkidle2' });
    //点击按钮触发下载
    await (await page.waitForSelector('#download')).click();
    //等待文件出现，轮训判断文件是否出现
    const res = await this.waitForFile(tmpPath);
    console.log(res)

    //上传时对应的 inputElement 必须是<input>元素
    let inputElement = await page.waitForXPath('//input[@type="file"]');
    await inputElement.uploadFile(tmpPath);
    // browser.close();
  }

  async emulate() {
    const iPhone = puppeteer.devices['iPhone 13']; // 设备
    const slow3G = puppeteer.networkConditions['Slow 3G']; // 网速
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.emulate(iPhone);
    await page.emulateNetworkConditions(slow3G);
    await page.goto('https://www.xiaohongshu.com/experience/activity-share?fullscreen=true&i=17779&nickname=TensorTensor&avatar=https%3A%2F%2Fsns-avatar-qc.xhscdn.com%2Favatar%2F5f013ff1197f8200013e9df6.jpg%3FimageView2%2F2%2Fw%2F360%2Fformat%2Fwebp&pName=Babycare%E5%B9%BC%E6%9C%B4%E6%B4%97%E5%8F%91%E6%B0%B4&reco=&source_str=share&p=6482d3052b96cf0001374cd9');
    // await browser.close();
  }

  async image_pdf() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://www.juejin.cn/", { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'juejin.png' });
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
