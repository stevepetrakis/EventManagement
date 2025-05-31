import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getTest(): {
        message: string;
        timestamp: string;
    };
    hello(): {
        message: string;
    };
}
