import { Request, Response } from 'express';
import { prisma } from '../db';

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { title, description, dueDate, assigneeId } = req.body;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId,
      }
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
};

export const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user!;

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Only Admin or the Assignee can update the status
    if (user.role !== 'ADMIN' && task.assigneeId !== user.id) {
      res.status(403).json({ message: 'Not authorized to update this task' });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    await prisma.task.delete({ where: { id } });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};
