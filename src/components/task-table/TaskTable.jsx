"use client";

import { useState } from "react";
import { getColumns } from "./columns";
import AddEditTaskModal from "./AddEditTaskModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import axios from "axios";
import { useAuth } from "@/context/AppContext";

export default function TaskTable() {
  const { user, tasks, setTasks } = useAuth();
  const [search, setSearch] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🟢 Add or Edit Task
  const handleAddEdit = async (taskData) => {
    try {
      setLoading(true);
      if (editingTask) {
        // Update
        const { data } = await axios.put(
          `/api/tasks/${editingTask._id}`,
          taskData,
          {
            withCredentials: true,
          }
        );

        setTasks((prev) =>
          prev.map((task) =>
            task._id === data.updatedTask._id ? data.updatedTask : task
          )
        );
      } else {
        // Create
        const { data } = await axios.post("/api/tasks", taskData, {
          withCredentials: true,
        });
        setTasks((prev) => [...prev, data.task]);
      }
      setModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error("Error saving task", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete?")) return;

    try {
      await axios.delete(`/api/tasks/${id}`, { withCredentials: true });
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  // const filteredTasks = tasks.filter(
  //   (task) =>
  //     task.title.toLowerCase().includes(search.toLowerCase()) ||
  //     task.description.toLowerCase().includes(search.toLowerCase())
  // );

  const columns = getColumns({
    onEdit: (task) => {
      setEditingTask(task);
      setModalOpen(true);
    },
    onDelete: handleDelete,
  });

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />
        <Button
          onClick={() => {
            setEditingTask(null);
            setModalOpen(true);
          }}
          className="cursor-pointer"
        >
          Add Task
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AddEditTaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        loading={loading}
        onSubmit={handleAddEdit}
      />
    </div>
  );
}
