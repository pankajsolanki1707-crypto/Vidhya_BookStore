export declare class AuthController {
    login(body: any): Promise<{
        success: boolean;
        role: string;
        token: string;
    }>;
    register(body: any): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyOtp(body: any): Promise<{
        success: boolean;
        token: string;
    }>;
}
