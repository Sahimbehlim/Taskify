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

export async function PUT(req, { params }) {
  const user = await getAuthenticatedUser(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  try {
    const body = await req.json();
    const updated = await Task.findByIdAndUpdate(
      { _id: params.id, createdBy: user.id },
      body,
      { new: true }
    );

    if (!updated) {
      return Response.json(
        { error: "Task not found or not authorized" },
        { status: 404 }
      );
    }

    return Response.json({ message: "Task updated", updatedTask: updated });
  } catch (error) {
    console.error("Update error:", error.message);
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const user = await getAuthenticatedUser(req);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  try {
    const deleted = await Task.findByIdAndDelete({
      _id: params.id,
      createdBy: user.id,
    });

    if (!deleted) {
      return Response.json(
        { error: "Task not found or not authorized" },
        { status: 404 }
      );
    }

    return Response.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Delete error:", error.message);
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
}
