import styles from './MovementDetailsSlider.module.css';
import { X, MoreVertical, Edit, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getStatusBadgeClass, formatStatus } from '../../utils';
import { useState } from 'react';

dayjs.extend(utc);

export default function MovementDetailsSlider({ 
  isOpen, 
  onClose, 
  movement, 
  onUpdate, 
  onCancel,
  showActions = false 
}) {
  const [showMenu, setShowMenu] = useState(false);

  if (!isOpen || !movement) return null;

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`} onClick={onClose}>
      <div className={`${styles.slider} ${isOpen ? styles.sliderOpen : ''}`} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.empInfo}>
            <div className="avatar avatar-md">{movement.empName?.charAt(0) || '-'}</div>
            <div>
              <h3 className={styles.empName}>{movement.empName}</h3>
              <p className={styles.empSub}>{movement.department} • {movement.empId}</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            {showActions && (
              <div style={{ position: 'relative' }}>
                <button 
                  className="btn-icon" 
                  onClick={() => movement.status !== 'cancelled' && setShowMenu(!showMenu)}
                  disabled={movement.status === 'cancelled'}
                  style={movement.status === 'cancelled' ? { opacity: 0.35, cursor: 'not-allowed' } : {}}
                  title={movement.status === 'cancelled' ? 'Actions unavailable for cancelled movement' : ''}
                >
                  <MoreVertical size={20} />
                </button>
                {showMenu && (
                  <div className="dropdown-menu" style={{ right: 0, top: '100%' }}>
                    <button className="dropdown-item" onClick={() => { setShowMenu(false); onUpdate(movement); }}>
                      <Edit size={16} /> Update Time
                    </button>
                    <button className="dropdown-item danger" onClick={() => { setShowMenu(false); onCancel(movement); }}>
                      <Trash2 size={16} /> Cancel Movement
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
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Movement Details</h4>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span>Date</span>
                <strong>{dayjs.utc(movement.movementDate).local().format('DD MMM YYYY')}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Time Duration</span>
                <strong>{movement.startTime} - {movement.endTime}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Requested On</span>
                <strong>{dayjs.utc(movement.reqDate).local().format('DD MMM YYYY')}</strong>
              </div>
              <div className={styles.detailItem}>
                <span>Status</span>
                <span className={`badge ${getStatusBadgeClass(movement.status)}`}>{formatStatus(movement.status)}</span>
              </div>
            </div>
            <div className={styles.reasonBox}>
              <span>Reason</span>
              <p>{movement.reason}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
