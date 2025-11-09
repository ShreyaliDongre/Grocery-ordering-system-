import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a product description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a product price"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Please provide a product category"],
      enum: [
        "Fruits & Vegetables",
        "Dairy & Eggs",
        "Meat & Seafood",
        "Bakery",
        "Beverages",
        "Snacks",
        "Frozen Foods",
        "Pantry",
        "Other",
      ],
    },
    image: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      required: [true, "Please provide stock quantity"],
      min: 0,
      default: 0,
    },
    unit: {
      type: String,
      required: [true, "Please provide a unit"],
      enum: ["kg", "g", "l", "ml", "piece", "pack"],
      default: "piece",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;

