import styles from './Sidebar.module.css';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, CalendarCheck, ArrowRightLeft,
  Clock, CheckSquare, Settings, ChevronRight, Building2, Shield
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Employees', icon: Users, path: '/employees' },
  { label: 'Leave Applications', icon: CalendarCheck, path: '/leave-applications' },
  { label: 'Movement Register', icon: ArrowRightLeft, path: '/movement-register' },
  { label: 'Attendance', icon: Clock, path: '/attendance' },
  { label: 'Approvals', icon: CheckSquare, path: '/approvals' },
];

const settingsItem = { label: 'Settings', icon: Settings, path: '/settings' };

export default function Sidebar({ isCollapsed, onToggle }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const userRole = userData.role || 'admin';
  const isSuperAdmin = userRole === 'super-admin';
  const displayName = userData.username || 'Admin';
  const displayRole = userRole === 'super-admin' ? 'Platform Owner' : (userRole === 'admin' ? 'College Admin' : 'Staff');

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      {/* Logo */}
      <div className={styles.logo} onClick={onToggle} title="Toggle Sidebar">
        <div className={styles.logoIcon}>
          <Building2 size={20} />
        </div>
        <div className={styles.logoText}>
          <span className={styles.logoName}>HRMS</span>
          <span className={styles.logoSub}>SaaS Platform</span>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        <p className={styles.navGroup}>Main Menu</p>
        <ul className={styles.navList}>
          {navItems.map(({ label, icon: Icon, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={`${styles.navItem} ${isActive(path) ? styles.navItemActive : ''}`}
                title={isCollapsed ? label : ''}
              >
                <Icon size={18} className={styles.navIcon} />
                <span className={styles.navLabel}>{label}</span>
                {isActive(path) && <ChevronRight size={14} className={styles.navChevron} />}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className={styles.divider} />

        <p className={styles.navGroup}>System</p>
        <ul className={styles.navList}>
          {isSuperAdmin && (
            <li>
              <NavLink
                to="/owner"
                className={`${styles.navItem} ${isActive('/owner') ? styles.navItemActive : ''}`}
                title={isCollapsed ? 'Owner Portal' : ''}
              >
                <Shield size={18} className={styles.navIcon} />
                <span className={styles.navLabel}>Owner Portal</span>
                {isActive('/owner') && <ChevronRight size={14} className={styles.navChevron} />}
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              to={settingsItem.path}
              className={`${styles.navItem} ${isActive(settingsItem.path) ? styles.navItemActive : ''}`}
              title={isCollapsed ? settingsItem.label : ''}
            >
              <Settings size={18} className={styles.navIcon} />
              <span className={styles.navLabel}>Settings</span>
              {isActive(settingsItem.path) && <ChevronRight size={14} className={styles.navChevron} />}
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Bottom */}
      <div className={styles.sidebarBottom}>
        <div className={styles.adminBadge}>
          <div className={styles.adminAvatar}>{displayName[0]?.toUpperCase()}</div>
          <div>
            <p className={styles.adminName}>{displayName}</p>
            <p className={styles.adminRole}>{displayRole}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
