import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation } from '../../../api/apollo.js';
import {
  GET_DESIGNATIONS, CREATE_DESIGNATION, UPDATE_DESIGNATION, DELETE_DESIGNATION,
} from '../../../api/settingsQueries';
import Modal from '../../../components/Modal';
import DeleteConfirmModal from '../../../components/DeleteConfirmModal/DeleteConfirmModal';

export default function Designations() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const { data, loading, error } = useQuery(GET_DESIGNATIONS);
  const designations = data?.listDesignations || [];

  const [createDesignation] = useMutation(CREATE_DESIGNATION, { refetchQueries: [{ query: GET_DESIGNATIONS }] });
  const [updateDesignation] = useMutation(UPDATE_DESIGNATION, { refetchQueries: [{ query: GET_DESIGNATIONS }] });
  const [deleteDesignation] = useMutation(DELETE_DESIGNATION, { refetchQueries: [{ query: GET_DESIGNATIONS }] });

  const handleEdit = (d) => { setEditingData(d); setIsModalOpen(true); };
  const openNew = () => { setEditingData(null); setIsModalOpen(true); };
  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteDesignation({ variables: { id: itemToDelete } });
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (e) {
      alert(e.message);
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const input = { name: new FormData(e.target).get('name') };
    try {
      if (editingData) await updateDesignation({ variables: { id: editingData._id, input } });
      else await createDesignation({ variables: { input } });
      setIsModalOpen(false);
    } catch (e) { alert(e.message); }
  };

  return (
    <div className="card" style={{ padding: 0 }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>Designations</h3>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Add Designation</button>
      </div>
      {loading && <p className="text-muted text-center py-4">Loading...</p>}
      {error && <p className="text-danger text-center py-4">Error: {error.message}</p>}
      <div className="table-wrapper" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
        <table className="data-table">
          <thead><tr><th>Designation Name</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
          <tbody>
            {designations.length > 0 ? designations.map(d => (
              <tr key={d._id}>
                <td className="font-bold text-primary">{d.name}</td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                    <button className="btn-icon" onClick={() => handleEdit(d)}><Edit size={16} /></button>
                    <button className="btn-icon text-danger" onClick={() => handleDeleteClick(d._id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            )) : <tr><td colSpan="2"><p className="text-center text-muted py-4">No Designations Found</p></td></tr>}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingData ? 'Edit Designation' : 'Add Designation'} size="sm"
        footer={<><button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button><button type="submit" form="desig-form" className="btn btn-primary">Save</button></>}>
        <form id="desig-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Designation Name *</label>
            <input type="text" name="name" className="form-input" defaultValue={editingData?.name || ''} required />
          </div>
        </form>
      </Modal>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Designation"
        message="Are you sure you want to delete this designation? This will remove all associated data."
      />
    </div>
  );
}
