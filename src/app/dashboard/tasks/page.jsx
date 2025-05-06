"use client";

import TaskTable from "@/components/task-table/TaskTable";

export default function TasksPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">All Tasks</h1>
      <TaskTable />
    </>
  );
}
