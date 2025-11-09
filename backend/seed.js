import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const products = [
  {
    name: "Fresh Apples",
    description: "Red delicious apples, crisp and sweet",
    price: 150,
    category: "Fruits & Vegetables",
    stock: 50,
    unit: "kg",
  },
  {
    name: "Bananas",
    description: "Fresh yellow bananas, perfect for breakfast",
    price: 60,
    category: "Fruits & Vegetables",
    stock: 80,
    unit: "kg",
  },
  {
    name: "Tomatoes",
    description: "Fresh red tomatoes, perfect for cooking",
    price: 80,
    category: "Fruits & Vegetables",
    stock: 40,
    unit: "kg",
  },
  {
    name: "Milk",
    description: "Fresh full cream milk, 1 liter",
    price: 60,
    category: "Dairy & Eggs",
    stock: 100,
    unit: "l",
  },
  {
    name: "Eggs",
    description: "Farm fresh eggs, 12 pieces",
    price: 90,
    category: "Dairy & Eggs",
    stock: 60,
    unit: "pack",
  },
  {
    name: "Butter",
    description: "Creamy butter, 200g",
    price: 120,
    category: "Dairy & Eggs",
    stock: 45,
    unit: "pack",
  },
  {
    name: "Bread",
    description: "Fresh white bread loaf",
    price: 40,
    category: "Bakery",
    stock: 30,
    unit: "piece",
  },
  {
    name: "Cookies",
    description: "Sweet chocolate cookies, 200g",
    price: 50,
    category: "Bakery",
    stock: 55,
    unit: "pack",
  },
  {
    name: "Rice",
    description: "Basmati rice, premium quality, 1kg",
    price: 120,
    category: "Pantry",
    stock: 75,
    unit: "kg",
  },
  {
    name: "Wheat Flour",
    description: "Fine wheat flour, 1kg",
    price: 45,
    category: "Pantry",
    stock: 90,
    unit: "kg",
  },
  {
    name: "Sugar",
    description: "White granulated sugar, 1kg",
    price: 50,
    category: "Pantry",
    stock: 70,
    unit: "kg",
  },
  {
    name: "Cooking Oil",
    description: "Refined sunflower oil, 1 liter",
    price: 140,
    category: "Pantry",
    stock: 50,
    unit: "l",
  },
  {
    name: "Chicken Breast",
    description: "Fresh chicken breast, 500g",
    price: 250,
    category: "Meat & Seafood",
    stock: 25,
    unit: "kg",
  },
  {
    name: "Fish",
    description: "Fresh sea fish, 500g",
    price: 300,
    category: "Meat & Seafood",
    stock: 20,
    unit: "kg",
  },
  {
    name: "Mineral Water",
    description: "Pure mineral water, 1 liter",
    price: 20,
    category: "Beverages",
    stock: 200,
    unit: "l",
  },
  {
    name: "Orange Juice",
    description: "Fresh orange juice, 1 liter",
    price: 100,
    category: "Beverages",
    stock: 40,
    unit: "l",
  },
  {
    name: "Potato Chips",
    description: "Crispy potato chips, 150g",
    price: 30,
    category: "Snacks",
    stock: 100,
    unit: "pack",
  },
  {
    name: "Biscuits",
    description: "Sweet cream biscuits, 200g",
    price: 35,
    category: "Snacks",
    stock: 85,
    unit: "pack",
  },
  {
    name: "Ice Cream",
    description: "Vanilla ice cream, 500ml",
    price: 150,
    category: "Frozen Foods",
    stock: 30,
    unit: "pack",
  },
  {
    name: "Frozen Peas",
    description: "Frozen green peas, 500g",
    price: 80,
    category: "Frozen Foods",
    stock: 40,
    unit: "pack",
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");

    // Clear existing products (optional - remove this line if you want to keep existing products)
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log(`Found ${existingProducts} existing products. Skipping seed.`);
      console.log("To reseed, delete products first or modify this script.");
      process.exit(0);
    }

    await Product.insertMany(products);

    console.log(`✅ Successfully seeded ${products.length} products!`);
    console.log("\nProducts added:");
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₹${product.price}/${product.unit}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();

