import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { auth, requireAdmin } from './middlewares/auth.middleware';
import { validate } from './middlewares/validate.middleware';
import { loginSchema, registerSchema, createProjectSchema, createTaskSchema, updateTaskStatusSchema } from './schema';
import { login, register, getMe } from './controllers/auth.controller';
import { createProject, getProjectDetails, getProjects } from './controllers/projects.controller';
import { createTask, deleteTask, updateTaskStatus } from './controllers/tasks.controller';
import { getDashboardStats } from './controllers/dashboard.controller';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Auth Routes
app.post('/api/auth/register', validate(registerSchema), register);
app.post('/api/auth/login', validate(loginSchema), login);
app.get('/api/auth/me', auth, getMe);

// Dashboard Route
app.get('/api/dashboard', auth, getDashboardStats);

// Projects Routes
app.get('/api/projects', auth, getProjects);
app.get('/api/projects/:id', auth, getProjectDetails);
app.post('/api/projects', auth, requireAdmin, validate(createProjectSchema), createProject);

// Tasks Routes
app.post('/api/projects/:projectId/tasks', auth, requireAdmin, validate(createTaskSchema), createTask);
app.put('/api/tasks/:id', auth, validate(updateTaskStatusSchema), updateTaskStatus);
app.delete('/api/tasks/:id', auth, requireAdmin, deleteTask);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
