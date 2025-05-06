import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export const getColumns = ({ onEdit, onDelete }) => [
  {
    header: "Title",
    accessorKey: "title",
    cell: ({ row }) => row.original.title,
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: ({ row }) => row.original.description,
  },
  {
    header: "Priority",
    accessorKey: "priority",
    cell: ({ row }) => row.original.priority,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => row.original.status,
  },
  {
    header: "Due Date",
    accessorKey: "dueDate",
    cell: ({ row }) =>
      new Date(row.original.dueDate).toLocaleDateString("en-IN"),
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => onEdit(row.original)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => onDelete(row.original._id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];
