import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '../../../api/apollo.js';
import { GET_MOVEMENT_SETTING, UPSERT_MOVEMENT_SETTING } from '../../../api/settingsQueries';
import { CheckCircle, XCircle, AlertCircle, Edit } from 'lucide-react';
import Modal from '../../../components/Modal';

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

export default function MovementSettings() {
  const { data, loading } = useQuery(GET_MOVEMENT_SETTING);
  const setting = data?.getMovementSetting;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState({
    limitCount: 4,
    limitFrequency: 'monthly',
    maxDurationMinutes: 120,
    daysBeforeApply: 1,
    autoApprovalEnabled: true,
  });

  const [formError, setFormError] = useState('');
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const [upsertSetting, { loading: saving }] = useMutation(UPSERT_MOVEMENT_SETTING, {
    refetchQueries: [{ query: GET_MOVEMENT_SETTING }],
  });

  const openEditDialog = () => {
    if (setting) {
      setForm({
        limitCount: setting.limitCount,
        limitFrequency: setting.limitFrequency,
        maxDurationMinutes: setting.maxDurationMinutes,
        daysBeforeApply: setting.daysBeforeApply,
        autoApprovalEnabled: setting.autoApprovalEnabled,
      });
    }
    setFormError('');
    setIsEditOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await upsertSetting({
        variables: {
          input: {
            limitCount: parseInt(form.limitCount, 10),
            limitFrequency: form.limitFrequency,
            maxDurationMinutes: parseInt(form.maxDurationMinutes, 10),
            daysBeforeApply: parseInt(form.daysBeforeApply, 10),
            autoApprovalEnabled: form.autoApprovalEnabled,
          },
        },
      });
      setIsEditOpen(false);
      showToast('Movement settings updated successfully!', 'success');
    } catch (err) {
      setFormError(err.message);
    }
  };

  const frequencyLabel = (val) => val === 'weekly' ? 'Weekly' : 'Monthly';

  return (
    <div className="card" style={{ padding: 0 }}>
      {/* Toast notifications */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onDone={() => removeToast(t.id)} />)}
        </div>
      )}

      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>Movement Register Settings</h3>
          <p className="text-muted text-sm" style={{ marginTop: '4px' }}>Configure global limits and rules for movement requests.</p>
        </div>
        {!loading && (
          <button className="btn btn-secondary" onClick={openEditDialog} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Edit size={16} /> Edit
          </button>
        )}
      </div>

      {/* Read-only Settings Details */}
      <div style={{ padding: '24px' }}>
        {loading ? <p className="text-muted">Loading settings...</p> : setting ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '600px' }}>
            <div className="info-row">
              <span className="info-label">Limit Count</span>
              <span className="info-value">{setting.limitCount}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Limit Frequency</span>
              <span className="info-value">{frequencyLabel(setting.limitFrequency)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Maximum Duration</span>
              <span className="info-value">{setting.maxDurationMinutes} Minutes</span>
            </div>
            <div className="info-row">
              <span className="info-label">Days Before Apply</span>
              <span className="info-value">{setting.daysBeforeApply} Day(s)</span>
            </div>
            <div className="info-row">
              <span className="info-label">Auto-Approval</span>
              <span className="info-value">
                <span className={`badge ${setting.autoApprovalEnabled ? 'badge-approved' : 'badge-rejected'}`}>
                  {setting.autoApprovalEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </span>
            </div>
          </div>
        ) : (
          <p className="text-muted">No settings configured yet. Click Edit to configure.</p>
        )}
      </div>

      {/* Edit Dialog */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Movement Settings" size="md" footer={null}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Limit Count</label>
            <input
              type="number" className="form-input" min="0" required
              value={form.limitCount}
              onChange={e => setForm({ ...form, limitCount: e.target.value })}
            />
            <span className="text-muted text-xs" style={{ marginTop: 4, display: 'block' }}>
              Maximum number of movements allowed per employee for the selected frequency.
            </span>
          </div>
          <div className="form-group">
            <label className="form-label">Limit Frequency</label>
            <select className="form-input" required value={form.limitFrequency} onChange={e => setForm({ ...form, limitFrequency: e.target.value })}>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Maximum Duration (Minutes)</label>
            <input
              type="number" className="form-input" min="15" required
              value={form.maxDurationMinutes}
              onChange={e => setForm({ ...form, maxDurationMinutes: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Days Before Apply</label>
            <input
              type="number" className="form-input" min="0" required
              value={form.daysBeforeApply}
              onChange={e => setForm({ ...form, daysBeforeApply: e.target.value })}
            />
            <span className="text-muted text-xs" style={{ marginTop: 4, display: 'block' }}>
              Minimum days to wait before applying for a movement. (0 = same day)
            </span>
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <input
              type="checkbox" id="autoApproval"
              checked={form.autoApprovalEnabled}
              onChange={e => setForm({ ...form, autoApprovalEnabled: e.target.checked })}
              style={{ marginTop: '3px' }}
            />
            <div>
              <label htmlFor="autoApproval" className="form-label" style={{ margin: 0 }}>Enable Auto-Approval</label>
              <span className="text-muted text-xs" style={{ display: 'block' }}>
                If enabled, movement requests are approved automatically without admin review.
              </span>
            </div>
          </div>

          {formError && (
            <div className="inline-error">
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '4px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
