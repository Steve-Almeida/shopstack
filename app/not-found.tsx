import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-2 text-neutral-500">That page doesn&apos;t exist.</p>
      <Link href="/" className="mt-4 inline-block underline">Back home</Link>
    </div>
  );
}
