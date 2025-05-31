import { DbService } from '../db/db.service';
export declare class AuthService {
    private readonly dbService;
    constructor(dbService: DbService);
    login(loginDto: any): Promise<{
        success: boolean;
        message: string;
        user?: undefined;
        userType?: undefined;
        token?: undefined;
    } | {
        success: boolean;
        message: string;
        user: any;
        userType: any;
        token: string;
    }>;
    validateToken(token: string): Promise<{
        success: boolean;
        message: string;
        user?: undefined;
        userType?: undefined;
    } | {
        success: boolean;
        user: any;
        userType: any;
        message?: undefined;
    }>;
    getCreatorId(userId: string): Promise<{
        success: boolean;
        message: string;
        creator_id?: undefined;
    } | {
        success: boolean;
        creator_id: any;
        message?: undefined;
    }>;
    private generateSimpleToken;
    private decodeSimpleToken;
}
