import { GridSkeleton } from "@/components/ProductGrid";

// loading.tsx = automatic Suspense boundary for this segment (and [id] below it)
export default function Loading() {
  return <GridSkeleton />;
}
