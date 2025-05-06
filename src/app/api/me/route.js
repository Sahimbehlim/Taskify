import { getUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import User from "@/models/User";

export async function GET(req) {
  const token = req.cookies.get("token")?.value;
  const decoded = getUser(token);

  if (!decoded || decoded.error) {
    return new Response("Unauthorized", { status: 401 });
  }

  await connectDB();

  const user = await User.findById(decoded.id).select("-password");
  const tasks = await Task.find({ createdBy: user.id });

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  return new Response(JSON.stringify({ user, tasks }));
}
