import { pgTable, text, serial, integer, boolean, timestamp, varchar, date, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// === USERS (Custom Auth) ===
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    password: text("password").notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    employeeId: varchar("employee_id", { length: 50 }).unique(),
    username: varchar("username", { length: 100 }).unique(),
    profileImageUrl: text("profile_image_url"),
    role: text("role", { enum: ["admin", "proprietor", "staff"] }).default("staff").notNull(),
    department: text("department"),
    title: text("title"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// === SESSIONS ===
export const sessions = pgTable("sessions", {
    id: text("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

// === TASKS ===
export const tasks = pgTable("tasks", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    assignedToId: integer("assigned_to_id").references(() => users.id).notNull(),
    assignedById: integer("assigned_by_id").references(() => users.id).notNull(),
    status: text("status", { enum: ["pending", "in_progress", "completed", "reassigned"] }).default("pending").notNull(),
    priority: text("priority", { enum: ["low", "medium", "high", "critical"] }).default("medium").notNull(),
    dueDate: timestamp("due_date"),
    completionLevel: integer("completion_level").default(0).notNull(), // 0-100
    notes: text("notes"), // For reassignment notes or progress notes
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// === ATTENDANCE ===
export const attendance = pgTable("attendance", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull(),
    date: date("date").notNull(),
    status: text("status", { enum: ["present", "absent", "half_day", "leave"] }).default("present").notNull(),
    checkInTime: timestamp("check_in_time"),
    checkOutTime: timestamp("check_out_time"),
    workHours: decimal("work_hours", { precision: 4, scale: 2 }),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
});

// === LEAVES ===
export const leaves = pgTable("leaves", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull(),
    type: text("type", { enum: ["sick", "casual", "vacation", "emergency", "other"] }).notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    days: integer("days").notNull(),
    reason: text("reason").notNull(),
    status: text("status", { enum: ["pending", "approved", "rejected"] }).default("pending").notNull(),
    approvedById: integer("approved_by_id").references(() => users.id),
    approvedAt: timestamp("approved_at"),
    createdAt: timestamp("created_at").defaultNow(),
});

// === EXPENSES ===
export const expenses = pgTable("expenses", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    description: text("description").notNull(),
    date: date("date").notNull(),
    category: text("category").notNull(),
    status: text("status", { enum: ["pending", "approved", "rejected"] }).default("pending").notNull(),
    receiptUrl: text("receipt_url"),
    approvedById: integer("approved_by_id").references(() => users.id),
    approvedAt: timestamp("approved_at"),
    createdAt: timestamp("created_at").defaultNow(),
});

// === CLIENTS ===
export const clients = pgTable("clients", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    phone: varchar("phone", { length: 20 }),
    company: varchar("company", { length: 100 }),
    address: text("address"),
    status: text("status", { enum: ["active", "renewal", "lead", "pitch", "inactive"] }).default("lead").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// === MONTHLY SUMMARIES ===
export const monthlySummaries = pgTable("monthly_summaries", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull(),
    month: integer("month").notNull(),
    year: integer("year").notNull(),
    totalTasks: integer("total_tasks").default(0),
    completedTasks: integer("completed_tasks").default(0),
    inProgressTasks: integer("in_progress_tasks").default(0),
    pendingTasks: integer("pending_tasks").default(0),
    attendanceDays: integer("attendance_days").default(0),
    leaveDays: integer("leave_days").default(0),
    totalExpenses: decimal("total_expenses", { precision: 10, scale: 2 }).default("0"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// === RELATIONS ===
export const usersRelations = relations(users, ({ many }) => ({
    assignedTasks: many(tasks, { relationName: "assignee" }),
    createdTasks: many(tasks, { relationName: "assigner" }),
    attendance: many(attendance),
    leaves: many(leaves),
    expenses: many(expenses),
    monthlySummaries: many(monthlySummaries),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
    assignee: one(users, {
        fields: [tasks.assignedToId],
        references: [users.id],
        relationName: "assignee"
    }),
    assigner: one(users, {
        fields: [tasks.assignedById],
        references: [users.id],
        relationName: "assigner"
    }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
    user: one(users, {
        fields: [attendance.userId],
        references: [users.id],
    }),
}));

export const leavesRelations = relations(leaves, ({ one }) => ({
    user: one(users, {
        fields: [leaves.userId],
        references: [users.id],
    }),
    approvedBy: one(users, {
        fields: [leaves.approvedById],
        references: [users.id],
    }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
    user: one(users, {
        fields: [expenses.userId],
        references: [users.id],
    }),
    approvedBy: one(users, {
        fields: [expenses.approvedById],
        references: [users.id],
    }),
}));

export const monthlySummariesRelations = relations(monthlySummaries, ({ one }) => ({
    user: one(users, {
        fields: [monthlySummaries.userId],
        references: [users.id],
    }),
}));
