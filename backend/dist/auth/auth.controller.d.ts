import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    validateToken(validateTokenDto: any): Promise<{
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
    logout(): Promise<{
        success: boolean;
        message: string;
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
}
