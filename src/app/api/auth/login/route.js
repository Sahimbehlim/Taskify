import { setUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json({ message: "Missing fields" }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = setUser(user);

    const tasks = await Task.find({ createdBy: user.id });

    return new Response(
      JSON.stringify({
        message: "Login success",
        user: { id: user._id, name: user.name, email: user.email },
        tasks,
      }),
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return Response.json({ message: "Login failed" }, { status: 500 });
  }
}
