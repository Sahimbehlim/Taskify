import Notification from "@/models/Notification";
import { getUser } from "@/lib/auth";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  const token = req.cookies.get("token")?.value;
  const user = getUser(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const notifications = await Notification.find({ user: user.id }).populate(
      "taskId"
    );

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("GET /notifications error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
