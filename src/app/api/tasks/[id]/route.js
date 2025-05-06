import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { getUser } from "@/lib/auth";

export async function PUT(req, { params }) {
  await connectDB();
  const token = req.cookies.get("token")?.value;
  const user = getUser(token);
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const updated = await Task.findByIdAndUpdate(params.id, body, {
    new: true,
  });

  return Response.json({ message: "Task updated", updatedTask: updated });
}

export async function DELETE(req, { params }) {
  await connectDB();
  const token = req.cookies.get("token")?.value;
  const user = getUser(token);
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  await Task.findByIdAndDelete(params.id);
  return Response.json({ message: "Task deleted" });
}
