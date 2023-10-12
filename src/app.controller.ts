import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/login')
  async login() {
    return await this.appService.login();
  }

  @Get('/interception')
  async interception() {
    return await this.appService.interception();
  }

  @Get('/evaluate')
  async evaluate() {
    return await this.appService.evaluate();
  }

  @Get('/iframe')
  async iframe() {
    return await this.appService.iframe();
  }

  @Get('/trace')
  async trace() {
    return await this.appService.trace();
  }

  @Get('/upload')
  async upload() {
    return await this.appService.upload();
  }

  @Get('/emulate')
  async emulate() {
    return await this.appService.emulate();
  }

  @Get('/image_pdf')
  async image_pdf() {
    return await this.appService.image_pdf();
  }
}