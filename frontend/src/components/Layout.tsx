import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, LogOut } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div style={{ padding: '0 1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>ProjectSync</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {user?.name} ({user?.role})
          </p>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/projects" className={`nav-link ${location.pathname.startsWith('/projects') ? 'active' : ''}`}>
            <FolderKanban size={20} /> Projects
          </Link>
        </nav>

        <div style={{ marginTop: 'auto', padding: '1rem' }}>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
