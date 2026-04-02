import Modal from '../Modal/Modal';
import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title = "Confirm Deletion", message = "Are you sure you want to delete this item? This action cannot be undone." }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="xs"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} style={{ flex: 1 }}>Delete</button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '10px 0' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '24px', 
          background: 'var(--color-danger-50)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--color-danger-600)'
        }}>
          <AlertTriangle size={24} />
        </div>
        <div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
}
