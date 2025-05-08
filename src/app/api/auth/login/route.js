import { connectDB } from "@/lib/db";
import { setUser } from "@/lib/auth";
import Task from "@/models/Task";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    const passwordMatch =
      user && (await bcrypt.compare(password, user.password));

    if (!user || !passwordMatch) {
      return Response.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Create JWT token
    const token = setUser(user);

    // Fetch user's tasks
    const tasks = await Task.find({ createdBy: user.id });

    // Send cookie securely
    const cookie = `token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`;

    return new Response(
      JSON.stringify({
        message: "Login successfull",
        user: { id: user._id, name: user.name, email: user.email },
        tasks,
      }),
      {
        status: 200,
        headers: {
          "Set-Cookie": cookie,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("❌ Login Error:", error);
    return Response.json({ error: "Internal Server Error." }, { status: 500 });
  }
}
