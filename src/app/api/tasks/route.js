import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { getUser } from "@/lib/auth";

export async function POST(req) {
  await connectDB();

  const token = req.cookies.get("token")?.value;
  const user = getUser(token);

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { title, description, dueDate, priority, status } = body;

  // Create the task
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
  });
}
