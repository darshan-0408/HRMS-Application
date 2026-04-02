import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, CalendarCheck, CheckSquare, Gift, UserPlus, ArrowRight } from 'lucide-react';
import { mockDashboardSummary } from '../../api/mockData';
import { formatDateShort } from '../../utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const summary = mockDashboardSummary;

  return (
    <div className={`page-wrapper ${styles.dashboard}`}>
      <div className="page-header" style={{ marginBottom: '16px' }}>
        <h2 className="page-title">Dashboard Overview</h2>
        <span className="text-muted font-medium">As of {formatDateShort(summary.date)}</span>
      </div>

      {/* Top 4 Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.blue}`}><Users size={20} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Employees</span>
            <span className={styles.statValue}>{summary.totalEmployees}</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.green}`}><Clock size={20} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Present Today</span>
            <span className={styles.statValue}>{summary.present}</span>
          </div>
          <div className={styles.statExtra}>
            <span className="text-muted text-xs">{summary.halfDay} half day</span>
          </div>
        </div>

        <div className={styles.statCard} onClick={() => navigate('/leave-applications')} style={{ cursor: 'pointer' }}>
          <div className={`${styles.statIcon} ${styles.orange}`}><CalendarCheck size={20} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Pending Leaves</span>
            <span className={styles.statValue}>{summary.pendingLeaves}</span>
          </div>
          <div className={styles.statExtra}>
            <span className={styles.statLink}>View all <ArrowRight size={12} /></span>
          </div>
        </div>

        <div className={styles.statCard} onClick={() => navigate('/approvals')} style={{ cursor: 'pointer' }}>
          <div className={`${styles.statIcon} ${styles.red}`}><CheckSquare size={20} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Pending Approvals</span>
            <span className={styles.statValue}>{summary.pendingApprovals}</span>
          </div>
          <div className={styles.statExtra}>
            <span className={styles.statLink}>View all <ArrowRight size={12} /></span>
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Column */}
        <div className={styles.leftCol}>
          {/* On Leave Today */}
          <div className="card">
            <h3 className={styles.sectionTitle}>On Leave Today <span className="badge badge-inactive" style={{ marginLeft: 8 }}>{summary.onLeave}</span></h3>
            {summary.onLeaveToday.length > 0 ? (
              <div className={styles.listContainer}>
                {summary.onLeaveToday.map(emp => (
                  <div key={emp.empId} className={styles.listItem}>
                    <div className="avatar">{emp.name.charAt(0)}</div>
                    <div className={styles.listText}>
                      <span className="font-semibold text-primary">{emp.name}</span>
                      <span className="text-xs text-muted">{emp.department} • {emp.leaveType}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-sm py-4 text-center">No employees on leave today.</p>
            )}
          </div>

          {/* New Hires */}
          <div className="card">
            <h3 className={styles.sectionTitle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><UserPlus size={18} className="text-primary" /> New Hires (Last 30 Days)</div>
            </h3>
            {summary.newHires.length > 0 ? (
              <div className={styles.listContainer}>
                {summary.newHires.map(emp => (
                  <div key={emp.empId} className={styles.listItem}>
                    <div className="avatar" style={{ background: 'var(--color-primary-600)', color: 'white' }}>{emp.name.charAt(0)}</div>
                    <div className={styles.listText}>
                      <span className="font-semibold text-primary">{emp.name}</span>
                      <span className="text-xs text-muted">{emp.designation} • Joined {formatDateShort(emp.doj)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-sm py-4 text-center">No new hires recently.</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          {/* Birthdays */}
          <div className="card">
            <h3 className={styles.sectionTitle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Gift size={18} style={{ color: '#ec4899' }} /> Upcoming Birthdays</div>
            </h3>
            {summary.birthdays.length > 0 ? (
              <div className={styles.listContainer}>
                {summary.birthdays.map(emp => (
                  <div key={emp.empId} className={styles.listItem}>
                    <div className={styles.dateBox}>
                      <span style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 700 }}>Mar</span>
                      <span style={{ fontSize: 16, fontWeight: 800 }}>10</span>
                    </div>
                    <div className={styles.listText}>
                      <span className="font-semibold text-primary">{emp.name}</span>
                      <span className="text-xs text-muted">{emp.department}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-sm py-4 text-center">No upcoming birthdays.</p>
            )}
          </div>

          {/* Work Anniversaries */}
          <div className="card">
            <h3 className={styles.sectionTitle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckSquare size={18} style={{ color: '#8b5cf6' }} /> Work Anniversaries</div>
            </h3>
            {summary.anniversaries.length > 0 ? (
              <div className={styles.listContainer}>
                {summary.anniversaries.map(emp => (
                  <div key={emp.empId} className={styles.listItem}>
                    <div className={styles.dateBoxWrapper}>
                      <span className={styles.yearsBadge}>{emp.years} Yrs</span>
                    </div>
                    <div className={styles.listText}>
                      <span className="font-semibold text-primary">{emp.name}</span>
                      <span className="text-xs text-muted">{emp.department} • Joined {emp.doj.substring(0, 4)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-sm py-4 text-center">No work anniversaries this month.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
