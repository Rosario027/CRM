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

// === INSURANCE PRODUCTS ===
export const products = pgTable("products", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    category: text("category", { enum: ["life", "health", "motor", "travel", "home", "business"] }).notNull(),
    // motor-specific columns (nullable for non-motor products)
    motorCondition: text("motor_condition", { enum: ["new", "old"] }).default("new"),
    motorBrand: varchar("motor_brand", { length: 100 }),
    motorModel: varchar("motor_model", { length: 100 }),
    description: text("description").notNull(),
    shortDescription: text("short_description"),
    premiumStarting: decimal("premium_starting", { precision: 10, scale: 2 }).notNull(),
    coverageAmount: decimal("coverage_amount", { precision: 12, scale: 2 }).notNull(),
    duration: varchar("duration", { length: 50 }),
    features: text("features"), // JSON string of feature list
    terms: text("terms"),
    isActive: boolean("is_active").default(true),
    createdById: integer("created_by_id").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// === MOTOR INSURANCE LEADS ===
export const motorLeads = pgTable("motor_leads", {
    id: serial("id").primaryKey(),
    source: varchar("source", { length: 50 }),
    customerName: varchar("customer_name", { length: 200 }),
    referral: varchar("referral", { length: 200 }),
    packageDueDate: date("package_due_date"),
    saodDueDate: date("saod_due_date"),
    tpDueDate: date("tp_due_date"),
    vehicleMake: varchar("vehicle_make", { length: 100 }),
    vehicleModel: varchar("vehicle_model", { length: 200 }),
    regNo: varchar("reg_no", { length: 50 }),
    idv: decimal("idv", { precision: 12, scale: 2 }),
    contact: varchar("contact", { length: 20 }),
    email: varchar("email", { length: 255 }),
    pan: varchar("pan", { length: 10 }),
    aadhaar: varchar("aadhaar", { length: 12 }),
    insurer2024: varchar("insurer_2024", { length: 150 }),
    insurer2025: varchar("insurer_2025", { length: 150 }),
    insurer2026: varchar("insurer_2026", { length: 150 }),
    status: text("status", { enum: ["open", "closed", "renewed", "lost"] }).default("open"),
    customField1: text("custom_field_1"),
    customField2: text("custom_field_2"),
    customField3: text("custom_field_3"),
    customField4: text("custom_field_4"),
    customField5: text("custom_field_5"),
    assignedToId: integer("assigned_to_id").references(() => users.id),
    createdById: integer("created_by_id").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// === HEALTH INSURANCE LEADS ===
export const healthLeads = pgTable("health_leads", {
    id: serial("id").primaryKey(),
    customerName: varchar("customer_name", { length: 200 }),
    members: text("members"), // JSON array of {relation, dob, height, weight}
    contact: varchar("contact", { length: 20 }),
    email: varchar("email", { length: 255 }),
    currentInsurer: varchar("current_insurer", { length: 100 }),
    status: text("status", { enum: ["open", "closed", "renewed", "lost"] }).default("open"),
    assignedToId: integer("assigned_to_id").references(() => users.id),
    createdById: integer("created_by_id").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// === ADMIN CUSTOM FIELDS CONFIG ===
export const adminCustomFields = pgTable("admin_custom_fields", {
    id: serial("id").primaryKey(),
    module: text("module", { enum: ["motor", "health"] }).notNull(),
    fieldNumber: integer("field_number").notNull(),
    label: varchar("label", { length: 100 }).notNull().default("Custom Field"),
    isEnabled: boolean("is_enabled").default(false),
    fieldType: text("field_type", { enum: ["text", "date", "number"] }).default("text"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// === QUOTATIONS ===
export const quotations = pgTable("quotations", {
    id: serial("id").primaryKey(),
    type: text("type", { enum: ["motor", "health", "commercial"] }).notNull(),
    customerName: varchar("customer_name", { length: 200 }),
    vehicleOrDetails: text("vehicle_or_details"),
    dueDate: date("due_date"),
    quotationData: text("quotation_data").notNull(), // Full JSON
    motorLeadId: integer("motor_lead_id").references(() => motorLeads.id),
    healthLeadId: integer("health_lead_id").references(() => healthLeads.id),
    createdById: integer("created_by_id").references(() => users.id),
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
    createdProducts: many(products),
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
