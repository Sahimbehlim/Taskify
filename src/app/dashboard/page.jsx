"use client";

import { useAuth } from "@/context/AppContext";
import { format, isBefore } from "date-fns";
import { UserCheck, UserPlus, CalendarX, Bell } from "lucide-react";
import { useEffect, useState } from "react";

export default function OverviewPage() {
  const { user, tasks } = useAuth();

  const [assignedTasks, setAssignedTasks] = useState([]);
  const [createdTasks, setCreatedTasks] = useState(tasks);
  const [overdueTasks, setOverdueTasks] = useState([]);

  useEffect(() => {
    if (!user || !tasks) return;

    const overdue = tasks.filter((task) =>
      isBefore(new Date(task.dueDate), new Date())
    );

    setCreatedTasks(tasks);
    setOverdueTasks(overdue);
  }, [user, tasks]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Overview</h1>
      <div className="grid auto-rows-min gap-4 lg:grid-cols-3">
        <Card
          title="Tasks Assigned to Me"
          icon={<UserCheck className="text-blue-600" />}
          count={assignedTasks.length}
        />
        <Card
          title="Tasks I Created"
          icon={<UserPlus className="text-green-600" />}
          count={createdTasks.length}
        />
        <Card
          title="Overdue Tasks"
          icon={<CalendarX className="text-red-600" />}
          count={overdueTasks.length}
        />
      </div>

      <div className="flex-1 rounded-xl bg-muted/50 min-h-min p-4 mt-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-muted-foreground" />
          Task Notifications (Assigned to Me)
        </h2>
        {assignedTasks.length === 0 ? (
          <p className="text-muted-foreground">No tasks assigned to you.</p>
        ) : (
          <ul className="space-y-3">
            {assignedTasks.map((task) => (
              <li
                key={task._id}
                className="border rounded-lg p-3 bg-white shadow"
              >
                <div className="font-semibold">{task.title}</div>
                <div className="text-sm text-muted-foreground">
                  Due: {format(new Date(task.dueDate), "PPP")}
                </div>
                <div className="text-sm text-muted-foreground">
                  Priority: {task.priority}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function Card({ title, count, icon }) {
  return (
    <div className="rounded-xl bg-muted/50 p-4 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        <div className="w-6 h-6">{icon}</div>
      </div>
      <p className="text-4xl font-bold mt-auto">{count}</p>
    </div>
  );
}
