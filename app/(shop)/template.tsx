// Unlike layout.tsx, template.tsx re-mounts on every navigation —
// handy for enter animations or resetting state per page.
export default function ShopTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-[fadeIn_.25s_ease-out]">{children}</div>;
}
