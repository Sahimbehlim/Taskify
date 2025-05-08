import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { getUser } from "@/lib/auth";

// Helper to validate user
async function getAuthenticatedUser(req) {
  const token = req.cookies.get("token")?.value;
  const user = getUser(token);
  if (!user || user.error) return null;
  return user;
}

export async function GET(req) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  await connectDB();

  try {
    const tasks = await Task.find({ createdBy: user.id });

    return new Response(JSON.stringify({ user, tasks }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch tasks:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch tasks" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  await connectDB();

  try {
    const body = await req.json();
    const { title, description, dueDate, priority, status } = body;

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      createdBy: user.id,
    });

    return new Response(JSON.stringify({ message: "Task created", task }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Task creation error:", error.message);
    return new Response(JSON.stringify({ error: "Failed to create task" }), {
      status: 500,
    });
  }
}
