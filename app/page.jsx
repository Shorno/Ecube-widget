import { redirect } from "next/navigation";
import { cookies } from "next/headers";

function decodeJwt(token) {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b64));
  } catch { return null; }
}

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (token) {
    const payload = decodeJwt(token);
    if (payload?.userId && payload?.exp * 1000 > Date.now()) {
      redirect(`/${payload.userId}/controller`);
    }
  }

  redirect("/login");
}
