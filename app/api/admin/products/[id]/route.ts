import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectMongo } from "@/lib/mongo";
import { Product, toDTO } from "@/models/Product";
import { getRole } from "@/lib/session";
import { productInput } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Ctx) {
  if ((await getRole()) !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const parsed = productInput.partial().safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  await connectMongo();
  const doc = await Product.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidateTag("products", "max");
  return NextResponse.json({ product: toDTO(doc) });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if ((await getRole()) !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await connectMongo();
  const res = await Product.findByIdAndDelete(id);
  if (!res) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidateTag("products", "max");
  return NextResponse.json({ ok: true });
}
