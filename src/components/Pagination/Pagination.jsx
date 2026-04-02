import styles from './Pagination.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, total, pageSize, onPageChange, onPageSizeChange }) {
  // If there are no items, we might still want to show the footer with 0 items
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pageSizeOptions = [5, 10, 15, 20, 25];

  return (
    <div className={styles.pagination}>
      <div className={styles.leftSection}>
        <div className={styles.pageSizeWrapper}>
          <span className={styles.label}>Rows per page:</span>
          <select 
            className={styles.pageSizeSelect} 
            value={pageSize} 
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.rightSection}>
        <span className={styles.info}>{start}-{end} of {total}</span>
        <div className={styles.controls}>
          <button
            className={styles.pBtn}
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            title="Previous Page"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            className={styles.pBtn}
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || total === 0}
            title="Next Page"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
