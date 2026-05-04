import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(['ADMIN', 'MEMBER']).optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  })
});

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().min(1, "Description is required"),
  })
});

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Task title is required"),
    description: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    assigneeId: z.string().uuid().optional(),
  })
});

export const updateTaskStatusSchema = z.object({
  body: z.object({
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  })
});
