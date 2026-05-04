import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Folder } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchProjects = () => {
    axios.get('/projects').then(res => setProjects(res.data));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/projects', { name, description });
      setShowModal(false);
      setName('');
      setDescription('');
      fetchProjects();
    } catch (err) {
      alert('Failed to create project');
    }
  };

  return (
    <div>
      <header className="header">
        <div>
          <h1 className="title">Projects</h1>
          <p className="subtitle">Manage your team's projects</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> New Project
          </button>
        )}
      </header>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="glass-panel" style={{ width: '400px', background: 'var(--bg-color)' }}>
            <h2 style={{ marginBottom: '1rem' }}>Create Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Name</label>
                <input required className="input-field" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea required className="input-field" rows={3} value={description} onChange={e => setDescription(e.target.value)}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid">
        {projects.map(project => (
          <Link to={`/projects/${project.id}`} key={project.id}>
            <div className="glass-panel card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Folder color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{project.name}</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                {project.description}
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Tasks: {project._count.tasks}</span>
                <span style={{ color: 'var(--primary)' }}>View Details &rarr;</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
