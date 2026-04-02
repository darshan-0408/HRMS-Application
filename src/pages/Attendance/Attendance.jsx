import styles from './Attendance.module.css';
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { mockEmployees, mockDepartments, mockDesignations, generateMockAttendance } from '../../api/mockData';
import { getCurrentMonthYear, monthLabel, buildCalendarDays, getAttendanceLetter, getAttendanceColor } from '../../utils';
import Pagination from '../../components/Pagination';

const PAGE_SIZE = 10;

export default function Attendance() {
  const [currentDate, setCurrentDate] = useState(getCurrentMonthYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ department: '', designation: '', status: '' });
  const [page, setPage] = useState(1);

  // Month handlers
  const handlePrevMonth = () => { setCurrentDate(p => p.month === 0 ? { month: 11, year: p.year - 1 } : { ...p, month: p.month - 1 }); };
  const handleNextMonth = () => { setCurrentDate(p => p.month === 11 ? { month: 0, year: p.year + 1 } : { ...p, month: p.month + 1 }); };

  const days = buildCalendarDays(currentDate.year, currentDate.month);

  // Filter & Search Logic
  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter(emp => {
      const matchSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.empId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = filters.department ? emp.departmentId === filters.department : true;
      const matchDesig = filters.designation ? emp.designationId === filters.designation : true;
      const matchStatus = filters.status ? emp.status === filters.status : true;
      return matchSearch && matchDept && matchDesig && matchStatus;
    });
  }, [searchTerm, filters]);

  // Generate grid data for filtered employees
  const gridData = useMemo(() => {
    return filteredEmployees.map(emp => {
      const attendance = generateMockAttendance(emp.empId, currentDate.year, currentDate.month);
      return { ...emp, attendance };
    });
  }, [filteredEmployees, currentDate]);

  // Pagination
  const totalItems = gridData.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return gridData.slice(start, start + PAGE_SIZE);
  }, [gridData, page]);

  return (
    <div className={`page-wrapper ${styles.page}`}>
      <div className="page-header">
        <h2 className="page-title">Monthly Attendance</h2>
        
        <div className={styles.monthSelector}>
          <button className="btn-icon" onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
          <span className={styles.monthLabel}>{monthLabel(currentDate.month, currentDate.year)}</span>
          <button className="btn-icon" onClick={handleNextMonth}><ChevronRight size={20} /></button>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className="search-wrapper">
          <Search size={16} />
          <input type="text" className="search-input" placeholder="Search employee..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="filter-bar">
          <div className={styles.filterIcon}><Filter size={16} /> Filters</div>
          <select className="filter-select" value={filters.department} onChange={e => setFilters({...filters, department: e.target.value})}>
            <option value="">All Departments</option>
            {mockDepartments.map(d => <option key={d._id} value={d._id}>{d.deptName}</option>)}
          </select>
          <select className="filter-select" value={filters.designation} onChange={e => setFilters({...filters, designation: e.target.value})}>
            <option value="">All Designations</option>
            {mockDesignations.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
        </div>
      </div>

      {/* Grid Container */}
      <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div className={styles.gridWrapper}>
          <table className={styles.gridTable}>
            <thead>
              <tr>
                <th className={styles.stickyCol}>Employee Name</th>
                <th className={styles.stickyCol2}>Emp ID</th>
                {days.map(d => (
                  <th key={d.day} className={d.isWeekend ? styles.weekendHeader : ''}>
                    <div className={styles.dayCol}>
                      <span className={styles.dayName}>{d.dayName}</span>
                      <span className={styles.dayNum}>{String(d.day).padStart(2, '0')}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map(emp => (
                <tr key={emp._id}>
                  <td className={styles.stickyCol}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="avatar" style={{ width: 28, height: 28, fontSize: '11px' }}>{emp.name.charAt(0)}</div>
                      <span className="font-semibold" style={{ whiteSpace: 'nowrap' }}>{emp.name}</span>
                    </div>
                  </td>
                  <td className={`${styles.stickyCol2} text-muted`}>{emp.empId}</td>
                  
                  {days.map(d => {
                    const record = emp.attendance.find(a => a.date === d.date.format('YYYY-MM-DD'));
                    const status = record?.status || 'absent';
                    const letter = getAttendanceLetter(status);
                    const color = getAttendanceColor(status);
                    
                    return (
                      <td key={d.day} className={d.isWeekend ? styles.weekendCell : ''}>
                        <div className={styles.statusCell} style={{ color, backgroundColor: `${color}15` }}>
                          {letter}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={days.length + 2} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', zIndex: 30, position: 'relative' }}>
          <Pagination page={page} totalPages={totalPages} total={totalItems} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
