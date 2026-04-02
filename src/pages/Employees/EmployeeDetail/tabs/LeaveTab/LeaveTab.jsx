import styles from './LeaveTab.module.css';
import { useState, useMemo, useEffect } from 'react';
import { Plus, Filter, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import { useQuery, useMutation } from '../../../../../api/apollo.js';
import { GET_LEAVE_APPLICATIONS, GET_LEAVE_BALANCES, APPLY_LEAVE } from '../../../../../api/leaveQueries';
import { GET_LEAVE_TYPES } from '../../../../../api/settingsQueries';
import { getStatusBadgeClass, formatStatus } from '../../../../../utils';
import Modal from '../../../../../components/Modal';
import LeaveDetailsSlider from '../../../../../components/LeaveDetailsSlider/LeaveDetailsSlider';

dayjs.extend(isBetween);
dayjs.extend(utc);

export default function LeaveTab({ employeeId, employeeName, dept }) {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    start: dayjs().startOf('year').format('YYYY-MM-DD'),
    end:   dayjs().endOf('year').format('YYYY-MM-DD'),
  });
  
  // Apply Leave Form State
  const [leaveForm, setLeaveForm] = useState({
    leaveTypeId: '', fromDate: '', toDate: '', reason: '', document: '', days: []
  });

  const { data: appData, loading: appLoading, refetch: refetchApps } = useQuery(GET_LEAVE_APPLICATIONS, {
    variables: { 
      filter: { 
        employeeId,
        ...(filters.type && { leaveTypeId: filters.type }),
        ...(filters.status && { status: filters.status }),
        ...(filters.start && { fromDate: { $gte: filters.start } }),
        ...(filters.end && { toDate: { $lte: filters.end } }),
      } 
    }
  });

  const { data: balanceData, loading: balanceLoading, refetch: refetchBalances } = useQuery(GET_LEAVE_BALANCES, {
    variables: { employeeId }
  });

  const { data: typeData } = useQuery(GET_LEAVE_TYPES);

  const [applyLeave, { loading: applying }] = useMutation(APPLY_LEAVE, {
    onCompleted: () => {
      setIsApplyOpen(false);
      refetchApps();
      refetchBalances();
      setLeaveForm({ leaveTypeId: '', fromDate: '', toDate: '', reason: '', document: '', days: [] });
    },
    onError: (err) => alert(err.message)
  });

  const balances = balanceData?.getLeaveBalances || [];
  const leaveTypes = typeData?.listLeaveTypes || [];
  const applications = appData?.listLeaveApplications?.employees || [];

  // Generate days array when dates change
  useEffect(() => {
    if (leaveForm.fromDate && leaveForm.toDate) {
      const start = dayjs(leaveForm.fromDate);
      const end = dayjs(leaveForm.toDate);
      const diff = end.diff(start, 'day');
      
      const newDays = [];
      for (let i = 0; i <= diff; i++) {
        const currentDate = start.add(i, 'day');
        const isSunday = currentDate.day() === 0;
        newDays.push({
          date: currentDate.toISOString(),
          dayType: isSunday ? 'weekend' : 'full'
        });
      }
      setLeaveForm(prev => ({ ...prev, days: newDays }));
    }
  }, [leaveForm.fromDate, leaveForm.toDate]);

  const totalDays = useMemo(() => {
    return leaveForm.days.reduce((acc, d) => {
      if (d.dayType === 'full') return acc + 1;
      if (d.dayType === 'halfMorning' || d.dayType === 'halfAfternoon') return acc + 0.5;
      return acc;
    }, 0);
  }, [leaveForm.days]);

  const selectedBalance = balances.find(b => b.leaveTypeId === leaveForm.leaveTypeId || b?._id === leaveForm.leaveTypeId);
  const selectedType = leaveTypes.find(t => t._id === leaveForm.leaveTypeId);

  const validationError = useMemo(() => {
    if (!leaveForm.leaveTypeId) return null;
    if (selectedBalance && totalDays > selectedBalance.remaining) {
      return `Applied number of days (${totalDays}) is more than remaining leaves (${selectedBalance.remaining})`;
    }
    if (selectedType && totalDays > selectedType.maxConsecutiveDays) {
      return `Leave cannot exceed ${selectedType.maxConsecutiveDays} consecutive days for this type`;
    }
    return null;
  }, [leaveForm.leaveTypeId, selectedBalance, totalDays, selectedType]);

  const isSubmitDisabled = !leaveForm.fromDate || !leaveForm.toDate || !leaveForm.leaveTypeId || !leaveForm.reason || 
                           totalDays === 0 || !!validationError || applying;

  const handleApplyChange = (e) => {
    setLeaveForm({ ...leaveForm, [e.target.name]: e.target.value });
  };

  const handleDayTypeChange = (index, type) => {
    const updatedDays = [...leaveForm.days];
    updatedDays[index].dayType = type;
    setLeaveForm({ ...leaveForm, days: updatedDays });
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    
    await applyLeave({
      variables: {
        input: {
          employeeId,
          leaveTypeId: leaveForm.leaveTypeId,
          fromDate: leaveForm.fromDate,
          toDate: leaveForm.toDate,
          reason: leaveForm.reason,
          totalDays,
          days: leaveForm.days.map(d => ({ date: d.date, dayType: d.dayType })),
          document: leaveForm.document
        }
      }
    });
  };

  return (
    <div className={styles.container}>
      {/* Leave Balances Summary */}
      <div className={styles.balancesRow}>
        {balances.map(b => (
          <div key={b._id || b.leaveTypeId} className={styles.balanceCard}>
            <span className={styles.balanceCode}>{b.leaveType?.leaveCode || '-'}</span>
            <div className={styles.balanceStats}>
              <div className={styles.stat}><span>Used</span><strong>{b.consumed ?? 0}</strong></div>
              <div className={styles.stat}><span>Left</span><strong className="text-primary">{b.remaining ?? 0}</strong></div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.toolbar}>
        <div className="filter-bar">
          <div className={styles.filterIcon}><Filter size={16} /> Filters</div>
          <select name="type" className="filter-select" value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}>
            <option value="">All Leave Types</option>
            {leaveTypes.map(t => <option key={t._id} value={t._id}>{t.leaveName}</option>)}
          </select>
          <select name="status" className="filter-select" value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className={styles.dateField}>
            <label className={styles.dateLabel}>From</label>
            <input
              type="date"
              className={styles.dateInput}
              value={filters.start}
              max={filters.end || undefined}
              onChange={(e) => setFilters({ ...filters, start: e.target.value })}
            />
          </div>
          <span className={styles.dateSep}>→</span>
          <div className={styles.dateField}>
            <label className={styles.dateLabel}>To</label>
            <input
              type="date"
              className={styles.dateInput}
              value={filters.end}
              min={filters.start || undefined}
              onChange={(e) => setFilters({ ...filters, end: e.target.value })}
            />
          </div>

        </div>

        <button className="btn btn-primary" onClick={() => setIsApplyOpen(true)}>
          <Plus size={16} /> Apply Leave
        </button>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Leave Date(s)</th>
                <th>Days Req</th>
                <th>Req Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appLoading ? (
                <tr><td colSpan="5" style={{textAlign:'center', padding: '24px'}}>Loading leaves...</td></tr>
              ) : applications && applications.filter(Boolean).length > 0 ? (
                applications.filter(Boolean).map((record) => (
                  <tr key={record._id || Math.random().toString()} className="clickable" onClick={() => { setSelectedLeave(record); setIsSliderOpen(true); }}>
                    <td className="font-medium text-primary">{record.leaveType?.leaveName || 'Unknown'}</td>
                    <td>{record.fromDate ? dayjs.utc(record.fromDate).local().format('DD MMM YYYY') : '-'} to {record.toDate ? dayjs.utc(record.toDate).local().format('DD MMM YYYY') : '-'}</td>
                    <td>{record.totalDays || 0} Day(s)</td>
                    <td>{record.created_at ? dayjs.utc(record.created_at).local().format('DD MMM YYYY') : '-'}</td>
                    <td><span className={`badge ${getStatusBadgeClass(record.status)}`}>{formatStatus(record.status)}</span></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5"><div className="empty-state"><p>No leave records found.</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal isOpen={isApplyOpen} onClose={() => setIsApplyOpen(false)} 
        title={`Apply Leave for ${employeeName}`} size="lg" footer={null}
      >
        <form className={styles.form} onSubmit={handleApplySubmit}>
          <div className="form-group">
            <label className="form-label">Leave Type</label>
            <div className={styles.leaveTypesGrid}>
              {balances.map(b => (
                <div 
                  key={b._id} 
                  className={`${styles.typeCard} ${leaveForm.leaveTypeId === b.leaveTypeId ? styles.typeCardActive : ''}`}
                  onClick={() => setLeaveForm(prev => ({ ...prev, leaveTypeId: b.leaveTypeId }))}
                >
                  <div className={styles.typeRadio}>
                    <div className={`${styles.radioCircle} ${leaveForm.leaveTypeId === b.leaveTypeId ? styles.radioSelected : ''}`} />
                  </div>
                  <div className={styles.typeContent}>
                    <span className={styles.typeName}>{b.leaveType?.leaveName}</span>
                    <span className={styles.typeBal}>{b.remaining} days available</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="fromDate">From Date</label>
              <input type="date" id="fromDate" name="fromDate" className="form-input" value={leaveForm.fromDate} onChange={handleApplyChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="toDate">To Date</label>
              <input type="date" id="toDate" name="toDate" className="form-input" value={leaveForm.toDate} onChange={handleApplyChange} required />
            </div>
          </div>

          {/* Per-Day Breakdown */}
          {leaveForm.days.length > 0 && (
            <div className={styles.breakdownSection}>
              <h4 className={styles.sectionTitle}>Daily Breakdown ({totalDays} Days)</h4>
              <div className={styles.daysList}>
                {leaveForm.days.map((d, idx) => (
                  <div key={idx} className={styles.dayRow}>
                    <span className={styles.dayDate}>{dayjs(d.date).format('DD MMM YYYY')}</span>
                    {d.dayType === 'weekend' ? (
                      <span className={styles.weekendTag}>Weekend (Sunday)</span>
                    ) : (
                      <select 
                        className="form-input" 
                        style={{ width: '160px', height: '32px', fontSize: '13px' }}
                        value={d.dayType}
                        onChange={(e) => handleDayTypeChange(idx, e.target.value)}
                      >
                        <option value="full">Full Day</option>
                        <option value="halfMorning">Half-Day Morning</option>
                        <option value="halfAfternoon">Half-Day Afternoon</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="form-label" htmlFor="reason">Reason</label>
            <textarea id="reason" name="reason" className="form-textarea" rows="2" value={leaveForm.reason} onChange={handleApplyChange} required placeholder="State your reason for leave..." />
          </div>

          {validationError && (
            <div className={styles.errorBanner}>
              <AlertCircle size={16} />
              <span>{validationError}</span>
            </div>
          )}

          <div className={styles.modalActions}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsApplyOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitDisabled}>
              {applying ? 'Submitting...' : 'Submit Leave Request'}
            </button>
          </div>
        </form>
      </Modal>

      <LeaveDetailsSlider 
        isOpen={isSliderOpen}
        onClose={() => setIsSliderOpen(false)}
        leave={selectedLeave}
      />
    </div>
  );
}
