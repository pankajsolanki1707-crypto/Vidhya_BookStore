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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("database");
let ProductsController = class ProductsController {
    async getProducts(query, category, format, page = '1', limit = '12') {
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        const where = {};
        if (category)
            where.category = category;
        if (format)
            where.format = format;
        if (query) {
            const isSqlite = database_1.prisma._activeProvider === 'sqlite';
            where.OR = [
                { title: { contains: query, ...(isSqlite ? {} : { mode: 'insensitive' }) } },
                { author: { contains: query, ...(isSqlite ? {} : { mode: 'insensitive' }) } },
                { isbn: { contains: query, ...(isSqlite ? {} : { mode: 'insensitive' }) } }
            ];
        }
        const [products, total] = await Promise.all([
            database_1.prisma.product.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
            database_1.prisma.product.count({ where })
        ]);
        return {
            products,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / take)
        };
    }
    async getProduct(id) {
        const product = await database_1.prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new common_1.HttpException('Product not found in catalog', common_1.HttpStatus.NOT_FOUND);
        }
        return product;
    }
    async addProduct(body) {
        const { id, title, author, price, category, format, image, description } = body;
        if (!title || !author || price === undefined || !category || !format || !image) {
            throw new common_1.HttpException('Missing required product parameters', common_1.HttpStatus.BAD_REQUEST);
        }
        const productId = id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(Math.random() * 1000);
        return database_1.prisma.product.create({
            data: {
                id: productId,
                title,
                author,
                publisher: body.publisher || '',
                price: parseFloat(price),
                originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
                category,
                subcategory: body.subcategory || '',
                format,
                image,
                description: description || '',
                stockCount: body.stockCount ? parseInt(body.stockCount) : 10,
                inStock: body.stockCount ? parseInt(body.stockCount) > 0 : true,
                isbn: body.isbn || '',
                pages: body.pages ? parseInt(body.pages) : 0,
                publishYear: body.publishYear ? parseInt(body.publishYear) : new Date().getFullYear(),
                featured: !!body.featured,
                isBestseller: !!body.isBestseller,
                isNewArrival: !!body.isNewArrival
            }
        });
    }
    async updateProduct(id, body) {
        const product = await database_1.prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new common_1.HttpException('Product not found in database', common_1.HttpStatus.NOT_FOUND);
        }
        const data = {};
        if (body.title !== undefined)
            data.title = body.title;
        if (body.author !== undefined)
            data.author = body.author;
        if (body.publisher !== undefined)
            data.publisher = body.publisher;
        if (body.price !== undefined)
            data.price = parseFloat(body.price);
        if (body.originalPrice !== undefined)
            data.originalPrice = parseFloat(body.originalPrice);
        if (body.category !== undefined)
            data.category = body.category;
        if (body.subcategory !== undefined)
            data.subcategory = body.subcategory;
        if (body.format !== undefined)
            data.format = body.format;
        if (body.image !== undefined)
            data.image = body.image;
        if (body.description !== undefined)
            data.description = body.description;
        if (body.stockCount !== undefined) {
            data.stockCount = parseInt(body.stockCount);
            data.inStock = data.stockCount > 0;
        }
        if (body.isbn !== undefined)
            data.isbn = body.isbn;
        if (body.pages !== undefined)
            data.pages = parseInt(body.pages);
        if (body.publishYear !== undefined)
            data.publishYear = parseInt(body.publishYear);
        if (body.featured !== undefined)
            data.featured = !!body.featured;
        if (body.isBestseller !== undefined)
            data.isBestseller = !!body.isBestseller;
        if (body.isNewArrival !== undefined)
            data.isNewArrival = !!body.isNewArrival;
        return database_1.prisma.product.update({ where: { id }, data });
    }
    async deleteProduct(id) {
        const product = await database_1.prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new common_1.HttpException('Product not found', common_1.HttpStatus.NOT_FOUND);
        }
        await database_1.prisma.product.delete({ where: { id } });
        return { success: true, message: 'Product deleted from database successfully' };
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('format')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProduct", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "addProduct", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteProduct", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products')
], ProductsController);
//# sourceMappingURL=products.controller.js.map