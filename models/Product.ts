import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

// Exp 6: e-commerce catalog schema with Mongoose
const productSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 }, // whole currency units
    category: { type: String, required: true, index: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export type ProductDoc = InferSchemaType<typeof productSchema>;

export const Product: Model<ProductDoc> =
  (mongoose.models.Product as Model<ProductDoc>) ??
  mongoose.model<ProductDoc>("Product", productSchema);

// Plain, serializable shape passed to components
export type ProductDTO = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  tags: string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toDTO(doc: any): ProductDTO {
  return {
    id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    description: doc.description ?? "",
    price: doc.price,
    category: doc.category,
    image: doc.image,
    stock: doc.stock,
    tags: doc.tags ?? [],
  };
}
