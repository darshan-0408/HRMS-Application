import styles from './LeaveDetailsSlider.module.css';
import { X, MoreVertical, Edit, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getStatusBadgeClass, formatStatus } from '../../utils';
import { useState } from 'react';

dayjs.extend(utc);

export default function LeaveDetailsSlider({ 
  isOpen, 
  onClose, 
  leave, 
  onUpdate, 
  onCancel,
  showActions = false 
}) {
  const [showMenu, setShowMenu] = useState(false);

  if (!isOpen || !leave) return null;

  const emp = leave.employee;

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`} onClick={onClose}>
      <div className={`${styles.slider} ${isOpen ? styles.sliderOpen : ''}`} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.empInfo}>
            <div className="avatar avatar-md">{emp?.name?.charAt(0)}</div>
            <div>
              <h3 className={styles.empName}>{emp?.name}</h3>
              <p className={styles.empSub}>{emp?.designation?.name} • {emp?.empId} • {emp?.department?.deptName}</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            {showActions && (
              <div style={{ position: 'relative' }}>
                <button 
                  className="btn-icon" 
                  onClick={() => leave.status !== 'cancelled' && setShowMenu(!showMenu)}
                  disabled={leave.status === 'cancelled'}
                  style={leave.status === 'cancelled' ? { opacity: 0.35, cursor: 'not-allowed' } : {}}
                  title={leave.status === 'cancelled' ? 'Actions unavailable for cancelled leave' : ''}
                >
                  <MoreVertical size={20} />
                </button>
                {showMenu && (
                  <div className="dropdown-menu" style={{ right: 0, top: '100%' }}>
                    <button className="dropdown-item" onClick={() => { setShowMenu(false); onUpdate(leave); }}>
                      <Edit size={16} /> Update Leave
                    </button>
                    <button className="dropdown-item danger" onClick={() => { setShowMenu(false); onCancel(leave); }}>
                      <Trash2 size={16} /> Cancel Leave
                    </button>
                  </div>
                )}
              </div>
            )}
            <button className="btn-icon" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {/* Request Details */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Request Details</h4>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span>Leave Type</span>
                <strong>{leave.leaveType?.leaveName} ({leave.leaveType?.leaveCode})</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Leave Date(s)</span>
                <strong>{dayjs.utc(leave.fromDate).local().format('DD MMM YYYY')} - {dayjs.utc(leave.toDate).local().format('DD MMM YYYY')}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Requested On</span>
                <strong>{dayjs.utc(leave.created_at).local().format('DD MMM YYYY HH:mm')}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Status</span>
                <span className={`badge ${getStatusBadgeClass(leave.status)}`}>{formatStatus(leave.status)}</span>
              </div>
              <div className={styles.detailItem}>
                <span>Dept Admin Approval</span>
                <span className={`badge ${getStatusBadgeClass(leave.deptAdminApproval)}`}>{formatStatus(leave.deptAdminApproval)}</span>
              </div>
              <div className={styles.detailItem}>
                <span>Admin Approval</span>
                <span className={`badge ${getStatusBadgeClass(leave.adminApproval)}`}>{formatStatus(leave.adminApproval)}</span>
              </div>
            </div>
            <div className={styles.reasonBox}>
              <span>Reason</span>
              <p>{leave.reason}</p>
            </div>
            {leave.document && (
              <div className={styles.documentLink}>
                <span>Document</span>
                <a href={leave.document} target="_blank" rel="noreferrer" className="text-primary font-medium">View Attachment</a>
              </div>
            )}
          </div>

          {/* Daily Breakdown Table */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h4 className={styles.sectionTitle}>Leave Days Breakdown</h4>
              <span className={styles.totalBadge}>{leave.totalDays} Day(s)</span>
            </div>
            <table className={styles.breakdownTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day Type</th>
                </tr>
              </thead>
              <tbody>
                {leave.days && leave.days.map((day, idx) => (
                  <tr key={idx}>
                    <td>{day?.date ? dayjs.utc(day.date).local().format('DD MMM YYYY (ddd)') : '-'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={day?.dayType === 'weekend' ? styles.weekendText : ''}>
                          {day?.dayType === 'full' ? 'Full Day' : 
                           day?.dayType === 'halfMorning' ? 'Half-Day Morning' :
                           day?.dayType === 'halfAfternoon' ? 'Half-Day Afternoon' : 
                           day?.dayType === 'weekend' ? 'Weekend' : '-'}
                        </span>
                        {leave.status === 'cancelled' && (
                          <span className={styles.cancelledTag}>C</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
