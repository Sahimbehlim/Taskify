import { getUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  const token = req.cookies.get("token")?.value;
  const decoded = getUser(token);

  if (!decoded || decoded.error) {
    return new Response("Unauthorized", { status: 401 });
  }

  await connectDB();
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  return Response.json({ user });
}
