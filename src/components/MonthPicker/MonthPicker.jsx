import { useState, useEffect, useRef } from 'react';
import styles from './MonthPicker.module.css';

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_FULL  = ['January','February','March','April','May','June','July','August','September','October','November','December'];

/**
 * MonthPicker — Material Design style
 *
 * Props:
 *   value       — "YYYY-MM" string (e.g. "2026-03")
 *   onChange    — callback(value: "YYYY-MM" | "")
 *   placeholder — label shown when nothing is selected
 */
export default function MonthPicker({ value = '', onChange, placeholder = 'All Months' }) {
  const [open, setOpen]         = useState(false);
  const wrapperRef              = useRef(null);

  // Derive selected year/month from controlled value
  const selectedYear  = value ? parseInt(value.split('-')[0], 10) : null;
  const selectedMonth = value ? parseInt(value.split('-')[1], 10) - 1 : null; // 0-indexed

  // Internal draft state (before OK is pressed)
  const now = new Date();
  const [draftYear,  setDraftYear]  = useState(selectedYear  ?? now.getFullYear());
  const [draftMonth, setDraftMonth] = useState(selectedMonth ?? now.getMonth());

  // Sync draft with external value when it changes
  useEffect(() => {
    if (value) {
      setDraftYear(parseInt(value.split('-')[0], 10));
      setDraftMonth(parseInt(value.split('-')[1], 10) - 1);
    }
  }, [value]);

  // Reset draft to current value on open
  const handleOpen = () => {
    if (value) {
      setDraftYear(parseInt(value.split('-')[0], 10));
      setDraftMonth(parseInt(value.split('-')[1], 10) - 1);
    } else {
      setDraftYear(now.getFullYear());
      setDraftMonth(now.getMonth());
    }
    setOpen(true);
  };

  const handleCancel = () => setOpen(false);

  const handleOk = () => {
    const mm = String(draftMonth + 1).padStart(2, '0');
    onChange(`${draftYear}-${mm}`);
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const triggerLabel = value
    ? `${MONTHS_FULL[selectedMonth]} ${selectedYear}`
    : placeholder;

  const currMonth = now.getMonth();
  const currYear  = now.getFullYear();

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {/* ── Trigger button ── */}
      <button
        type="button"
        className={`${styles.trigger} ${value ? styles.triggerActive : ''}`}
        onClick={handleOpen}
      >
        <span className={styles.triggerLabel}>{triggerLabel}</span>
        <svg className={styles.calIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8"  y1="2" x2="8"  y2="6"/>
          <line x1="3"  y1="10" x2="21" y2="10"/>
        </svg>
      </button>

      {/* ── Material Dialog ── */}
      {open && (
        <>
          <div className={styles.backdrop} onClick={handleCancel} />
          <div className={styles.dialog}>

            {/* Header */}
            <div className={styles.header}>
              {/* Year row with prev/next */}
              <div className={styles.yearRow}>
                <button type="button" className={styles.yrArrow} onClick={() => setDraftYear(y => y - 1)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <span className={styles.yearText}>{draftYear}</span>
                <button type="button" className={styles.yrArrow} onClick={() => setDraftYear(y => y + 1)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
              {/* Big month name */}
              <div className={styles.headerMonth}>{MONTHS_FULL[draftMonth]}</div>
            </div>

            {/* Month grid */}
            <div className={styles.grid}>
              {MONTHS_SHORT.map((m, i) => {
                const isSelected = i === draftMonth;
                const isCurrent  = i === currMonth && draftYear === currYear;
                return (
                  <button
                    key={m}
                    type="button"
                    className={[
                      styles.cell,
                      isSelected            ? styles.cellSelected : '',
                      isCurrent && !isSelected ? styles.cellCurrent  : '',
                    ].join(' ')}
                    onClick={() => setDraftMonth(i)}
                  >
                    {m}
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button type="button" className={styles.actionBtn} onClick={handleCancel}>CANCEL</button>
              <button type="button" className={styles.actionBtn} onClick={handleOk}>OK</button>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
