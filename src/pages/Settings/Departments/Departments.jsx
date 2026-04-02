import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation } from '../../../api/apollo.js';
import {
  GET_DEPARTMENTS,
  CREATE_DEPARTMENT,
  UPDATE_DEPARTMENT,
  DELETE_DEPARTMENT,
} from '../../../api/settingsQueries';
import Modal from '../../../components/Modal';
import DeleteConfirmModal from '../../../components/DeleteConfirmModal/DeleteConfirmModal';

export default function Departments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const { data, loading, error } = useQuery(GET_DEPARTMENTS);
  const departments = data?.listDepartments || [];

  const [createDepartment] = useMutation(CREATE_DEPARTMENT, {
    refetchQueries: [{ query: GET_DEPARTMENTS }],
  });
  const [updateDepartment] = useMutation(UPDATE_DEPARTMENT, {
    refetchQueries: [{ query: GET_DEPARTMENTS }],
  });
  const [deleteDepartment] = useMutation(DELETE_DEPARTMENT, {
    refetchQueries: [{ query: GET_DEPARTMENTS }],
  });

  const handleEdit = (dept) => { setEditingData(dept); setIsModalOpen(true); };
  const openNew = () => { setEditingData(null); setIsModalOpen(true); };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteDepartment({ variables: { id: itemToDelete } });
      setIsDeleteModalOpen(true); // Keep it open or close it? Close it.
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const input = {
      deptName: formData.get('deptName'),
      shortName: formData.get('shortName'),
      deptCode: formData.get('deptCode'),
      admin: formData.get('admin'),
      adminContact: formData.get('adminContact'),
    };
    try {
      if (editingData) {
        await updateDepartment({ variables: { id: editingData._id, input } });
      } else {
        await createDepartment({ variables: { input } });
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="card" style={{ padding: 0 }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>Departments</h3>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Add Department</button>
      </div>

      {loading && <p className="text-muted text-center py-4">Loading...</p>}
      {error && <p className="text-danger text-center py-4">Error: {error.message}</p>}

      <div className="table-wrapper" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Department Name</th>
              <th>Code</th>
              <th>Admin</th>
              <th>Admin Contact</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.length > 0 ? departments.map((d) => (
              <tr key={d._id}>
                <td className="font-bold text-primary">{d.deptName}</td>
                <td>{d.deptCode || '—'}</td>
                <td>{d.admin || '—'}</td>
                <td>{d.adminContact || '—'}</td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <button className="btn-icon" onClick={() => handleEdit(d)} title="Edit"><Edit size={16} /></button>
                    <button className="btn-icon text-danger" onClick={() => handleDeleteClick(d._id)} title="Delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5"><p className="text-center text-muted py-4">No Departments Found</p></td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        title={editingData ? 'Edit Department' : 'Add Department'} size="sm"
        footer={<>
          <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
          <button type="submit" form="dept-form" className="btn btn-primary">Save</button>
        </>}
      >
        <form id="dept-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Department Name *</label>
            <input type="text" name="deptName" className="form-input" defaultValue={editingData?.deptName || ''} required />
          </div>
          <div className="form-group">
            <label className="form-label">Short Name</label>
            <input type="text" name="shortName" className="form-input" defaultValue={editingData?.shortName || ''} />
          </div>
          <div className="form-group">
            <label className="form-label">Department Code</label>
            <input type="text" name="deptCode" className="form-input" defaultValue={editingData?.deptCode || ''} />
          </div>
          <div className="form-group">
            <label className="form-label">Admin Name</label>
            <input type="text" name="admin" className="form-input" defaultValue={editingData?.admin || ''} />
          </div>
          <div className="form-group">
            <label className="form-label">Admin Contact</label>
            <input type="text" name="adminContact" className="form-input" defaultValue={editingData?.adminContact || ''} />
          </div>
        </form>
      </Modal>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Department"
        message="Are you sure you want to delete this department? This will remove all associated data."
      />
    </div>
  );
}
