"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/context/AppContext";
import axios from "axios";

export default function Collaboration() {
  const { tasks, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  // Fetch users excluding self
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/api/users", {
          withCredentials: true,
        });
        const filteredUsers = data.users.filter((u) => u._id !== user.id);
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast("Failed to load users.");
      }
    };
    if (user?.id) fetchUsers();
  }, []);

  // Assign task to user
  const handleAssignTask = useCallback(async () => {
    try {
      await axios.patch(
        `/api/tasks/${selectedTaskId}/assign`,
        {
          assignedTo: selectedUserId,
        },
        { withCredentials: true }
      );
      toast("Task assigned successfully!");
    } catch (error) {
      console.error("Error assigning task:", error);
      toast(error.response?.data?.error || "Failed to assign task.");
    } finally {
      setSelectedTaskId("");
      setSelectedUserId("");
    }
  }, [selectedTaskId, selectedUserId]);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Assign Tasks to Users</h2>
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="space-y-3">
            <Label>Choose Task</Label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full p-2 rounded border"
            >
              <option value="">Select Task</option>
              {tasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <Label>Assign to User</Label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full p-2 rounded border"
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.email}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            onClick={handleAssignTask}
            disabled={!selectedTaskId || !selectedUserId}
          >
            Assign Task
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
