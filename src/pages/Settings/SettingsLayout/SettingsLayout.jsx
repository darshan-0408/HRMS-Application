import styles from './SettingsLayout.module.css';
import { NavLink, Outlet } from 'react-router-dom';
import { Calendar, Briefcase, Users, LayoutList, Award, ArrowRightLeft } from 'lucide-react';

export default function SettingsLayout() {
  const tabs = [
    { name: 'Leave Types', path: '/settings/leave-types', icon: <Calendar size={18} /> },
    { name: 'Departments', path: '/settings/departments', icon: <Briefcase size={18} /> },
    { name: 'Designations', path: '/settings/designations', icon: <Award size={18} /> },
    { name: 'Employee Categories', path: '/settings/emp-categories', icon: <Users size={18} /> },
    { name: 'Employee Types', path: '/settings/emp-types', icon: <LayoutList size={18} /> },
    { name: 'Movement Settings', path: '/settings/movement', icon: <ArrowRightLeft size={18} /> },
  ];

  return (
    <div className={`page-wrapper ${styles.container}`}>
      <div className="page-header">
        <h2 className="page-title">Settings</h2>
      </div>

      <div className={styles.layout}>
        {/* Sidebar Nav */}
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            {tabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                {tab.icon}
                {tab.name}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
