export declare class AppService {
    getHello(): string;
    login(): Promise<string>;
    interception(): Promise<void>;
    evaluate(): Promise<void>;
    iframe(): Promise<void>;
    trace(): Promise<void>;
    upload(): Promise<void>;
    emulate(): Promise<void>;
    image_pdf(): Promise<void>;
    waitForFile(fileName: any): Promise<unknown>;
}
