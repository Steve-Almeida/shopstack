// Route group (auth): URLs stay /login and /signup, but share this centered layout.
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return <main className="flex min-h-[70vh] items-center justify-center px-4 py-10">{children}</main>;
}
