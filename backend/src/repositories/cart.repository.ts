import { CartModel, ICart } from "../models/cart.model";

export class CartMongoRepository {
    // create a new cart item
    async createCartItem(data: Partial<ICart>): Promise<ICart> {
        const cart = new CartModel(data);
        return await cart.save();
    }

    // For public display (populated)
    async getCartItemById(id: string): Promise<ICart | null> {
        return CartModel.findById(id)
            .populate("productId", "name price category")
            .populate("customerId", "fullName email")
            .lean() as unknown as ICart | null;
    }

    async getCartItemRaw(id: string): Promise<ICart | null> {
        return CartModel.findById(id).select('customerId status priceAtAdded quantity').lean() as unknown as ICart | null;
    }

    async getCartByCustomerId(customerId: string): Promise<ICart[]> {
        return CartModel.find({ customerId, status: "active" })
            .populate("productId", "name price category profileImage")
            .lean() as unknown as ICart[];
    }

    async getAllPaginated(
        page: number,
        limit: number,
        search?: string,
        status?: string,
    ): Promise<{ data: ICart[]; total: number }> {
        const skip = (page - 1) * limit;
        const filter: Record<string, any> = {};
        if (status) filter.status = status;
        if (search) filter.cartId = { $regex: search, $options: "i" };

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

    async updateCartItem(
        id: string,
        quantity: number,
        totalPrice: number,
    ): Promise<ICart | null> {
        return CartModel.findByIdAndUpdate(
            id,
            { quantity, totalPrice },
            { returnDocument: 'after', runValidators: true }
        )
            .populate("productId", "name price category")
            .lean() as unknown as ICart | null;
    }

    async updateCartId(id: string, cartId: string): Promise<void> {
        await CartModel.findByIdAndUpdate(id, { cartId });
    }

    async updateStatus(
        id: string,
        status: "active" | "checkedout" | "cancelled",
    ): Promise<ICart | null> {
        return CartModel.findByIdAndUpdate(
            id,
            { status },
            { returnDocument: 'after' }
        )
            .populate("productId", "name price category")
            .lean() as unknown as ICart | null;
    }

    async deleteCartItem(id: string): Promise<ICart | null> {
        return CartModel.findByIdAndDelete(id).lean() as unknown as ICart | null;
    }
}