export declare class OrdersController {
    getOrders(): Promise<({
        items: {
            id: string;
            price: number;
            quantity: number;
            productId: string;
            orderId: string;
        }[];
    } & {
        phone: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        customerName: string;
        telegram: string | null;
        address: string;
        city: string;
        state: string;
        pincode: string;
        totalAmount: number;
        paymentMethod: string;
        paymentReference: string | null;
        status: string;
    })[]>;
    placeOrder(body: any): Promise<{
        items: {
            id: string;
            price: number;
            quantity: number;
            productId: string;
            orderId: string;
        }[];
    } & {
        phone: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        customerName: string;
        telegram: string | null;
        address: string;
        city: string;
        state: string;
        pincode: string;
        totalAmount: number;
        paymentMethod: string;
        paymentReference: string | null;
        status: string;
    }>;
    updateStatus(id: string, body: any): Promise<{
        items: {
            id: string;
            price: number;
            quantity: number;
            productId: string;
            orderId: string;
        }[];
    } & {
        phone: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        customerName: string;
        telegram: string | null;
        address: string;
        city: string;
        state: string;
        pincode: string;
        totalAmount: number;
        paymentMethod: string;
        paymentReference: string | null;
        status: string;
    }>;
}
