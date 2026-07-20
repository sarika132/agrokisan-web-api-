import { ProductModel, IProduct } from "../models/product.model";

export class ProductMongoRepository {
    // get all products for public listing
    async getAll(): Promise<IProduct[]> {
        return ProductModel.find({ isAvailable: true })
            .populate("categoryId", "name")
            .lean() as unknown as IProduct[];
    }

    // get single product by id
    async getProductById(id: string): Promise<IProduct | null> {
        return ProductModel.findById(id)
            .populate("categoryId", "name")
            .lean() as unknown as IProduct | null;
    }

    // create a new product
    async createProduct(data: Partial<IProduct>): Promise<IProduct> {
        const product = new ProductModel(data);
        return await product.save();
    }

    // update a product by id
    async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
        return ProductModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        })
            .populate("categoryId", "name")
            .lean() as unknown as IProduct | null;
    }

    // delete a product by id
    async delete(id: string): Promise<boolean> {
        const result = await ProductModel.findByIdAndDelete(id);
        return !!result;
    }

    // get paginated products with optional search for admin dashboard
    async getAllPaginated(
        page: number,
        limit: number,
        search?: string,
    ): Promise<{ data: IProduct[]; total: number }> {
        const skip = (page - 1) * limit;
        const filter: Record<string, any> = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const [data, total] = await Promise.all([
            ProductModel.find(filter)
                .populate("categoryId", "name")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            ProductModel.countDocuments(filter),
        ]);

        return { data: data as unknown as IProduct[], total };
    }
}