# 🧠 Taskify – Task Management System

Taskify is a fullstack Task Management System built using **Next.js** (App Router) that enables users to manage tasks, assign them to multiple team members, track overdue tasks, and get notified when tasks are assigned.

## ✨ Features

- ✅ User Authentication (JWT-based, cookie stored)
- 📋 Task CRUD with status, priority, due date
- 👥 Assign tasks to users (no duplicate assignment)
- 🔔 Notifications on task assignment (UI/log-based)
- 📊 Dashboard with stats: Created, Assigned, Overdue tasks
- 🔎 Search and Filter tasks
- 💅 UI with ShadCN and TanStack Table

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/taskify.git
cd taskify
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a .env.local file in the root directory with the following values:

```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see the app running.

## 🧠 Project Approach

This is a monolithic Next.js App Router project using:

- API Routes in app/api/ for backend logic (task, auth, user, assignment)
- ShadCN UI for beautiful, consistent components (modal, buttons, inputs)
- TanStack Table for rendering searchable, filterable task tables
- MongoDB for data storage
- JWT for secure authentication

### ✅ Authentication

- Auth handled with JWT.
- Users are stored in MongoDB with hashed passwords.

### 📋 Tasks & Assignment Logic

- Each task includes title, description, dueDate, status, priority, createdBy, and assignedTo.
- Tasks can be assigned to users.
- Duplicate assignment is prevented by checking if assignedTo already includes the user ID.

### 📊 Dashboard

The dashboard includes:

- Tasks assigned to the user
- Tasks created by the user
- Overdue tasks

## 🛠 Tech Stack

- Frontend & Backend: Next.js (App Router)
- Database: MongoDB (Mongoose ODM)
- UI: ShadCN, Tailwind CSS
- Table: TanStack Table (React Table)
- Auth: JWT + Cookies
