import { z } from "zod";

export const productInput = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(2000).default(""),
  price: z.coerce.number().int().min(0),
  category: z.string().min(2).max(40),
  image: z.string().url(),
  stock: z.coerce.number().int().min(0),
});

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") +
  "-" +
  Math.random().toString(36).slice(2, 6);
