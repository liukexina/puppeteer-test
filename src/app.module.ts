import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AllBrowserService } from './browser.service'
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ...AllBrowserService],
})
export class AppModule {}
