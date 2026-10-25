import "dotenv/config";
import mongoose from "mongoose";
import { Product } from "../models/Product";

const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/600`;

const products = [
  { title: "Noise-Cancelling Headphones", category: "Audio", price: 7999, stock: 25, image: img("headphones"), description: "Over-ear wireless headphones with 30h battery and active noise cancelling." },
  { title: "Mechanical Keyboard", category: "Accessories", price: 4499, stock: 40, image: img("keyboard"), description: "Hot-swappable 75% board with tactile switches." },
  { title: "Portable Bluetooth Speaker", category: "Audio", price: 2999, stock: 60, image: img("speaker"), description: "Waterproof speaker with 12h playtime." },
  { title: "27\" 4K Monitor", category: "Displays", price: 21999, stock: 12, image: img("monitor"), description: "IPS panel, 60Hz, USB-C power delivery." },
  { title: "Ergonomic Mouse", category: "Accessories", price: 1999, stock: 80, image: img("mouse"), description: "Vertical wireless mouse that is easier on the wrist." },
  { title: "USB-C Hub 8-in-1", category: "Accessories", price: 2499, stock: 50, image: img("hub"), description: "HDMI, SD, USB-A and 100W pass-through charging." },
  { title: "Webcam 1080p", category: "Displays", price: 3499, stock: 30, image: img("webcam"), description: "Autofocus webcam with dual mics." },
  { title: "True Wireless Earbuds", category: "Audio", price: 3999, stock: 45, image: img("earbuds"), description: "Compact earbuds with transparency mode." },
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);
  await Product.deleteMany({});
  await Product.insertMany(
    products.map((p) => ({ ...p, slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") }))
  );
  console.log(`Seeded ${products.length} products`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
