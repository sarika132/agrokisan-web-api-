import { CartModel, ICart } from "../models/cart.model";

export class CartMongoRepository {
    // create a new cart item
    async createCartItem(data: Partial<ICart>): Promise<ICart> {
        const cart = new CartModel(data);
        return await cart.save();
    }

    // get a single cart item by mongodb id
    async getCartItemById(id: string): Promise<ICart | null> {
        return CartModel.findById(id)
            .populate("productId", "name price category")
            .populate("customerId", "fullName email")
            .lean() as unknown as ICart | null;
    }

    // get all active cart items for a specific customer
    async getCartByCustomerId(customerId: string): Promise<ICart[]> {
        return CartModel.find({ customerId, status: "active" })
            .populate("productId", "name price category profileImage")
            .lean() as unknown as ICart[];
    }

    // get all cart items for admin with pagination, search, and status filter
    async getAllPaginated(
        page: number,
        limit: number,
        search?: string,
        status?: string,
    ): Promise<{ data: ICart[]; total: number }> {
        const skip = (page - 1) * limit;
        const filter: Record<string, any> = {};

        if (status) {
            filter.status = status;
        }

        // search by cartId only (customer search happens via populate,
        // but simple text search on cartId is most practical here)
        if (search) {
            filter.cartId = { $regex: search, $options: "i" };
        }

        const [data, total] = await Promise.all([
            CartModel.find(filter)
                .populate("productId", "name price category")
                .populate("customerId", "fullName email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            CartModel.countDocuments(filter),
        ]);

        return { data: data as unknown as ICart[], total };
    }

    // update cart item quantity and recalculate totalPrice
    async updateCartItem(
        id: string,
        quantity: number,
        totalPrice: number,
    ): Promise<ICart | null> {
        return CartModel.findByIdAndUpdate(
            id,
            { quantity, totalPrice },
            { new: true, runValidators: true },
        )
            .populate("productId", "name price category")
            .lean() as unknown as ICart | null;
    }

    // update cartId after creation (same pattern as teacher's updateBookingId)
    async updateCartId(id: string, cartId: string): Promise<void> {
        await CartModel.findByIdAndUpdate(id, { cartId });
    }

    // update status of a cart item
    async updateStatus(
        id: string,
        status: "active" | "checkedout" | "cancelled",
    ): Promise<ICart | null> {
        return CartModel.findByIdAndUpdate(
            id,
            { status },
            { new: true },
        )
            .populate("productId", "name price category")
            .lean() as unknown as ICart | null;
    }

    // remove a cart item permanently
    async deleteCartItem(id: string): Promise<ICart | null> {
        return CartModel.findByIdAndDelete(id).lean() as unknown as ICart | null;
    }
}