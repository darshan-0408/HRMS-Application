import styles from './MovementRegister.module.css';
import { useState, useCallback } from 'react';
import { Search, Filter, ArrowRightLeft, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useQuery, useMutation } from '../../api/apollo.js';
import { GET_MOVEMENTS, UPDATE_MOVEMENT, CANCEL_MOVEMENT } from '../../api/movementQueries.js';
import { GET_DEPARTMENTS } from '../../api/settingsQueries.js';
import { getStatusBadgeClass, formatStatus } from '../../utils';
import Pagination from '../../components/Pagination';
import MonthPicker from '../../components/MonthPicker/MonthPicker';
import MovementDetailsSlider from '../../components/MovementDetailsSlider/MovementDetailsSlider';
import Modal from '../../components/Modal';

dayjs.extend(utc);

const DEFAULT_PAGE_SIZE = 10;

function Toast({ message, type, onDone }) {
  setTimeout(onDone, 3000);
  return (
    <div className={`toast toast-${type}`}>
      {type === 'success' && <CheckCircle size={18} />}
      {type === 'error' && <XCircle size={18} />}
      {message}
    </div>
  );
}

export default function MovementRegister() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ department: '', status: '', month: dayjs().format('YYYY-MM') });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({ startTime: '', endTime: '', reason: '' });
  const [updateError, setUpdateError] = useState('');
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const { data: deptData } = useQuery(GET_DEPARTMENTS);
  const departments = deptData?.listDepartments || [];

  // All filters sent to backend
  const { data, loading, refetch } = useQuery(GET_MOVEMENTS, {
    variables: { 
      page, 
      limit: pageSize,
      filters: {
        ...(filters.status && { status: filters.status }),
        ...(filters.department && { department: filters.department }),
        ...(filters.month && { month: filters.month }),
        ...(searchTerm && { search: searchTerm }),
      }
    },
    fetchPolicy: 'cache-and-network'
  });

  const [updateMovement, { loading: updating }] = useMutation(UPDATE_MOVEMENT, {
    onCompleted: () => {
      setIsUpdateOpen(false);
      setDrawerOpen(false);
      setUpdateError('');
      refetch();
      showToast('Movement updated successfully!', 'success');
    },
    onError: err => setUpdateError(err.message)
  });

  const [cancelMovement] = useMutation(CANCEL_MOVEMENT, {
    onCompleted: () => {
      setDrawerOpen(false);
      refetch();
      showToast('Movement cancelled.', 'success');
    },
    onError: err => showToast(err.message, 'error')
  });

  const movements = data?.movements?.data || [];
  const totalItems = data?.movements?.total || 0;
  const totalPages = data?.movements?.totalPages || 1;

  const handleRowClick = (movement) => {
    setSelectedMovement(movement);
    setDrawerOpen(true);
  };

  const handleUpdateClick = (mov) => {
    setSelectedMovement(mov);
    setUpdateForm({ startTime: mov.startTime, endTime: mov.endTime, reason: mov.reason });
    setUpdateError('');
    setIsUpdateOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateError('');
    await updateMovement({
      variables: {
        id: selectedMovement._id,
        input: { ...updateForm }
      }
    });
  };

  const handleCancelClick = (mov) => {
    if (window.confirm('Are you sure you want to cancel this movement?')) {
      cancelMovement({ variables: { id: mov._id } });
    }
  };

  return (
    <div className="page-wrapper">
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onDone={() => removeToast(t.id)} />)}
        </div>
      )}

      <div className="page-header">
        <h2 className="page-title">Movement Register</h2>
      </div>

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
          <select className="filter-select" value={filters.status} onChange={(e) => { setFilters({...filters, status: e.target.value}); setPage(1); }}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <MonthPicker
            value={filters.month}
            onChange={(v) => { setFilters({...filters, month: v}); setPage(1); }}
          />
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Employee Name</th>
                <th>Movement Date</th>
                <th>Movement Time</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr><td colSpan="6" style={{textAlign:'center', padding: '24px'}}>Loading...</td></tr>
              ) : movements.length > 0 ? (
                movements.map((movement) => (
                  <tr key={movement._id} className="clickable" onClick={() => handleRowClick(movement)}>
                    <td className="font-medium text-muted">{movement.empId}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="avatar">{movement.empName?.charAt(0) || '-'}</div>
                        <span className="font-semibold">{movement.empName}</span>
                      </div>
                    </td>
                    <td className="font-medium text-primary">{dayjs.utc(movement.movementDate).local().format('DD MMM YYYY')}</td>
                    <td className="font-medium">{movement.movementTime}</td>
                    <td className="truncate" style={{ maxWidth: '250px' }} title={movement.reason}>{movement.reason}</td>
                    <td><span className={`badge ${getStatusBadgeClass(movement.status)}`}>{formatStatus(movement.status)}</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <ArrowRightLeft size={32} />
                      <p>No movement registers found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {!loading && <Pagination page={page} totalPages={totalPages} total={totalItems} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(newSize) => { setPageSize(newSize); setPage(1); }} />}
      </div>

      <MovementDetailsSlider
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        movement={selectedMovement}
        showActions={true}
        onUpdate={handleUpdateClick}
        onCancel={handleCancelClick}
      />

      <Modal isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)} title="Update Movement Time" size="md" footer={null}>
        <form onSubmit={handleUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> Start Time
              </label>
              <input type="time" className="form-input" required value={updateForm.startTime} onChange={e => setUpdateForm({ ...updateForm, startTime: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> End Time
              </label>
              <input type="time" className="form-input" required value={updateForm.endTime} onChange={e => setUpdateForm({ ...updateForm, endTime: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Reason</label>
            <textarea className="form-textarea" rows="3" required value={updateForm.reason} onChange={e => setUpdateForm({ ...updateForm, reason: e.target.value })}></textarea>
          </div>

          {updateError && (
            <div className="inline-error">
              <AlertCircle size={16} />
              <span>{updateError}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsUpdateOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={updating}>{updating ? 'Updating...' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
