"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { INQUIRY_STATUSES, inquiryStatusLabel, type InquiryStatus } from "@/lib/inquiryWorkflow";
import styles from "../AdminShell.module.scss";
import local from "./InquiryBulkActions.module.scss";

export function SelectPageCheckbox({
  checked,
  indeterminate,
  disabled,
  count,
  onChange,
}: {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  count: number;
  onChange: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate; }, [indeterminate]);
  return <label className={local.selectionLabel}>
    <input ref={ref} type="checkbox" checked={checked} disabled={disabled} onChange={onChange} aria-label={`${checked ? "Deselect" : "Select"} all ${count} displayed inquiries`} />
  </label>;
}

export function InquiryBulkActions({
  selectedCount,
  busy,
  disabled,
  deleteCount,
  onClear,
  onApplyStatus,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: {
  selectedCount: number;
  busy: boolean;
  disabled: boolean;
  deleteCount: number;
  onClear: () => void;
  onApplyStatus: (status: InquiryStatus) => void;
  onRequestDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}) {
  const [status, setStatus] = useState<InquiryStatus | "">("");
  const statusId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (!selectedCount) setStatus(""); }, [selectedCount]);

  return <>
    {selectedCount > 0 && <div className={local.bulkBar} role="group" aria-label="Bulk inquiry actions" aria-busy={busy}>
      <strong>{selectedCount} {selectedCount === 1 ? "inquiry" : "inquiries"} selected</strong>
      <div className={local.bulkControls}>
        <label htmlFor={statusId} className="visually-hidden">New status for selected inquiries</label>
        <select id={statusId} value={status} disabled={disabled} onChange={event => setStatus(event.target.value as InquiryStatus | "")}>
          <option value="">Choose status</option>
          {INQUIRY_STATUSES.map(value => <option key={value} value={value}>{inquiryStatusLabel(value)}</option>)}
        </select>
        <button type="button" className={local.applyButton} disabled={disabled || !status} onClick={() => { if (status) onApplyStatus(status); }}>
          {busy && !deleteCount ? "Updating…" : "Apply status"}
        </button>
        <button type="button" className={local.clearButton} disabled={disabled} onClick={onClear}>Clear selection</button>
        <button type="button" className={local.deleteButton} disabled={disabled} onClick={onRequestDelete}><Trash2 size={17} aria-hidden="true" />Delete selected</button>
      </div>
    </div>}
    <Modal fade={false} isOpen={deleteCount > 0} toggle={onCancelDelete} autoFocus={false} onOpened={() => cancelRef.current?.focus()} className={`${styles.dialog} ${local.confirmDialog}`} backdrop="static">
      <ModalHeader toggle={busy ? undefined : onCancelDelete}>Delete {deleteCount} {deleteCount === 1 ? "inquiry" : "inquiries"}?</ModalHeader>
      <ModalBody>This permanently removes {deleteCount === 1 ? "the selected inquiry" : `all ${deleteCount} selected inquiries`} and its internal note. This cannot be undone.</ModalBody>
      <ModalFooter>
        <button ref={cancelRef} type="button" className={local.cancelButton} disabled={busy} onClick={onCancelDelete}>Cancel</button>
        <button type="button" className={local.confirmButton} disabled={busy} onClick={onConfirmDelete}>{busy ? "Deleting…" : `Delete ${deleteCount} ${deleteCount === 1 ? "inquiry" : "inquiries"}`}</button>
      </ModalFooter>
    </Modal>
  </>;
}
