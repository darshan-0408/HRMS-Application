import styles from './EmployeeList.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { useQuery, useMutation } from '../../../api/apollo.js';
import { LIST_EMPLOYEES, CREATE_EMPLOYEE } from '../../../api/employeeQueries';
import { GET_DEPARTMENTS, GET_DESIGNATIONS } from '../../../api/settingsQueries';
import { getStatusBadgeClass, formatStatus } from '../../../utils';
import Pagination from '../../../components/Pagination';
import Modal from '../../../components/Modal';
import EmployeeForm from '../../../components/EmployeeForm/EmployeeForm';

const PAGE_SIZE = 10;

export default function EmployeeList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ departmentId: '', status: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data, loading, error, refetch } = useQuery(LIST_EMPLOYEES, {
    variables: {
      filter: {
        search: searchTerm || undefined,
        departmentId: filters.departmentId || undefined,
        status: filters.status || undefined,
      },
      page,
      limit: pageSize,
    },
    fetchPolicy: 'cache-and-network',
  });

  const { data: deptData } = useQuery(GET_DEPARTMENTS);
  const departments = deptData?.listDepartments || [];

  const employees = data?.listEmployees?.employees || [];
  const total = data?.listEmployees?.total || 0;
  const totalPages = data?.listEmployees?.totalPages || 1;

  const [createEmployee] = useMutation(CREATE_EMPLOYEE, {
    onCompleted: () => {
      setIsAddModalOpen(false);
      refetch();
    },
  });

  const handleAddSubmit = async (formData) => {
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
        bankAccounts: [
          ...(formData.primaryAccountNo ? [{
            accountCategory: 'primary',
            accountType: formData.primaryAccountType || undefined,
            accountNo: formData.primaryAccountNo || undefined,
            bankName: formData.primaryBankName || undefined,
            ifsc: formData.primaryIfsc || undefined,
          }] : []),
          ...(formData.secondaryAccountNo ? [{
            accountCategory: 'secondary',
            accountType: formData.secondaryAccountType || undefined,
            accountNo: formData.secondaryAccountNo || undefined,
            bankName: formData.secondaryBankName || undefined,
            ifsc: formData.secondaryIfsc || undefined,
          }] : []),
        ],
      };
      await createEmployee({ variables: { input } });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h2 className="page-title">Employees</h2>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} /> Add Employee
        </button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className={styles.toolbar}>
          <div className="search-wrapper">
            <Search size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, ID, or email..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            />
          </div>

          <div className="filter-bar">
            <div className={styles.filterIcon}><Filter size={16} /> Filters</div>
            <select name="departmentId" className="filter-select" value={filters.departmentId} onChange={handleFilterChange}>
              <option value="">All Departments</option>
              {departments.map(d => <option key={d._id} value={d._id}>{d.deptName}</option>)}
            </select>
            <select name="status" className="filter-select" value={filters.status} onChange={handleFilterChange}>
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {loading && <p className="text-muted text-center py-4">Loading employees...</p>}
        {error && <p className="text-danger text-center py-4">Error: {error.message}</p>}

        <div className="table-wrapper" style={{ borderRadius: 0, border: 'none', boxShadow: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Emp ID</th><th>Name</th><th>Department</th>
                <th>Designation</th><th>Mobile</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? employees.map((emp) => (
                <tr key={emp._id} className={styles.clickableRow} onClick={() => navigate(`/employees/${emp._id}`)}>
                  <td><span className="badge badge-active">{emp.empId}</span></td>
                  <td className="font-bold">{emp.name || `${emp.firstName} ${emp.lastName}`}</td>
                  <td>{emp.department?.deptName || '—'}</td>
                  <td>{emp.designation?.name || '—'}</td>
                  <td>{emp.mobile}</td>
                  <td><span className={`badge ${getStatusBadgeClass(emp.status)}`}>{formatStatus(emp.status)}</span></td>
                </tr>
              )) : (
                !loading && <tr><td colSpan="6"><p className="text-center text-muted py-4">No employees found.</p></td></tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination 
          page={page} 
          totalPages={totalPages} 
          onPageChange={setPage} 
          total={total} 
          pageSize={pageSize}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(1);
          }}
        />
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}
        title="Add New Faculty / Staff" size="lg" footer={null}>
        <EmployeeForm id="add-emp-form" onSubmit={handleAddSubmit} onCancel={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
}
