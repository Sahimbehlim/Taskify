import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { getUser } from "@/lib/auth";

export async function GET(req) {
  await connectDB();
  const token = req.cookies.get("token")?.value;
  const user = getUser(token);
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const tasks = await Task.find({
    $or: [{ createdBy: user.id }, { assignedTo: user.id }],
  }).populate("assignedTo createdBy", "name email");

  return Response.json({ tasks });
}

export async function POST(req) {
  await connectDB();
  const token = req.cookies.get("token")?.value;
  const user = getUser(token);
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, dueDate, priority, status, assignedTo } = body;

  const task = await Task.create({
    title,
    description,
    dueDate,
    priority,
    status,
    createdBy: user.id,
    assignedTo: assignedTo || null,
  });

  return Response.json({ message: "Task created", task }, { status: 201 });
}
