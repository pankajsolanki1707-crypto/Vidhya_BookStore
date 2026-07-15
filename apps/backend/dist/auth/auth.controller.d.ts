export declare class AuthController {
    private otps;
    login(body: any): Promise<{
        success: boolean;
        is2faRequired: boolean;
        tempReference: any;
        otp: string;
        role?: undefined;
        token?: undefined;
    } | {
        success: boolean;
        role: string;
        token: string;
        is2faRequired?: undefined;
        tempReference?: undefined;
        otp?: undefined;
    }>;
    register(body: any): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyOtp(body: any): Promise<{
        success: boolean;
        role: string;
        token: string;
    }>;
}
