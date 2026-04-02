import styles from './Header.module.css';
import { Bell, LogOut, Power, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockDashboardSummary } from '../../api/mockData';

export default function Header({ isSidebarCollapsed }) {
  const navigate = useNavigate();

  const pendingCount = mockDashboardSummary.pendingApprovals;

  const handleLogout = () => {
    localStorage.removeItem('hrms_token');
    localStorage.removeItem('tenant_id');
    localStorage.removeItem('tenant_name');
    localStorage.removeItem('tenant_logo');
    localStorage.removeItem('tenant_color');
    localStorage.removeItem('user_data');
    navigate('/login');
  };

  const tenantName = localStorage.getItem('tenant_name') || 'University Name';
  const tenantLogo = localStorage.getItem('tenant_logo');
  const tenantColor = localStorage.getItem('tenant_color') || '#2563eb';
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const displayName = userData.username || 'Admin';
  const displayRole = userData.role === 'admin' ? 'Super Admin' : 'Staff';
  const hasLogo = tenantLogo && tenantLogo !== 'null' && tenantLogo !== '';

  return (
    <header className={`${styles.header} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.left}>
        <div className={styles.branding}>
          {hasLogo ? (
            <img src={tenantLogo} alt="Logo" className={styles.logo} />
          ) : (
            <div className={styles.logoPlaceholder}>
              <Building2 size={20} />
            </div>
          )}
          <span className={styles.tenantName} style={{ color: tenantColor }}>
            {tenantName}
          </span>
        </div>
      </div>
      <div className={styles.right}>
        {/* Notifications Bell */}
        <button
          className={styles.bellBtn}
          onClick={() => navigate('/approvals')}
          title="Pending Approvals"
        >
          <Bell size={20} />
          {pendingCount > 0 && (
            <span className={styles.badge}>{pendingCount > 9 ? '9+' : pendingCount}</span>
          )}
        </button>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Admin info */}
        <div className={styles.adminInfo}>
          <div className={styles.avatar}>{displayName[0]?.toUpperCase()}</div>
          <div className={styles.adminText}>
            <span className={styles.adminName}>{displayName}</span>
            <span className={styles.adminRole}>{displayRole}</span>
          </div>
        </div>

        {/* Logout */}
        <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
          <Power size={20} strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
}
