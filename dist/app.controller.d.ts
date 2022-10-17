import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    login(): Promise<string>;
    interception(): Promise<void>;
    evaluate(): Promise<void>;
    iframe(): Promise<void>;
    trace(): Promise<void>;
    upload(): Promise<void>;
    emulate(): Promise<void>;
    image_pdf(): Promise<void>;
}
