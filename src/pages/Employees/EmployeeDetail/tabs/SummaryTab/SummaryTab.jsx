import styles from './SummaryTab.module.css';

export default function SummaryTab({ employee }) {
  if (!employee) return null;

  // Backend returns nested objects, not flat strings
  const deptName   = employee.department?.deptName || '-';
  const desigName  = employee.designation?.name    || '-';
  const empTypeName  = employee.empType?.name      || '-';
  const empCatName   = employee.empCategory?.name  || '-';
  const reportingName = employee.reportingEmployee
    ? `${employee.reportingEmployee.name} (${employee.reportingEmployee.empId})`
    : '-';

  // bankAccounts is an array [{accountCategory:'primary',...}, {accountCategory:'secondary',...}]
  const primaryBank   = employee.bankAccounts?.find(b => b.accountCategory === 'primary')   || {};
  const secondaryBank = employee.bankAccounts?.find(b => b.accountCategory === 'secondary') || {};

  // address is a nested object
  const addr = employee.address || {};

  return (
    <div className={styles.container}>
      {/* Work Details */}
      <div className="card">
        <h3 className={styles.sectionTitle}>Work &amp; Academic Details</h3>
        <div className={styles.grid4}>
          <div className="info-row"><span className="info-label">HR Department</span><span className="info-value">{deptName}</span></div>
          <div className="info-row"><span className="info-label">Academic Dept</span><span className="info-value">{employee.academicDept || '-'}</span></div>
          <div className="info-row"><span className="info-label">Designation</span><span className="info-value">{desigName}</span></div>
          <div className="info-row"><span className="info-label">Date of Joining</span><span className="info-value">{employee.doj ? employee.doj.split('T')[0] : '-'}</span></div>
          <div className="info-row"><span className="info-label">Employee Type</span><span className="info-value">{empTypeName}</span></div>
          <div className="info-row"><span className="info-label">Category</span><span className="info-value">{empCatName}</span></div>
          <div className="info-row"><span className="info-label">Reporting To</span><span className="info-value">{reportingName}</span></div>
          <div className="info-row"><span className="info-label">Experience</span><span className="info-value">{employee.expYears ? `${employee.expYears}y ${employee.expMonths || 0}m` : '-'}</span></div>
          <div className="info-row"><span className="info-label">Qualification</span><span className="info-value">{employee.qualification || '-'}</span></div>
          <div className="info-row"><span className="info-label">Hiring Source</span><span className="info-value">{employee.hiringSource || '-'}</span></div>
        </div>
      </div>

      <div className={styles.grid2Row}>
        {/* Personal Details */}
        <div className="card">
          <h3 className={styles.sectionTitle}>Personal Details</h3>
          <div className={styles.grid2}>
            <div className="info-row"><span className="info-label">Date of Birth</span><span className="info-value">{employee.dob ? employee.dob.split('T')[0] : '-'}</span></div>
            <div className="info-row"><span className="info-label">Gender</span><span className="info-value">{employee.gender || '-'}</span></div>
            <div className="info-row"><span className="info-label">Father's Name</span><span className="info-value">{employee.fatherName || '-'}</span></div>
            <div className="info-row"><span className="info-label">Blood Group</span><span className="info-value">{employee.bloodGroup || '-'}</span></div>
            <div className="info-row"><span className="info-label">Marital Status</span><span className="info-value">{employee.maritalStatus || '-'}</span></div>
            <div className="info-row"><span className="info-label">Religion</span><span className="info-value">{employee.religion || '-'}</span></div>
            <div className="info-row"><span className="info-label">PAN Number</span><span className="info-value">{employee.pan || '-'}</span></div>
            <div className="info-row"><span className="info-label">Aadhaar Number</span><span className="info-value">{employee.aadhaar || '-'}</span></div>
            <div className="info-row"><span className="info-label">PF Number</span><span className="info-value">{employee.pfNumber || '-'}</span></div>
            <div className="info-row"><span className="info-label">ESIC Number</span><span className="info-value">{employee.esicNumber || '-'}</span></div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="card">
          <h3 className={styles.sectionTitle}>Contact &amp; Links</h3>
          <div className={styles.grid2}>
            <div className="info-row"><span className="info-label">Mobile Number</span><span className="info-value">{employee.mobile || '-'}</span></div>
            <div className="info-row"><span className="info-label">Official Email</span><span className="info-value">{employee.email || '-'}</span></div>
            <div className="info-row"><span className="info-label">Secondary Contact</span><span className="info-value">{employee.secondaryContact || '-'}</span></div>
            <div className="info-row"><span className="info-label">Secondary Email</span><span className="info-value">{employee.secondaryEmail || '-'}</span></div>
            <div className="info-row">
              <span className="info-label">LinkedIn</span>
              <span className="info-value">{employee.linkedinLink ? <a href={employee.linkedinLink} target="_blank" rel="noreferrer" className="text-primary">Profile</a> : '-'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Scholar Link</span>
              <span className="info-value">{employee.scholarLink ? <a href={employee.scholarLink} target="_blank" rel="noreferrer" className="text-primary">Profile</a> : '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="card">
        <h3 className={styles.sectionTitle}>Bank Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div>
            <p className="text-xs font-bold text-muted mb-2 uppercase">Primary Account</p>
            <div className={styles.grid2} style={{ background: 'var(--color-bg)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div className="info-row"><span className="info-label">Bank</span><span className="info-value">{primaryBank.bankName || '-'}</span></div>
              <div className="info-row"><span className="info-label">Account No</span><span className="info-value">{primaryBank.accountNo || '-'}</span></div>
              <div className="info-row"><span className="info-label">IFSC</span><span className="info-value">{primaryBank.ifsc || '-'}</span></div>
              <div className="info-row"><span className="info-label">Type</span><span className="info-value">{primaryBank.accountType || '-'}</span></div>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-muted mb-2 uppercase">Secondary Account</p>
            <div className={styles.grid2} style={{ background: 'var(--color-bg)', padding: '12px', borderRadius: 'var(--radius-md)', opacity: secondaryBank.accountNo ? 1 : 0.5 }}>
              <div className="info-row"><span className="info-label">Bank</span><span className="info-value">{secondaryBank.bankName || '-'}</span></div>
              <div className="info-row"><span className="info-label">Account No</span><span className="info-value">{secondaryBank.accountNo || '-'}</span></div>
              <div className="info-row"><span className="info-label">IFSC</span><span className="info-value">{secondaryBank.ifsc || '-'}</span></div>
              <div className="info-row"><span className="info-label">Type</span><span className="info-value">{secondaryBank.accountType || '-'}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="card">
        <h3 className={styles.sectionTitle}>Address</h3>
        <p className={styles.addressText}>
          {addr.address1 || '-'}<br />
          {addr.address2 && <>{addr.address2}<br /></>}
          {addr.city && `${addr.city}, `}{addr.state && `${addr.state} `}{addr.pincode && `- ${addr.pincode}`}<br />
          {addr.country || 'India'}
        </p>
      </div>
    </div>
  );
}
