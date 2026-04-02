import { useState } from 'react';
import { useQuery } from '../../api/apollo.js';
import styles from './EmployeeForm.module.css';
import { GET_DEPARTMENTS, GET_DESIGNATIONS, GET_EMP_TYPES, GET_EMP_CATEGORIES } from '../../api/settingsQueries';
import { LIST_EMPLOYEES } from '../../api/employeeQueries';

export default function EmployeeForm({ initialData, onSubmit, onCancel, id }) {
  const [activeTab, setActiveTab] = useState('basic');
  const [bankType, setBankType] = useState('primary'); // 'primary' or 'secondary'

  // --- Live data from backend ---
  const { data: deptData } = useQuery(GET_DEPARTMENTS);
  const { data: desigData } = useQuery(GET_DESIGNATIONS);
  const { data: typeData } = useQuery(GET_EMP_TYPES);
  const { data: catData } = useQuery(GET_EMP_CATEGORIES);
  const { data: empData } = useQuery(LIST_EMPLOYEES, { variables: { limit: 200 } });

  const departments = deptData?.listDepartments || [];
  const designations = desigData?.listDesignations || [];
  const empTypes = typeData?.listEmployeeTypes || [];
  const empCategories = catData?.listEmployeeCategories || [];
  const employees = empData?.listEmployees?.employees || [];

  // Manage bank details state locally to handle the toggle
  const [bankDetails, setBankDetails] = useState(initialData?.bankDetails || {
    primary: { accountType: '', accountNo: '', bankName: '', ifsc: '' },
    secondary: { accountType: '', accountNo: '', bankName: '', ifsc: '' }
  });

  const handleBankChange = (field, value) => {
    setBankDetails(prev => ({
      ...prev,
      [bankType]: { ...prev[bankType], [field]: value }
    }));
  };

  const tabs = [
    { id: 'basic', label: 'Basic' },
    { id: 'work', label: 'Work' },
    { id: 'personal', label: 'Personal' },
    { id: 'contact', label: 'Contact' },
    { id: 'bank', label: 'Bank' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      const invalidInput = form.querySelector(':invalid');
      if (invalidInput) {
        const tabSection = invalidInput.closest('.tab-section');
        if (tabSection) {
          const tabId = tabSection.id.replace('tab-', '');
          setActiveTab(tabId);
          setTimeout(() => invalidInput.reportValidity(), 10);
        }
      }
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Add the bank details which are managed via state
    data.bankDetails = bankDetails;
    
    onSubmit(data);
  };

  const handleNext = (e) => {
    if (e) e.preventDefault();
    const tabDiv = document.getElementById(`tab-${activeTab}`);
    if (tabDiv) {
      const inputs = tabDiv.querySelectorAll('input, select, textarea');
      for (let input of inputs) {
        if (!input.checkValidity()) {
          input.reportValidity();
          return;
        }
      }
    }
    const currentIdx = tabs.findIndex(t => t.id === activeTab);
    if (currentIdx < tabs.length - 1) setActiveTab(tabs[currentIdx + 1].id);
  };

  const handleBack = () => {
    const currentIdx = tabs.findIndex(t => t.id === activeTab);
    if (currentIdx > 0) setActiveTab(tabs[currentIdx - 1].id);
  };

  return (
    <form id={id} onSubmit={handleSubmit} className={styles.container} noValidate>
      {/* Internal Tabs */}
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {/* Basic Details */}
        <div id="tab-basic" className={`tab-section ${styles.formGrid}`} style={{ display: activeTab === 'basic' ? 'grid' : 'none' }}>
          <div className="form-group">
              <label className="form-label">Title</label>
              <select name="title" className="form-input" defaultValue={initialData?.title || ''}>
                <option value="">Select Title</option>
                <option value="Mr">Mr.</option>
                <option value="Ms">Ms.</option>
                <option value="Mrs">Mrs.</option>
                <option value="Dr">Dr.</option>
                <option value="Prof">Prof.</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input type="text" name="firstName" className="form-input" defaultValue={initialData?.firstName || ''} required />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input type="text" name="lastName" className="form-input" defaultValue={initialData?.lastName || ''} required />
            </div>
            <div className="form-group">
              <label className="form-label">E-Mail</label>
              <input type="email" name="email" className="form-input" defaultValue={initialData?.email || ''} required />
            </div>
            <div className="form-group">
              <label className="form-label">Contact</label>
              <input type="text" name="mobile" className="form-input" defaultValue={initialData?.mobile || ''} required />
            </div>
          </div>

        {/* Work Details */}
        <div id="tab-work" className={`tab-section ${styles.formGrid}`} style={{ display: activeTab === 'work' ? 'grid' : 'none' }}>
          <div className="form-group">
              <label className="form-label">HR Department</label>
              <select name="departmentId" className="form-input" defaultValue={initialData?.departmentId || ''} required>
                <option value="">Select Department</option>
                {departments.map(d => <option key={d._id} value={d._id}>{d.deptName}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Academics Department</label>
              <input type="text" name="academicDept" className="form-input" defaultValue={initialData?.academicDept || ''} />
            </div>
            <div className="form-group">
              <label className="form-label">Designation</label>
              <select name="designationId" className="form-input" defaultValue={initialData?.designationId || ''} required>
                <option value="">Select Designation</option>
                {designations.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date of Joining</label>
              <input type="date" name="doj" className="form-input" defaultValue={initialData?.doj || '2026-03-10'} required />
            </div>
            <div className="form-group">
              <label className="form-label">Employee Type</label>
              <select name="empTypeId" className="form-input" defaultValue={initialData?.empTypeId || ''}>
                <option value="">Select Type</option>
                {empTypes.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Employee Sub Type</label>
              <input type="text" name="empSubType" className="form-input" defaultValue={initialData?.empSubType || ''} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="empCategoryId" className="form-input" defaultValue={initialData?.empCategoryId || ''}>
                <option value="">Select Category</option>
                {empCategories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Hiring Source</label>
              <input type="text" name="hiringSource" className="form-input" defaultValue={initialData?.hiringSource || ''} />
            </div>
            <div className="form-group">
              <label className="form-label">Experience in Years</label>
              <input type="number" name="expYears" className="form-input" defaultValue={initialData?.expYears || 0} />
            </div>
            <div className="form-group">
              <label className="form-label">Experience in Months</label>
              <input type="number" name="expMonths" className="form-input" defaultValue={initialData?.expMonths || 0} />
            </div>
            <div className="form-group">
              <label className="form-label">Previous Qualification</label>
              <input type="text" name="qualification" className="form-input" defaultValue={initialData?.qualification || ''} />
            </div>
            <div className="form-group">
              <label className="form-label">Reporting To</label>
              <select name="reportingTo" className="form-input" defaultValue={initialData?.reportingTo || ''}>
                <option value="">Select Employee</option>
                {employees.map(e => <option key={e._id} value={e._id}>{e.firstName} {e.lastName} ({e.empId})</option>)}
              </select>
            </div>
          </div>

        {/* Personal Details */}
        <div id="tab-personal" className={`tab-section ${styles.formGrid}`} style={{ display: activeTab === 'personal' ? 'grid' : 'none' }}>
          <div className="form-group">
              <label className="form-label">Father Name</label>
              <input type="text" name="fatherName" className="form-input" defaultValue={initialData?.fatherName || ''} />
            </div>
            <div className="form-group">
              <label className="form-label">Aadhaar Number</label>
              <input type="text" name="aadhaar" className="form-input" defaultValue={initialData?.aadhaar || ''} />
            </div>
            <div className="form-group">
              <label className="form-label">PAN Number</label>
              <input type="text" name="pan" className="form-input" defaultValue={initialData?.pan || ''} />
            </div>
            <div className="form-group">
              <label className="form-label">Passport Number</label>
              <input type="text" name="passport" className="form-input" defaultValue={initialData?.passport || ''} />
            </div>
            <div className="form-group">
              <label className="form-label">PF Number</label>
              <input type="text" name="pfNumber" className="form-input" defaultValue={initialData?.pfNumber || ''} />
            </div>
            <div className="form-group">
              <label className="form-label">ESIC Number</label>
              <input type="text" name="esicNumber" className="form-input" defaultValue={initialData?.esicNumber || ''} />
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input type="date" name="dob" className="form-input" defaultValue={initialData?.dob || '2026-03-10'} />
            </div>
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select name="bloodGroup" className="form-input" defaultValue={initialData?.bloodGroup || ''}>
                <option value="">Select Blood Group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" className="form-input" defaultValue={initialData?.gender || ''}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Marital Status</label>
              <select name="maritalStatus" className="form-input" defaultValue={initialData?.maritalStatus || ''}>
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Religion</label>
              <input type="text" name="religion" className="form-input" defaultValue={initialData?.religion || ''} />
            </div>
            <div className="form-group">
              <label className="form-label">Caste</label>
              <input type="text" name="caste" className="form-input" defaultValue={initialData?.caste || ''} />
            </div>
            <div className="form-group">
              <label className="form-label">Personal Category</label>
              <input type="text" name="personalCategory" className="form-input" defaultValue={initialData?.personalCategory || ''} />
            </div>
          </div>

        {/* Contact Details */}
        <div id="tab-contact" className={`tab-section ${styles.formGrid}`} style={{ display: activeTab === 'contact' ? 'grid' : 'none' }}>
          <div className="form-group">
              <label className="form-label">Secondary Email</label>
              <input type="email" name="secondaryEmail" className="form-input" defaultValue={initialData?.secondaryEmail || ''} />
            </div>
            <div className="form-group">
              <label className="form-label">Secondary Contact</label>
              <input type="text" name="secondaryContact" className="form-input" defaultValue={initialData?.secondaryContact || ''} />
            </div>
            <div className="form-group">
              <label className="form-label">Scholar Link</label>
              <input type="text" name="scholarLink" className="form-input" defaultValue={initialData?.scholarLink || ''} />
            </div>
            <div className="form-group">
              <label className="form-label">LinkedIn Link</label>
              <input type="text" name="linkedinLink" className="form-input" defaultValue={initialData?.linkedinLink || ''} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Address Line 1</label>
              <input type="text" name="address1" className="form-input" defaultValue={initialData?.address1 || ''} />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Address Line 2</label>
              <input type="text" name="address2" className="form-input" defaultValue={initialData?.address2 || ''} />
            </div>
            <div className="form-group">
              <label className="form-label">Country</label>
              <input type="text" name="country" className="form-input" defaultValue={initialData?.country || 'India'} />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input type="text" name="state" className="form-input" defaultValue={initialData?.state || ''} />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input type="text" name="city" className="form-input" defaultValue={initialData?.city || ''} />
            </div>
            <div className="form-group">
              <label className="form-label">Pin Code</label>
              <input type="text" name="pincode" className="form-input" defaultValue={initialData?.pincode || ''} />
            </div>
          </div>

        {/* Bank Details */}
        <div id="tab-bank" className={`tab-section ${styles.container}`} style={{ display: activeTab === 'bank' ? 'flex' : 'none' }}>
          <div className={styles.bankToggle}>
              <button
                type="button"
                className={`${styles.bankToggleBtn} ${bankType === 'primary' ? styles.bankToggleBtnActive : ''}`}
                onClick={() => setBankType('primary')}
              >
                Primary Account
              </button>
              <button
                type="button"
                className={`${styles.bankToggleBtn} ${bankType === 'secondary' ? styles.bankToggleBtnActive : ''}`}
                onClick={() => setBankType('secondary')}
              >
                Secondary Account
              </button>
            </div>

            <div className={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Account Type</label>
                <select 
                  className="form-input" 
                  value={bankDetails[bankType].accountType}
                  onChange={(e) => handleBankChange('accountType', e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Account Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={bankDetails[bankType].accountNo}
                  onChange={(e) => handleBankChange('accountNo', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Bank Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={bankDetails[bankType].bankName}
                  onChange={(e) => handleBankChange('bankName', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">IFSC Code</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={bankDetails[bankType].ifsc}
                  onChange={(e) => handleBankChange('ifsc', e.target.value)}
                />
              </div>
            </div>
            <p className="text-muted text-xs" style={{ marginTop: '12px' }}>
              * You are editing the <strong>{bankType}</strong> account details. Switch tabs above to manage the other account.
            </p>
          </div>
      </div>

      {/* Form Footer */}
      <div className={styles.formFooter}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <div style={{ display: 'flex', gap: '12px' }}>
          {activeTab !== 'basic' && (
            <button key="back-btn" type="button" className="btn btn-secondary" onClick={handleBack}>Back</button>
          )}
          {activeTab !== 'bank' ? (
            <button key="next-btn" type="button" className="btn btn-primary" onClick={handleNext}>Next</button>
          ) : (
            <button key="submit-btn" type="submit" className="btn btn-primary">Submit Details</button>
          )}
        </div>
      </div>
    </form>
  );
}
