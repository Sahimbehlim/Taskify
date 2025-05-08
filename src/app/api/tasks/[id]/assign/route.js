import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { getUser } from "@/lib/auth";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const token = req.cookies.get("token")?.value;
  const user = getUser(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const taskId = params.id;
    const { assignedTo } = await req.json();

    if (!assignedTo) {
      return NextResponse.json(
        { error: "Assigned user is required" },
        { status: 400 }
      );
    }

    const task = await Task.findById(taskId);
    if (!task)
      return NextResponse.json({ error: "Task not found" }, { status: 404 });

    if (task.assignedTo) {
      return NextResponse.json(
        { error: "Task already assigned" },
        { status: 400 }
      );
    }

    task.assignedTo = assignedTo;
    await task.save();

    await Notification.create({
      user: assignedTo,
      message: `You have been assigned a new task: ${task.title}`,
      taskId: task._id,
    });

    return NextResponse.json({
      message: "Task assigned and user notified",
    });
  } catch (error) {
    console.error("Error assigning task:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
