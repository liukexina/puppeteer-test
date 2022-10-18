import { Injectable } from '@nestjs/common';
import * as schedule from 'node-schedule';
import * as puppeteer from 'puppeteer';

@Injectable()
export class BrowserService {
  private browser;
  private url;
  private options = {
    args: [
      // '--window-size=800,600', // 设置屏幕大小 默认 800 * 600
      '--no-sandbox', // 沙盒模式
      '--disable-setuid-sandbox', // uid沙盒
      '--disable-dev-shm-usage', // 创建临时文件共享内存
      '--disable-accelerated-2d-canvas', // canvas渲染
      '--disable-gpu',
      '--–single-process', // 单进程运行
      '--use-gl',
    ],
  };
  private time = 0;

  async Init() {
    const oldBrowser = this.browser;
    const browser = await puppeteer.launch(this.options);
    this.url = await browser.wsEndpoint();
    this.browser = browser;
    this.time = 0;

    setTimeout(async () => {
      if (oldBrowser) await oldBrowser.close();
    }, 5000);
  }

  async getUrl() {
    this.time++;
    await this.resetBrowser();
    return this.url;
  }

  async getBrowser() {
    return this.browser;
  }

  async resetBrowser() {
    if (this.time > 500 || !this.url) {
      console.log('browser准备重启');
      await this.Init();
      console.log('browser重启完毕');
    }
  }
}

@Injectable()
export class BrowserServiceMult {
  private browser;
  private url;
  private options = {
    args: [
      // '--window-size=800,600', // 设置屏幕大小 默认 800 * 600
      '--no-sandbox', // 沙盒模式
      '--disable-setuid-sandbox', // uid沙盒
      '--disable-dev-shm-usage', // 创建临时文件共享内存
      '--disable-accelerated-2d-canvas', // canvas渲染
      '--disable-gpu',
      '--–single-process', // 单进程运行
      '--use-gl',
    ],
  };
  private MAX_PAGE = 3;
  private MAX_PAGE_LOAD = 500;
  private NEW_PAGE_COUNT = 0;
  private pages: any[];
  private scheduleTimer;

  async Init() {
    const oldBrowser = this.browser;
    const browser = await puppeteer.launch(this.options);
    this.url = await browser.wsEndpoint();
    this.browser = browser;
    this.NEW_PAGE_COUNT = 1;
    const [defaultPage] = await browser.pages();
    this.pages = [
      { index: 0, page: defaultPage, isLock: false, page_number: 1 },
    ];
    for (let i = 1; i < this.MAX_PAGE; i++) {
      const page = await this.createPage();
      this.pages.push({ index: i, page, isLock: false, page_number: 1 });
    }
    this.NEW_PAGE_COUNT = this.MAX_PAGE;
    this.scheduledTask();
    setTimeout(async () => {
      if (oldBrowser) await oldBrowser.close();
    }, 5000);
  }

  scheduledTask() {
    if (this.scheduleTimer) this.scheduleTimer.cancel();
    this.scheduleTimer = schedule.scheduleJob(
      { hour: 10, minute: 0 },
      async () => {
        if (this.NEW_PAGE_COUNT * this.MAX_PAGE_LOAD > 2000) {
          console.log('browser准备重启');
          await this.Init();
          console.log('browser重启完毕');
        }
      },
    );
  }

  async getUrl() {
    this.NEW_PAGE_COUNT++;
    return this.url;
  }

  async createPage() {
    this.NEW_PAGE_COUNT++;
    return await this.browser.newPage();
  }

  async unlockPage(index) {
    const curPage = this.pages[index];
    if (curPage.page_number > this.MAX_PAGE_LOAD) {
      await curPage.page.close();
      const newPage = await this.createPage();
      curPage.page = newPage;
      curPage.isLock = false;
      curPage.page_number = 1;
    } else {
      curPage.isLock = false;
    }
  }

  async getPage() {
    await this.resetBrowser();
    const unUsedPages = this.pages.filter((item) => !item.isLock);
    const tmp = Math.floor(Math.random() * unUsedPages.length);
    const curPage = unUsedPages[tmp];
    curPage.isLock = true;
    curPage.page_number++;
    return curPage;
  }

  async resetBrowser() {
    if (!this.browser || !this.url) {
      console.log('browser准备重启');
      await this.Init();
      console.log('browser重启完毕');
    }
  }
}

export const AllBrowserService = [BrowserService, BrowserServiceMult];
