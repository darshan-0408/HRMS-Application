import styles from './EmployeeDetail.module.css';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserMinus, Edit, MoreVertical } from 'lucide-react';
import { useQuery, useMutation } from '../../../api/apollo.js';
import { GET_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE } from '../../../api/employeeQueries';
import { getStatusBadgeClass, formatStatus } from '../../../utils';
import Modal from '../../../components/Modal';
import EmployeeForm from '../../../components/EmployeeForm/EmployeeForm';

import SummaryTab from './tabs/SummaryTab/SummaryTab';
import AttendanceTab from './tabs/AttendanceTab/AttendanceTab';
import MovementTab from './tabs/MovementTab/MovementTab';
import LeaveTab from './tabs/LeaveTab/LeaveTab';

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');
  const [showMenu, setShowMenu] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_EMPLOYEE, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
  });

  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE, {
    onCompleted: () => { setIsEditModalOpen(false); refetch(); },
  });

  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    onCompleted: () => navigate('/employees'),
  });

  if (loading) return <div className="page-wrapper" style={{ padding: 24 }}>Loading employee...</div>;
  if (error)   return <div className="page-wrapper" style={{ padding: 24 }}>Error: {error.message}</div>;

  const employee = data?.getEmployee;
  if (!employee) return <div className="page-wrapper" style={{ padding: 24 }}>Employee not found.</div>;

  const displayName = employee.name || `${employee.firstName} ${employee.lastName}`;

  const handleRelieve = () => {
    if (window.confirm('Are you sure you want to relieve this employee?')) {
      deleteEmployee({ variables: { id } });
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      const input = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        departmentId: formData.departmentId || undefined,
        academicDept: formData.academicDept || undefined,
        designationId: formData.designationId || undefined,
        doj: formData.doj || undefined,
        empTypeId: formData.empTypeId || undefined,
        empSubType: formData.empSubType || undefined,
        empCategoryId: formData.empCategoryId || undefined,
        hiringSource: formData.hiringSource || undefined,
        expYears: formData.expYears ? parseInt(formData.expYears, 10) : undefined,
        expMonths: formData.expMonths ? parseInt(formData.expMonths, 10) : undefined,
        qualification: formData.qualification || undefined,
        reportingTo: formData.reportingTo || undefined,
        title: formData.title || undefined,
        fatherName: formData.fatherName || undefined,
        aadhaar: formData.aadhaar || undefined,
        pan: formData.pan || undefined,
        passport: formData.passport || undefined,
        pfNumber: formData.pfNumber || undefined,
        esicNumber: formData.esicNumber || undefined,
        dob: formData.dob || undefined,
        bloodGroup: formData.bloodGroup || undefined,
        gender: formData.gender || undefined,
        maritalStatus: formData.maritalStatus || undefined,
        religion: formData.religion || undefined,
        caste: formData.caste || undefined,
        personalCategory: formData.personalCategory || undefined,
        secondaryEmail: formData.secondaryEmail || undefined,
        secondaryContact: formData.secondaryContact || undefined,
        scholarLink: formData.scholarLink || undefined,
        linkedinLink: formData.linkedinLink || undefined,
        address: {
          address1: formData.address1 || '',
          address2: formData.address2 || '',
          country: formData.country || 'India',
          state: formData.state || '',
          city: formData.city || '',
          pincode: formData.pincode || '',
        },
      };
      await updateEmployee({ variables: { id, input } });
    } catch (err) {
      alert(err.message);
    }
  };

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'movements', label: 'Movements' },
    { id: 'leaves', label: 'Leave Applications' },
  ];

  return (
    <div className="page-wrapper" style={{ padding: 0 }}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <button className="btn-icon" onClick={() => navigate('/employees')} title="Back to list">
            <ArrowLeft size={18} />
          </button>
          <div className="avatar avatar-lg">{displayName.charAt(0)}</div>
          <div className={styles.empInfo}>
            <div className={styles.empNameRow}>
              <h2 className={styles.empName}>{displayName}</h2>
              <span className={`badge ${getStatusBadgeClass(employee.status)}`}>
                {formatStatus(employee.status)}
              </span>
            </div>
            <p className={styles.empSub}>
              {employee.empId} • {employee.designation?.name || '—'} • {employee.department?.deptName || '—'}
            </p>
          </div>
        </div>
        <div className={styles.topBarRight} style={{ position: 'relative' }}>
          <button className="btn-icon" onClick={() => setShowMenu(!showMenu)}>
            <MoreVertical size={20} />
          </button>
          {showMenu && (
            <div className="dropdown-menu" style={{ display: 'flex', flexDirection: 'column' }}>
              <button className="dropdown-item" onClick={() => { setShowMenu(false); setIsEditModalOpen(true); }}>
                <Edit size={16} /> Edit User
              </button>
              {employee.status === 'active' && (
                <button className="dropdown-item danger" onClick={() => { setShowMenu(false); handleRelieve(); }}>
                  <UserMinus size={16} /> Relieve Employee
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs Bar */}
      <div className={styles.tabsContainer}>
        <div className="tabs-bar">
          {tabs.map((t) => (
            <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'summary'    && <SummaryTab employee={employee} />}
        {activeTab === 'attendance' && <AttendanceTab employeeId={id} />}
        {activeTab === 'movements'  && <MovementTab employeeId={id} />}
        {activeTab === 'leaves'     && <LeaveTab employeeId={id} employeeName={displayName} dept={employee.department?.deptName} />}
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}
        title="Update Faculty / Staff Details" size="lg" footer={null}>
        <EmployeeForm
          id="edit-emp-form"
          initialData={{
            ...employee,
            departmentId: employee.departmentId,
            designationId: employee.designationId,
            empTypeId: employee.empTypeId,
            empCategoryId: employee.empCategoryId,
            address1: employee.address?.address1,
            address2: employee.address?.address2,
            country: employee.address?.country,
            state: employee.address?.state,
            city: employee.address?.city,
            pincode: employee.address?.pincode,
          }}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
