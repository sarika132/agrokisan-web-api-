import { ReviewModel, IReview } from "../models/review.model";

export interface IReviewRepository {
    createReview(review: Partial<IReview>): Promise<IReview>;
    getReviewById(id: string): Promise<IReview | null>;
    getReviewsByProductId(productId: string): Promise<IReview[]>;
    getReviewByCustomerAndProduct(
        customerId: string,
        productId: string,
    ): Promise<IReview | null>;
    update(id: string, review: Partial<IReview>): Promise<IReview | null>;
    delete(id: string): Promise<boolean>;
    getAllPaginated(
        page: number,
        limit: number,
    ): Promise<{ data: IReview[]; total: number }>;
    getFeaturedReviews(limit: number): Promise<IReview[]>;
}

export class ReviewMongoRepository implements IReviewRepository {
    async createReview(review: Partial<IReview>): Promise<IReview> {
        const created = await ReviewModel.create(review);
        return created;
    }

    async getReviewById(id: string): Promise<IReview | null> {
        // populate customer so we get full user object not just id
        const found = await ReviewModel.findById(id)
            .populate("customerId", "-password")
            .populate("productId");
        return found;
    }

    // get all reviews for a specific product - used on product detail page
    async getReviewsByProductId(productId: string): Promise<IReview[]> {
        const found = await ReviewModel.find({ productId })
            .populate("customerId", "-password")
            .sort({ createdAt: -1 });
        return found;
    }

    // check if customer already reviewed this product - prevents duplicate reviews
    async getReviewByCustomerAndProduct(
        customerId: string,
        productId: string,
    ): Promise<IReview | null> {
        const found = await ReviewModel.findOne({ customerId, productId });
        return found;
    }

    async update(id: string, review: Partial<IReview>): Promise<IReview | null> {
        const updated = await ReviewModel.findByIdAndUpdate(id, review, {
            new: true,
        });
        return updated;
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await ReviewModel.findByIdAndDelete(id);
        return !!deleted;
    }

    // get all reviews with pagination for admin dashboard
    async getAllPaginated(
        page: number,
        limit: number,
    ): Promise<{ data: IReview[]; total: number }> {
        const total = await ReviewModel.countDocuments();
        const data = await ReviewModel.find()
            .populate("customerId", "-password")
            .populate("productId")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
        return { data, total };
    }

    // get top-rated recent reviews across all products - used on homepage
    async getFeaturedReviews(limit: number): Promise<IReview[]> {
        const found = await ReviewModel.find({ rating: { $gte: 4 } })
            .populate("customerId", "-password")
            .populate("productId")
            .sort({ createdAt: -1 })
            .limit(limit);
        return found;
    }
}