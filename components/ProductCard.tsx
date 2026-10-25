import Image from "next/image";
import Link from "next/link";
import { ProductDTO } from "@/models/Product";
import { inr } from "@/lib/format";
import styles from "./ProductCard.module.css";

// Exp 2 / 9: CSS Module for isolated styling + next/image for responsive assets
export default function ProductCard({ product }: { product: ProductDTO }) {
  return (
    <Link href={`/products/${product.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={styles.image}
        />
        {product.stock === 0 && <span className={styles.badge}>Sold out</span>}
      </div>
      <div className="p-3">
        <p className="text-xs uppercase tracking-wide text-neutral-500">{product.category}</p>
        <h3 className="mt-0.5 font-medium">{product.title}</h3>
        <p className="mt-1 font-semibold">{inr(product.price)}</p>
      </div>
    </Link>
  );
}
