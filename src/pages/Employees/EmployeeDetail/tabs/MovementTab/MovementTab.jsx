import { useState, useCallback } from 'react';
import { Plus, AlertCircle, CheckCircle, XCircle, Calendar, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useQuery, useMutation } from '../../../../../api/apollo.js';
import { GET_EMPLOYEE_MOVEMENTS, CREATE_MOVEMENT } from '../../../../../api/movementQueries.js';
import { getStatusBadgeClass, formatStatus } from '../../../../../utils';
import Modal from '../../../../../components/Modal';
import MovementDetailsSlider from '../../../../../components/MovementDetailsSlider/MovementDetailsSlider';

dayjs.extend(utc);

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

export default function MovementTab({ employeeId }) {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [toasts, setToasts] = useState([]);

  const [form, setForm] = useState({ movementDate: '', startTime: '', endTime: '', reason: '' });

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const { data, loading, refetch } = useQuery(GET_EMPLOYEE_MOVEMENTS, {
    variables: { empId: employeeId, page: 1, limit: 100 }
  });

  const [applyMovement, { loading: applying }] = useMutation(CREATE_MOVEMENT, {
    onCompleted: () => {
      setIsApplyOpen(false);
      setForm({ movementDate: '', startTime: '', endTime: '', reason: '' });
      setFormError('');
      refetch();
      showToast('Movement applied successfully!', 'success');
    },
    onError: err => setFormError(err.message)
  });

  const movements = data?.employeeMovements?.data || [];

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    await applyMovement({
      variables: {
        input: {
          employeeId,
          ...form
        }
      }
    });
  };

  return (
    <div className="card" style={{ padding: 0 }}>
      {/* Toast notifications */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onDone={() => removeToast(t.id)} />)}
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>Movement History</h3>
        <button className="btn btn-primary" onClick={() => { setIsApplyOpen(true); setFormError(''); }}>
          <Plus size={16} /> Apply Movement
        </button>
      </div>

      <div className="table-wrapper" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Movement Time (From — To)</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '24px' }}>Loading movements...</td></tr>
            ) : movements.length > 0 ? (
              movements.map((record) => (
                <tr key={record._id} className="clickable" onClick={() => { setSelectedMovement(record); setIsSliderOpen(true); }}>
                  <td className="font-medium text-primary">{dayjs.utc(record.movementDate).local().format('DD MMM YYYY')}</td>
                  <td>{record.movementTime}</td>
                  <td style={{ maxWidth: '300px' }} className="truncate" title={record.reason}>
                    {record.reason}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(record.status)}`}>
                      {formatStatus(record.status)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">
                  <div className="empty-state">
                    <p>No movement records found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Apply Movement Modal */}
      <Modal isOpen={isApplyOpen} onClose={() => setIsApplyOpen(false)} title="Apply Movement" size="md" footer={null}>
        <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} /> Movement Date
            </label>
            <input type="date" className="form-input" required value={form.movementDate} onChange={e => setForm({ ...form, movementDate: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> Start Time
              </label>
              <input type="time" className="form-input" required value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> End Time
              </label>
              <input type="time" className="form-input" required value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Reason</label>
            <textarea className="form-textarea" rows="3" required value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="Enter the reason for your movement..."></textarea>
          </div>

          {formError && (
            <div className="inline-error">
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsApplyOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={applying}>{applying ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      {/* View-only slider (no actions) */}
      <MovementDetailsSlider
        isOpen={isSliderOpen}
        onClose={() => setIsSliderOpen(false)}
        movement={selectedMovement}
        showActions={false}
      />
    </div>
  );
}
