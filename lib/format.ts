export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export const siteUrl = () => process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
