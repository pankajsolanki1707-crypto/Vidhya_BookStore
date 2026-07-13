"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
let AuthController = class AuthController {
    async login(body) {
        const { email, password } = body;
        if (!email || !password) {
            throw new common_1.HttpException('Email and password required', common_1.HttpStatus.BAD_REQUEST);
        }
        const adminPassword = process.env.ADMIN_PASSWORD || 'VidhyaBookStoreIndore2026';
        if (email === 'admin@vidhya.com' && password === adminPassword) {
            return { success: true, role: 'admin', token: 'jwt-signed-admin-token-2026' };
        }
        return { success: true, role: 'student', token: `jwt-student-${email}` };
    }
    async register(body) {
        const { email, name, phone } = body;
        if (!email || !name) {
            throw new common_1.HttpException('Email and name are required', common_1.HttpStatus.BAD_REQUEST);
        }
        return { success: true, message: `Account pending email verification for: ${email}` };
    }
    async verifyOtp(body) {
        const { phone, code } = body;
        if (!phone || !code) {
            throw new common_1.HttpException('Phone number and code required', common_1.HttpStatus.BAD_REQUEST);
        }
        if (code === '1234') {
            return { success: true, token: `jwt-signed-phone-${phone}` };
        }
        throw new common_1.HttpException('Invalid verification OTP code', common_1.HttpStatus.UNAUTHORIZED);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth')
], AuthController);
//# sourceMappingURL=auth.controller.js.map