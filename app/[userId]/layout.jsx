import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import { buildThemeCss } from "@/lib/design/catalog";

export default async function UserLayout({ children, params }) {
  const { userId } = await params;

  let themeConfig = null;
  try {
    await connectDB();
    const user = await User.findById(userId).lean();
    themeConfig = user?.themeConfig ?? null;
  } catch {
    // Non-fatal — fall back to default theme
  }

  const themeCss = buildThemeCss(themeConfig);

  return (
    <>
      <style>{themeCss}</style>
      {children}
    </>
  );
}
