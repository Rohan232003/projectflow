import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const { user } = useAuth();
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [taskStatusMap, setTaskStatusMap] = useState<Record<string, string>>({});

  const fetchProject = () => {
    axios.get(`/projects/${id}`).then(res => {
      setProject(res.data);
      const statuses: any = {};
      res.data.tasks.forEach((t: any) => { statuses[t.id] = t.status; });
      setTaskStatusMap(statuses);
    });
  };

  useEffect(() => { 
    fetchProject(); 
    if (user?.role === 'ADMIN') {
      axios.get('/users').then(res => setMembers(res.data));
    }
  }, [id, user]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`/projects/${id}/tasks`, {
        title: taskTitle,
        description: taskDesc,
        assigneeId: assigneeId || null
      });
      setShowTaskModal(false);
      setTaskTitle('');
      setTaskDesc('');
      setAssigneeId('');
      fetchProject();
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    setTaskStatusMap(prev => ({ ...prev, [taskId]: newStatus }));
    try {
      await axios.put(`/tasks/${taskId}`, { status: newStatus });
      fetchProject();
    } catch (err) {
      alert('Failed to update task status');
      fetchProject(); // Revert on failure
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <header className="header">
        <div>
          <h1 className="title">{project.name}</h1>
          <p className="subtitle">{project.description}</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
            <Plus size={18} /> Add Task
          </button>
        )}
      </header>

      {showTaskModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="glass-panel" style={{ width: '400px', background: 'var(--bg-color)' }}>
            <h2 style={{ marginBottom: '1rem' }}>Add Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Title</label>
                <input required className="input-field" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="input-field" rows={3} value={taskDesc} onChange={e => setTaskDesc(e.target.value)}></textarea>
              </div>
              <div className="form-group">
                <label>Assignee (Optional)</label>
                <select className="input-field" value={assigneeId} onChange={e => setAssigneeId(e.target.value)}>
                  <option value="">Unassigned</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>{member.name} ({member.email})</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {project.tasks.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No tasks in this project yet.</p>
        ) : (
          project.tasks.map((task: any) => (
            <div key={task.id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{task.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{task.description}</p>
                {task.assignee && (
                  <p style={{ color: 'var(--primary-color)', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 500 }}>
                    Assigned to: {task.assignee.name}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <select 
                  className="input-field" 
                  style={{ marginTop: 0, padding: '0.5rem' }}
                  value={taskStatusMap[task.id] || task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  disabled={user?.role !== 'ADMIN' && task.assigneeId !== user?.id && task.assigneeId !== null}
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
