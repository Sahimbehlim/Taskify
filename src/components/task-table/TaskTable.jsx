"use client";

import { useState, useEffect, useCallback } from "react";
import { getColumns } from "./columns";
import { useAuth } from "@/context/AppContext";
import axios from "axios";

import AddEditTaskModal from "./AddEditTaskModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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

export default function TaskTable() {
  const { tasks, setTasks } = useAuth();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    dueDate: "",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState(tasks);

  // 🟢 Add or Edit Task
  const handleAddEdit = useCallback(
    async (taskData) => {
      try {
        setLoading(true);
        let response;
        if (editingTask) {
          // Update
          response = await axios.put(
            `/api/tasks/${editingTask._id}`,
            taskData,
            {
              withCredentials: true,
            }
          );
          setTasks((prev) =>
            prev.map((task) =>
              task._id === response.data.updatedTask._id
                ? response.data.updatedTask
                : task
            )
          );
        } else {
          // Create
          response = await axios.post("/api/tasks", taskData, {
            withCredentials: true,
          });
          setTasks((prev) => [...prev, response.data.task]);
        }
        setModalOpen(false);
        setEditingTask(null);
      } catch (err) {
        console.error("Error saving task", err);
      } finally {
        setLoading(false);
      }
    },
    [editingTask, setTasks]
  );

  const handleDelete = useCallback(
    async (id) => {
      if (!confirm("Are you sure to delete?")) return;

      try {
        await axios.delete(`/api/tasks/${id}`, { withCredentials: true });
        setTasks((prev) => prev.filter((task) => task._id !== id));
      } catch (err) {
        console.error("Error deleting task", err);
      }
    },
    [setTasks]
  );

  // Reset Filters
  const handleResetFilters = () => {
    setFilters({
      status: "",
      priority: "",
      dueDate: "",
    });
  };

  const filterTasks = useCallback(() => {
    const newFilteredTasks = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = !filters.status || task.status === filters.status;
      const matchesPriority =
        !filters.priority || task.priority === filters.priority;
      const matchesDueDate =
        !filters.dueDate || task.dueDate.split("T")[0] === filters.dueDate;

      return (
        matchesSearch && matchesStatus && matchesPriority && matchesDueDate
      );
    });

    setFilteredTasks(newFilteredTasks);
  }, [search, filters, tasks]);

  useEffect(() => {
    filterTasks();
  }, [filterTasks]);

  const columns = getColumns({
    onEdit: (task) => {
      setEditingTask(task);
      setModalOpen(true);
    },
    onDelete: handleDelete,
  });

  const table = useReactTable({
    data: filteredTasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4 sm:gap-0">
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-1/3"
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

      <div className="mt-4 flex items-center justify-between gap-2 sm:gap-0 overflow-x-auto">
        {/* Filters Dropdown */}
        <div className="flex gap-2 sm:gap-4">
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.priority}
            onValueChange={(value) =>
              setFilters({ ...filters, priority: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.dueDate}
            onValueChange={(value) =>
              setFilters({ ...filters, dueDate: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Due Date" />
            </SelectTrigger>
            <SelectContent>
              {tasks.map((task, index) => {
                return (
                  <SelectItem key={index} value={task.dueDate.split("T")[0]}>
                    {task.dueDate.split("T")[0]}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={handleResetFilters}>
          Reset
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
