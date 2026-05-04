import { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle2, CircleDashed, ListTodo, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    axios.get('/dashboard')
      .then(res => {
        setStats(res.data.stats);
        setRecentTasks(res.data.recentTasks);
      });
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      <header className="header">
        <div>
          <h1 className="title">Dashboard</h1>
          <p className="subtitle">Welcome back, {user?.name}</p>
        </div>
      </header>

      <div className="stats-grid">
        <div className="glass-panel stat-card">
          <ListTodo size={32} color="var(--primary)" style={{ margin: '0 auto' }} />
          <div className="stat-value">{stats.totalTasks}</div>
          <div style={{ color: 'var(--text-secondary)' }}>Total Tasks</div>
        </div>
        <div className="glass-panel stat-card">
          <CircleDashed size={32} color="#818cf8" style={{ margin: '0 auto' }} />
          <div className="stat-value" style={{ color: '#818cf8' }}>{stats.inProgressTasks}</div>
          <div style={{ color: 'var(--text-secondary)' }}>In Progress</div>
        </div>
        <div className="glass-panel stat-card">
          <CheckCircle2 size={32} color="#34d399" style={{ margin: '0 auto' }} />
          <div className="stat-value" style={{ color: '#34d399' }}>{stats.doneTasks}</div>
          <div style={{ color: 'var(--text-secondary)' }}>Completed</div>
        </div>
        <div className="glass-panel stat-card">
          <AlertCircle size={32} color="var(--danger)" style={{ margin: '0 auto' }} />
          <div className="stat-value" style={{ color: 'var(--danger)' }}>{stats.overdueTasks}</div>
          <div style={{ color: 'var(--text-secondary)' }}>Overdue</div>
        </div>
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Recent Tasks</h3>
        {recentTasks.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No recent tasks found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentTasks.map(task => (
              <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <div>
                  <h4 style={{ fontWeight: 600 }}>{task.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Project: {task.project.name}
                  </p>
                </div>
                <span className={`badge badge-${task.status}`}>{task.status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
