import { Request, Response } from 'express';
import { prisma } from '../db';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user!;

    // If Admin, they see stats for all projects they own.
    // If Member, they see stats for tasks assigned to them.
    
    let totalTasks = 0;
    let todoTasks = 0;
    let inProgressTasks = 0;
    let doneTasks = 0;
    let overdueTasks = 0;
    let recentTasks = [];

    const now = new Date();

    if (user.role === 'ADMIN') {
      const projects = await prisma.project.findMany({ where: { ownerId: user.id }, select: { id: true } });
      const projectIds = projects.map(p => p.id);

      const stats = await prisma.task.groupBy({
        by: ['status'],
        where: { projectId: { in: projectIds } },
        _count: { status: true }
      });

      stats.forEach(s => {
        if (s.status === 'TODO') todoTasks = s._count.status;
        if (s.status === 'IN_PROGRESS') inProgressTasks = s._count.status;
        if (s.status === 'DONE') doneTasks = s._count.status;
      });

      totalTasks = todoTasks + inProgressTasks + doneTasks;

      overdueTasks = await prisma.task.count({
        where: {
          projectId: { in: projectIds },
          status: { not: 'DONE' },
          dueDate: { lt: now }
        }
      });

      recentTasks = await prisma.task.findMany({
        where: { projectId: { in: projectIds } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { project: { select: { name: true } }, assignee: { select: { name: true } } }
      });

    } else {
      const stats = await prisma.task.groupBy({
        by: ['status'],
        where: { assigneeId: user.id },
        _count: { status: true }
      });

      stats.forEach(s => {
        if (s.status === 'TODO') todoTasks = s._count.status;
        if (s.status === 'IN_PROGRESS') inProgressTasks = s._count.status;
        if (s.status === 'DONE') doneTasks = s._count.status;
      });

      totalTasks = todoTasks + inProgressTasks + doneTasks;

      overdueTasks = await prisma.task.count({
        where: {
          assigneeId: user.id,
          status: { not: 'DONE' },
          dueDate: { lt: now }
        }
      });

      recentTasks = await prisma.task.findMany({
        where: { assigneeId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { project: { select: { name: true } } }
      });
    }

    res.json({
      stats: { totalTasks, todoTasks, inProgressTasks, doneTasks, overdueTasks },
      recentTasks
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};
