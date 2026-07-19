import { CartMongoRepository } from "../repositories/cart.repository";
import { AddToCartDTO, UpdateCartDTO } from "../dtos/cart.dto";
import { ICart } from "../models/cart.model";
import { HttpException } from "../exceptions/http-exception";
import { ProductMongoRepository } from "../repositories/products.repository";

const cartRepository = new CartMongoRepository();
const productRepository = new ProductMongoRepository();

export class CartService {
    // add a product to cart - calculates totalPrice and generates custom cartId
    async addToCart(
        data: AddToCartDTO,
        customerId: string,
    ): Promise<ICart> {
        // check if product exists and is available
        const product = await productRepository.getProductById(data.productId);
        if (!product) {
            throw new HttpException(404, "Product not found");
        }
        if (!product.isAvailable) {
            throw new HttpException(400, "Product is not available");
        }

        // calculate total price: quantity * current product price
        const priceAtAdded = product.price;
        const totalPrice = data.quantity * priceAtAdded;

        // create cart item first to get mongodb _id for generating cartId
        const cartItem = await cartRepository.createCartItem({
            customerId,
            productId: data.productId,
            quantity: data.quantity,
            priceAtAdded,
            totalPrice,
            status: "active",
        } as unknown as Partial<ICart>);

        // generate custom readable cartId using last 6 chars of mongodb _id
        const cartId = "CART" + cartItem._id.toString().slice(-6).toUpperCase();

        // update cart item with the generated cartId
        await cartRepository.updateCartId(cartItem._id.toString(), cartId);

        return { ...cartItem, cartId } as ICart;
    }

    // get a single cart item by mongodb id
    async getCartItemById(id: string): Promise<ICart> {
        const cartItem = await cartRepository.getCartItemById(id);
        if (!cartItem) {
            throw new HttpException(404, "Cart item not found");
        }
        return cartItem;
    }

    // get all active cart items for the logged in customer
    async getMyCart(customerId: string): Promise<ICart[]> {
        return await cartRepository.getCartByCustomerId(customerId);
    }

    // get all cart items for admin with pagination, search and status filter
    async getAllCartsPaginated(
        page: number,
        limit: number,
        search?: string,
        status?: string,
    ): Promise<{ data: ICart[]; total: number }> {
        return await cartRepository.getAllPaginated(page, limit, search, status);
    }

    // update quantity of a cart item - recalculates totalPrice
    async updateCartItem(
        id: string,
        data: UpdateCartDTO,
        customerId: string,
    ): Promise<ICart> {
        const cartItem = await cartRepository.getCartItemById(id);
        if (!cartItem) {
            throw new HttpException(404, "Cart item not found");
        }
        if (cartItem.customerId.toString() !== customerId) {
            throw new HttpException(403, "You can only update your own cart");
        }
        if (cartItem.status !== "active") {
            throw new HttpException(400, "Only active cart items can be updated");
        }

        const totalPrice = data.quantity * cartItem.priceAtAdded;
        const updated = await cartRepository.updateCartItem(
            id,
            data.quantity,
            totalPrice,
        );
        return updated!;
    }

    // checkout cart item - user initiates checkout
    async checkoutCartItem(id: string, customerId: string): Promise<ICart> {
        const cartItem = await cartRepository.getCartItemById(id);
        if (!cartItem) {
            throw new HttpException(404, "Cart item not found");
        }
        if (cartItem.customerId.toString() !== customerId) {
            throw new HttpException(403, "You can only checkout your own cart");
        }
        if (cartItem.status !== "active") {
            throw new HttpException(400, "Only active cart items can be checked out");
        }
        const updated = await cartRepository.updateStatus(id, "checkedout");
        return updated!;
    }

    // cancel cart item - user can only cancel active items
    async cancelCartItem(
        id: string,
        customerId: string,
        isAdmin: boolean,
    ): Promise<ICart> {
        const cartItem = await cartRepository.getCartItemById(id);
        if (!cartItem) {
            throw new HttpException(404, "Cart item not found");
        }
        if (!isAdmin && cartItem.customerId.toString() !== customerId) {
            throw new HttpException(403, "You can only cancel your own cart items");
        }
        if (cartItem.status === "checkedout" || cartItem.status === "cancelled") {
            throw new HttpException(400, "This cart item cannot be cancelled");
        }
        const updated = await cartRepository.updateStatus(id, "cancelled");
        return updated!;
    }

    // remove cart item permanently
    async deleteCartItem(id: string, customerId: string, isAdmin: boolean): Promise<void> {
        const cartItem = await cartRepository.getCartItemById(id);
        if (!cartItem) {
            throw new HttpException(404, "Cart item not found");
        }
        if (!isAdmin && cartItem.customerId.toString() !== customerId) {
            throw new HttpException(403, "You can only delete your own cart items");
        }
        await cartRepository.deleteCartItem(id);
    }
}