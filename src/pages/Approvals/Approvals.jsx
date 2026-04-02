import styles from './Approvals.module.css';
import { useState } from 'react';
import { Search, Filter, CheckSquare } from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useQuery } from '../../api/apollo.js';
import { GET_APPROVALS } from '../../api/approvalQueries';
import { GET_DEPARTMENTS } from '../../api/settingsQueries';
import { getStatusBadgeClass, formatStatus } from '../../utils';
import Pagination from '../../components/Pagination';
import LeaveDetailsSlider from '../../components/LeaveDetailsSlider/LeaveDetailsSlider';
import MovementDetailsSlider from '../../components/MovementDetailsSlider/MovementDetailsSlider';

dayjs.extend(utc);

const DEFAULT_PAGE_SIZE = 10;

export default function Approvals() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ department: '', approvalType: 'all', status: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // Sliders (view-only)
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [leaveSliderOpen, setLeaveSliderOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [movementSliderOpen, setMovementSliderOpen] = useState(false);

  // Department list for filter
  const { data: deptData } = useQuery(GET_DEPARTMENTS);
  const departments = deptData?.listDepartments || [];

  // Single unified backend query with all filters + pagination
  const { data, loading } = useQuery(GET_APPROVALS, {
    variables: {
      filters: {
        ...(searchTerm && { search: searchTerm }),
        ...(filters.department && { department: filters.department }),
        ...(filters.status && { status: filters.status }),
        ...(filters.approvalType !== 'all' && { approvalType: filters.approvalType }),
      },
      page,
      limit: pageSize,
    },
    fetchPolicy: 'cache-and-network',
  });

  const approvals = data?.approvals?.data || [];
  const totalItems = data?.approvals?.total || 0;
  const totalPages = data?.approvals?.totalPages || 1;

  const handleRowClick = (item) => {
    if (item.type === 'leave' && item.leaveData) {
      setSelectedLeave(item.leaveData);
      setLeaveSliderOpen(true);
    } else if (item.type === 'movement' && item.movementData) {
      setSelectedMovement(item.movementData);
      setMovementSliderOpen(true);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h2 className="page-title">Approvals</h2>
      </div>

      <div className={styles.toolbar}>
        <div className="search-wrapper">
          <Search size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Search employee or ID..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>

        <div className="filter-bar">
          <div className={styles.filterIcon}><Filter size={16} /> Filters</div>
          <select className="filter-select" value={filters.approvalType} onChange={(e) => { setFilters({...filters, approvalType: e.target.value}); setPage(1); }}>
            <option value="all">All Types</option>
            <option value="leave">Employee Leave</option>
            <option value="movement">Movement Register</option>
          </select>
          <select className="filter-select" value={filters.department} onChange={(e) => { setFilters({...filters, department: e.target.value}); setPage(1); }}>
            <option value="">All Departments</option>
            {departments.map(d => <option key={d._id} value={d.deptName}>{d.deptName}</option>)}
          </select>
          <select className="filter-select" value={filters.status} onChange={(e) => { setFilters({...filters, status: e.target.value}); setPage(1); }}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Approval Type</th>
                <th>Requested Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{textAlign:'center', padding:'24px'}}>Loading approvals...</td></tr>
              ) : approvals.length > 0 ? (
                approvals.map((item) => (
                  <tr key={item._id} className="clickable" onClick={() => handleRowClick(item)}>
                    <td className="font-medium text-muted">{item.empId}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="avatar">{item.empName?.charAt(0) || '-'}</div>
                        <span className="font-semibold">{item.empName}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${item.type === 'leave' ? 'badge-leave' : 'badge-pending'}`}>
                        {item.approvalType}
                      </span>
                    </td>
                    <td>{dayjs.utc(item.requestedDate).local().format('DD MMM YYYY')}</td>
                    <td><span className={`badge ${getStatusBadgeClass(item.status)}`}>{formatStatus(item.status)}</span></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5"><div className="empty-state"><CheckSquare size={32} /><p>No approval requests found.</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
        {!loading && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={totalItems}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(newSize) => { setPageSize(newSize); setPage(1); }}
          />
        )}
      </div>

      {/* View-only Leave Details Slider */}
      <LeaveDetailsSlider
        isOpen={leaveSliderOpen}
        onClose={() => setLeaveSliderOpen(false)}
        leave={selectedLeave}
        showActions={false}
      />

      {/* View-only Movement Details Slider */}
      <MovementDetailsSlider
        isOpen={movementSliderOpen}
        onClose={() => setMovementSliderOpen(false)}
        movement={selectedMovement}
        showActions={false}
      />
    </div>
  );
}
