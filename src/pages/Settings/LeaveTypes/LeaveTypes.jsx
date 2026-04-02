import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation } from '../../../api/apollo.js';
import {
  GET_LEAVE_TYPES, CREATE_LEAVE_TYPE, UPDATE_LEAVE_TYPE, DELETE_LEAVE_TYPE,
} from '../../../api/settingsQueries';
import Modal from '../../../components/Modal';
import DeleteConfirmModal from '../../../components/DeleteConfirmModal/DeleteConfirmModal';

export default function LeaveTypes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const { data, loading, error } = useQuery(GET_LEAVE_TYPES);
  const leaveTypes = data?.listLeaveTypes || [];

  const [createLeaveType] = useMutation(CREATE_LEAVE_TYPE, { refetchQueries: [{ query: GET_LEAVE_TYPES }] });
  const [updateLeaveType] = useMutation(UPDATE_LEAVE_TYPE, { refetchQueries: [{ query: GET_LEAVE_TYPES }] });
  const [deleteLeaveType] = useMutation(DELETE_LEAVE_TYPE, { refetchQueries: [{ query: GET_LEAVE_TYPES }] });

  const handleEdit = (lt) => { setEditingData(lt); setIsModalOpen(true); };
  const openNew = () => { setEditingData(null); setIsModalOpen(true); };
  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteLeaveType({ variables: { id: itemToDelete } });
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (e) {
      alert(e.message);
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const input = {
      leaveCode: fd.get('leaveCode'),
      leaveName: fd.get('leaveName'),
      category: fd.get('category'),
      maxConsecutiveDays: parseInt(fd.get('maxConsecutiveDays'), 10),
    };
    try {
      if (editingData) await updateLeaveType({ variables: { id: editingData._id, input } });
      else await createLeaveType({ variables: { input } });
      setIsModalOpen(false);
    } catch (e) { alert(e.message); }
  };

  const categoryBadge = (cat) => {
    const map = { paid: 'badge-active', unpaid: 'badge-inactive', restricted: 'badge-warning' };
    return map[cat] || 'badge-inactive';
  };

  return (
    <div className="card" style={{ padding: 0 }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>Leave Types</h3>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Add Leave Type</button>
      </div>
      {loading && <p className="text-muted text-center py-4">Loading...</p>}
      {error && <p className="text-danger text-center py-4">Error: {error.message}</p>}
      <div className="table-wrapper" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
        <table className="data-table">
          <thead>
            <tr><th>Code</th><th>Leave Name</th><th>Category</th><th>Max Days</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
          </thead>
          <tbody>
            {leaveTypes.length > 0 ? leaveTypes.map(lt => (
              <tr key={lt._id}>
                <td><span className="badge badge-active">{lt.leaveCode}</span></td>
                <td className="font-bold">{lt.leaveName}</td>
                <td><span className={`badge ${categoryBadge(lt.category)}`}>{lt.category}</span></td>
                <td>{lt.maxConsecutiveDays} days</td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <button className="btn-icon" onClick={() => handleEdit(lt)}><Edit size={16} /></button>
                    <button className="btn-icon text-danger" onClick={() => handleDeleteClick(lt._id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            )) : <tr><td colSpan="5"><p className="text-center text-muted py-4">No Leave Types Found</p></td></tr>}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingData ? 'Edit Leave Type' : 'Add Leave Type'} size="sm"
        footer={<><button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button><button type="submit" form="lt-form" className="btn btn-primary">Save</button></>}>
        <form id="lt-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Leave Code *</label>
            <input type="text" name="leaveCode" className="form-input" defaultValue={editingData?.leaveCode || ''} required />
          </div>
          <div className="form-group">
            <label className="form-label">Leave Name *</label>
            <input type="text" name="leaveName" className="form-input" defaultValue={editingData?.leaveName || ''} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select name="category" className="form-input" defaultValue={editingData?.category || ''} required>
              <option value="" disabled>Select Category</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Max Consecutive Days *</label>
            <input type="number" name="maxConsecutiveDays" className="form-input" defaultValue={editingData?.maxConsecutiveDays || 1} min="1" required />
          </div>
        </form>
      </Modal>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Leave Type"
        message="Are you sure you want to delete this leave type? This will remove all associated data."
      />
    </div>
  );
}
