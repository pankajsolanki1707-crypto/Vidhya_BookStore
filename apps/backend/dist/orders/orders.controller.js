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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("database");
let OrdersController = class OrdersController {
    async getOrders() {
        return database_1.prisma.order.findMany({
            include: { items: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    async placeOrder(body) {
        const { customerName, phone, telegram, address, city, state, pincode, items, totalAmount, paymentMethod, paymentReference } = body;
        if (!customerName || !phone || !address || !city || !state || !pincode || !items || !items.length || !totalAmount) {
            throw new common_1.HttpException('Missing required checkout shipping details', common_1.HttpStatus.BAD_REQUEST);
        }
        const orderId = `VBS-${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(1000 + Math.random() * 9000)}`;
        return database_1.prisma.order.create({
            data: {
                id: orderId,
                customerName,
                phone,
                telegram: telegram || '',
                address,
                city,
                state,
                pincode,
                totalAmount: parseFloat(totalAmount),
                paymentMethod,
                paymentReference: paymentReference || '',
                status: 'Pending',
                items: {
                    create: items.map((item) => ({
                        productId: item.id,
                        quantity: parseInt(item.quantity),
                        price: parseFloat(item.price)
                    }))
                }
            },
            include: { items: true }
        });
    }
    async updateStatus(id, body) {
        const { status } = body;
        if (!status) {
            throw new common_1.HttpException('Status is required', common_1.HttpStatus.BAD_REQUEST);
        }
        const order = await database_1.prisma.order.findUnique({ where: { id } });
        if (!order) {
            throw new common_1.HttpException('Order not found', common_1.HttpStatus.NOT_FOUND);
        }
        return database_1.prisma.order.update({
            where: { id },
            data: { status },
            include: { items: true }
        });
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "placeOrder", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateStatus", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders')
], OrdersController);
//# sourceMappingURL=orders.controller.js.map