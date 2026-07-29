import { CartMongoRepository } from '../repositories/cart.repository';
import { ProductMongoRepository } from '../repositories/product.repository';
import { HttpException } from '../exceptions/http-exception';

const cartRepo = new CartMongoRepository();
const productRepo = new ProductMongoRepository();

export class CartService {
    async addToCart({ productId, quantity }: { productId: string; quantity: number }, customerId: string) {
        const product = await productRepo.getProductById(productId);
        if (!product) {
            throw new HttpException(404, 'Product not found');
        }
        if (!product.isAvailable) {
            throw new HttpException(400, 'Product is not available');
        }
        if (product.stock < quantity) {
            throw new HttpException(400, 'Insufficient stock');
        }
        const priceAtAdded = product.price;
        const totalPrice = quantity * priceAtAdded;
        const cartItem = await cartRepo.createCartItem({
            customerId,
            productId,
            quantity,
            priceAtAdded,
            totalPrice,
            status: 'active',
        });
        const cartId = `CART${cartItem._id.toString().slice(-6).toUpperCase()}`;
        await cartRepo.updateCartId(cartItem._id.toString(), cartId);
        // Return populated item
        return await cartRepo.getCartItemById(cartItem._id.toString());
    }

    async getMyCart(customerId: string) {
        return cartRepo.getCartByCustomerId(customerId);
    }

    async getCartItemById(id: string) {
        const item = await cartRepo.getCartItemById(id);
        if (!item) {
            throw new HttpException(404, 'Cart item not found');
        }
        return item;
    }

    async updateCartItem(id: string, { quantity }: { quantity: number }, customerId: string) {
        // Use raw to avoid populated `customerId` becoming an object
        const cartItem = await cartRepo.getCartItemRaw(id);
        if (!cartItem) {
            throw new HttpException(404, 'Cart item not found');
        }
        if (cartItem.customerId.toString() !== customerId) {
            throw new HttpException(403, 'You can only update your own cart');
        }
        if (cartItem.status !== 'active') {
            throw new HttpException(400, 'Only active cart items can be updated');
        }
        const totalPrice = quantity * cartItem.priceAtAdded;
        return cartRepo.updateCartItem(id, quantity, totalPrice);
    }

    async checkoutCartItem(id: string, customerId: string) {
        const cartItem = await cartRepo.getCartItemRaw(id);
        if (!cartItem) {
            throw new HttpException(404, 'Cart item not found');
        }
        if (cartItem.customerId.toString() !== customerId) {
            throw new HttpException(403, 'You can only checkout your own cart');
        }
        if (cartItem.status !== 'active') {
            throw new HttpException(400, 'Only active cart items can be checked out');
        }
        return cartRepo.updateStatus(id, 'checkedout');
    }

    async cancelCartItem(id: string, customerId: string, isAdmin: boolean) {
        const cartItem = await cartRepo.getCartItemRaw(id);
        if (!cartItem) {
            throw new HttpException(404, 'Cart item not found');
        }
        if (!isAdmin && cartItem.customerId.toString() !== customerId) {
            throw new HttpException(403, 'You can only cancel your own cart items');
        }
        if (cartItem.status === 'checkedout' || cartItem.status === 'cancelled') {
            throw new HttpException(400, 'This cart item cannot be cancelled');
        }
        return cartRepo.updateStatus(id, 'cancelled');
    }

    async deleteCartItem(id: string, customerId: string, isAdmin: boolean) {
        const cartItem = await cartRepo.getCartItemRaw(id);
        if (!cartItem) {
            throw new HttpException(404, 'Cart item not found');
        }
        if (!isAdmin && cartItem.customerId.toString() !== customerId) {
            throw new HttpException(403, 'You can only delete your own cart items');
        }
        return cartRepo.deleteCartItem(id);
    }

    async getAllCartsPaginated(page: number, limit: number, search?: string, status?: string) {
        return cartRepo.getAllPaginated(page, limit, search, status);
    }
}