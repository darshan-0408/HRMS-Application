import styles from './LeaveApplications.module.css';
import { useState, useMemo } from 'react';
import { Search, Filter, Calendar, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { useQuery, useMutation } from '../../api/apollo.js';
import { GET_LEAVE_APPLICATIONS, UPDATE_LEAVE, CANCEL_LEAVE, UPDATE_LEAVE_STATUS } from '../../api/leaveQueries';
import { GET_DEPARTMENTS } from '../../api/settingsQueries';
import { getStatusBadgeClass, formatStatus } from '../../utils';
import Pagination from '../../components/Pagination';
import LeaveDetailsSlider from '../../components/LeaveDetailsSlider/LeaveDetailsSlider';
import MonthPicker from '../../components/MonthPicker/MonthPicker';
import Modal from '../../components/Modal';

const DEFAULT_PAGE_SIZE = 10;

export default function LeaveApplications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ department: '', status: '', month: dayjs().format('YYYY-MM') });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  
  // Modals state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  
  // Update state
  const [updateForm, setUpdateForm] = useState({ fromDate: '', toDate: '', days: [] });

  const { data: deptData } = useQuery(GET_DEPARTMENTS);
  const { data: appData, loading: appLoading, refetch } = useQuery(GET_LEAVE_APPLICATIONS, {
    variables: { 
      filter: {
        ...(filters.status && { status: filters.status }),
        ...(filters.department && { department: filters.department }),
        ...(searchTerm && { search: searchTerm }),
        ...(filters.month && { fromDate: { $regex: `^${filters.month}` } }),
      },
      page,
      limit: pageSize
    }
  });

  const [updateLeave, { loading: updating }] = useMutation(UPDATE_LEAVE, {
    onCompleted: () => { setIsUpdateModalOpen(false); setIsSliderOpen(false); refetch(); },
    onError: (err) => alert(err.message)
  });

  const [cancelLeave, { loading: cancelling }] = useMutation(CANCEL_LEAVE, {
    onCompleted: () => { setIsCancelModalOpen(false); setIsSliderOpen(false); refetch(); },
    onError: (err) => alert(err.message)
  });

  const [updateStatus] = useMutation(UPDATE_LEAVE_STATUS, {
    onCompleted: () => { refetch(); },
    onError: (err) => alert(err.message)
  });

  const departments = deptData?.listDepartments || [];
  const applications = appData?.listLeaveApplications?.employees || [];
  const totalItems = appData?.listLeaveApplications?.total || 0;
  const totalPages = appData?.listLeaveApplications?.totalPages || 1;

  // Data is already filtered by backend — no client-side filtering needed
  const filteredData = applications;

  const handleRowClick = (leave) => {
    setSelectedLeave(leave);
    setIsSliderOpen(true);
  };

  const openUpdateModal = (leave) => {
    setUpdateForm({
      fromDate: leave.fromDate.split('T')[0],
      toDate: leave.toDate.split('T')[0],
      days: JSON.parse(JSON.stringify(leave.days)) // Deep copy
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateDayType = (idx, type) => {
    const newDays = [...updateForm.days];
    newDays[idx].dayType = type;
    setUpdateForm({ ...updateForm, days: newDays });
  };

  const handleUpdateSubmit = async () => {
    const totalDays = updateForm.days.reduce((acc, d) => {
      if (d.dayType === 'full') return acc + 1;
      if (d.dayType === 'halfMorning' || d.dayType === 'halfAfternoon') return acc + 0.5;
      return acc;
    }, 0);

    await updateLeave({
      variables: {
        input: {
          id: selectedLeave._id,
          fromDate: updateForm.fromDate,
          toDate: updateForm.toDate,
          days: updateForm.days.map(d => ({ date: d.date, dayType: d.dayType })),
          totalDays
        }
      }
    });
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h2 className="page-title">Leave Applications</h2>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className="search-wrapper">
          <Search size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Search employee or ID..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>

        <div className="filter-bar">
          <div className={styles.filterIcon}><Filter size={16} /> Filters</div>
          <select className="filter-select" value={filters.department} onChange={(e) => { setFilters({...filters, department: e.target.value}); setPage(1); }}>
            <option value="">All Departments</option>
            {departments.map(d => <option key={d._id} value={d.deptName}>{d.deptName}</option>)}
          </select>
          <select className="filter-select" value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <MonthPicker
            value={filters.month}
            onChange={(v) => setFilters({...filters, month: v})}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Employee Name</th>
                <th>Leave Type</th>
                <th>Leave Date(s)</th>
                <th>Days Req</th>
                <th>Dept Admin</th>
                <th>Admin</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appLoading ? (
                <tr><td colSpan="8" style={{textAlign:'center', padding:'24px'}}>Loading applications...</td></tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((leave) => (
                  <tr key={leave._id} className="clickable" onClick={() => handleRowClick(leave)}>
                    <td className="font-medium text-muted">{leave.employee?.empId}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="avatar">{leave.employee?.name.charAt(0)}</div>
                        <span className="font-semibold">{leave.employee?.name}</span>
                      </div>
                    </td>
                    <td><span className="font-medium text-primary">{leave.leaveType?.leaveName}</span></td>
                    <td>{dayjs(leave.fromDate).format('DD MMM')} - {dayjs(leave.toDate).format('DD MMM YYYY')}</td>
                    <td>{leave.totalDays}</td>
                    <td><span className={`badge ${getStatusBadgeClass(leave.deptAdminApproval)}`}>{formatStatus(leave.deptAdminApproval)}</span></td>
                    <td><span className={`badge ${getStatusBadgeClass(leave.adminApproval)}`}>{formatStatus(leave.adminApproval)}</span></td>
                    <td><span className={`badge ${getStatusBadgeClass(leave.status)}`}>{formatStatus(leave.status)}</span></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="8"><div className="empty-state"><Calendar size={32} /><p>No leave applications found.</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} total={totalItems} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(newSize) => { setPageSize(newSize); setPage(1); }} />
      </div>

      {/* Detail Slider */}
      <LeaveDetailsSlider 
        isOpen={isSliderOpen}
        onClose={() => setIsSliderOpen(false)}
        leave={selectedLeave}
        showActions={true}
        onUpdate={openUpdateModal}
        onCancel={() => setIsCancelModalOpen(true)}
      />

      {/* Update Modal */}
      <Modal 
        isOpen={isUpdateModalOpen} 
        onClose={() => setIsUpdateModalOpen(false)} 
        title="Update Leave Application"
        size="md"
        footer={
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', width: '100%' }}>
            <button className="btn btn-secondary" onClick={() => setIsUpdateModalOpen(false)}>Cancel Update</button>
            <button className="btn btn-primary" onClick={handleUpdateSubmit} disabled={updating}>Update</button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">From Date</label>
              <input type="date" className="form-input" value={updateForm.fromDate} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">To Date</label>
              <input type="date" className="form-input" value={updateForm.toDate} disabled />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Reason (Read-only)</label>
            <textarea className="form-textarea" rows="2" value={selectedLeave?.reason} disabled />
          </div>

          <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
            <table className="data-table" style={{ fontSize: '13px' }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day Type</th>
                </tr>
              </thead>
              <tbody>
                {updateForm.days.map((day, idx) => (
                  <tr key={idx}>
                    <td>{dayjs(day.date).format('DD MMM YYYY')}</td>
                    <td>
                      {day.dayType === 'weekend' ? 'Weekend' : (
                        <select 
                          className="form-input" 
                          style={{ height: '28px', padding: '0 8px' }}
                          value={day.dayType}
                          onChange={(e) => handleUpdateDayType(idx, e.target.value)}
                        >
                          <option value="full">Full Day</option>
                          <option value="halfMorning">Half-Day Morning</option>
                          <option value="halfAfternoon">Half-Day Afternoon</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal 
        isOpen={isCancelModalOpen} 
        onClose={() => setIsCancelModalOpen(false)} 
        title="Cancel Leave Application"
        size="sm"
        footer={null}
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div style={{ color: '#dc2626', marginBottom: '16px' }}><AlertCircle size={48} /></div>
          <h3>Are you sure?</h3>
          <p style={{ color: 'var(--text-muted)', margin: '8px 0 24px' }}>
            This will mark the leave application as Cancelled. This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-secondary" style={{ width: '100px' }} onClick={() => setIsCancelModalOpen(false)}>Cancel</button>
            <button className="btn btn-danger" style={{ width: '100px' }} onClick={() => cancelLeave({ variables: { id: selectedLeave._id } })} disabled={cancelling}>Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
