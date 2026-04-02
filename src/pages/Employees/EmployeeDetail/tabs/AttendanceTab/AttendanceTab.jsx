import styles from './AttendanceTab.module.css';
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { generateMockAttendance } from '../../../../../api/mockData';
import { getCurrentMonthYear, monthLabel, getStatusBadgeClass, formatStatus } from '../../../../../utils';

export default function AttendanceTab({ employeeId }) {
  const [currentDate, setCurrentDate] = useState(getCurrentMonthYear());
  
  // Mock Fetch
  const attendanceData = useMemo(() => {
    return generateMockAttendance(employeeId, currentDate.year, currentDate.month);
  }, [employeeId, currentDate]);

  const stats = useMemo(() => {
    let lateMins = 0;
    attendanceData.forEach(d => { lateMins += d.lateMinutes; });
    return { lateMins, balanceMins: Math.max(0, 120 - lateMins) }; // Mock logic
  }, [attendanceData]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      let m = prev.month - 1;
      let y = prev.year;
      if (m < 0) { m = 11; y -= 1; }
      return { month: m, year: y };
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      let m = prev.month + 1;
      let y = prev.year;
      if (m > 11) { m = 0; y += 1; }
      return { month: m, year: y };
    });
  };

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <div className={styles.header}>
        <div className={styles.monthSelector}>
          <button className="btn-icon" onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
          <span className={styles.monthLabel}>{monthLabel(currentDate.month, currentDate.year)}</span>
          <button className="btn-icon" onClick={handleNextMonth}><ChevronRight size={20} /></button>
        </div>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Late Mins</span>
            <span className={styles.statValueDanger}>{stats.lateMins}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Balance Mins</span>
            <span className={styles.statValueSuccess}>{stats.balanceMins}</span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Late (Mins)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, i) => (
                <tr key={i}>
                  <td className="font-medium text-primary">{record.date}</td>
                  <td>{record.checkIn || '-'}</td>
                  <td>{record.checkOut || '-'}</td>
                  <td className={record.lateMinutes > 0 ? 'text-danger font-medium' : ''}>
                    {record.lateMinutes > 0 ? record.lateMinutes : '-'}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(record.status)}`}>
                      {formatStatus(record.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
