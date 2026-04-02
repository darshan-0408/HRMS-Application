import styles from './AppLayout.module.css';
import Sidebar from '../Sidebar';
import Header from '../Header';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

export default function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  return (
    <div className={`${styles.layout} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      <div className={styles.main}>
        <Header isSidebarCollapsed={isSidebarCollapsed} />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
