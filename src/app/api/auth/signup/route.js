import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    // Validate request
    if (!name || !email || !password) {
      return Response.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return Response.json({ error: "User already exists." }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return Response.json(
      { message: "User registered successfully." },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Signup Error:", err);
    return Response.json({ err: "Internal Server Error." }, { status: 500 });
  }
}
