import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { inquiryStatusLabel, type InquiryStatus } from "@/lib/inquiryWorkflow";

export function useInquiryBulkActions<T extends { id: string; status: InquiryStatus }>(
  table: string,
  items: T[],
  setItems: Dispatch<SetStateAction<T[]>>,
) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteIds, setDeleteIds] = useState<string[]>([]);
  const [bulkBusy, setBulkBusy] = useState(false);

  useEffect(() => {
    const available = new Set(items.map(item => item.id));
    setSelectedIds(current => current.filter(id => available.has(id)));
  }, [items]);

  function toggleOne(id: string) {
    setSelectedIds(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  }

  function togglePage(ids: string[]) {
    setSelectedIds(current => {
      const allSelected = ids.every(id => current.includes(id));
      return allSelected ? current.filter(id => !ids.includes(id)) : [...new Set([...current, ...ids])];
    });
  }

  async function applyStatus(status: InquiryStatus) {
    const ids = [...selectedIds];
    if (!ids.length || bulkBusy) return;
    setBulkBusy(true);
    try {
      const { data, error } = await getSupabaseBrowserClient().from(table)
        .update({ status }).in("id", ids).select("id");
      if (error) throw error;
      const changed = new Set((data ?? []).map(row => row.id as string));
      if (!changed.size) throw new Error("No inquiries were updated");
      setItems(current => current.map(item => changed.has(item.id) ? { ...item, status } : item));
      setSelectedIds(current => current.filter(id => !changed.has(id)));
      if (changed.size === ids.length) {
        toast.success(`${changed.size} ${changed.size === 1 ? "inquiry" : "inquiries"} marked ${inquiryStatusLabel(status).toLowerCase()}.`);
      } else {
        toast.error(`${changed.size} of ${ids.length} inquiries updated. The remaining inquiries are still selected; try again.`);
      }
    } catch {
      toast.error("Could not change the selected inquiries' status. They remain selected; try again.");
    } finally {
      setBulkBusy(false);
    }
  }

  function requestDelete(ids: string[]) {
    if (!bulkBusy && ids.length) setDeleteIds([...ids]);
  }

  function cancelDelete() {
    if (!bulkBusy) setDeleteIds([]);
  }

  async function confirmDelete() {
    const ids = [...deleteIds];
    if (!ids.length || bulkBusy) return;
    setBulkBusy(true);
    try {
      const { data, error } = await getSupabaseBrowserClient().from(table)
        .delete().in("id", ids).select("id");
      if (error) throw error;
      const deleted = new Set((data ?? []).map(row => row.id as string));
      if (!deleted.size) throw new Error("No inquiries were deleted");
      setItems(current => current.filter(item => !deleted.has(item.id)));
      setSelectedIds(current => current.filter(id => !deleted.has(id)));
      setDeleteIds([]);
      if (deleted.size === ids.length) {
        toast.success(`${deleted.size} ${deleted.size === 1 ? "inquiry" : "inquiries"} deleted.`);
      } else {
        toast.error(`${deleted.size} of ${ids.length} inquiries deleted. The remaining inquiries are still selected; try again.`);
      }
    } catch {
      toast.error("Could not delete the selected inquiries. They remain selected; try again.");
    } finally {
      setBulkBusy(false);
    }
  }

  return {
    selectedIds,
    clearSelection: () => setSelectedIds([]),
    toggleOne,
    togglePage,
    bulkBusy,
    applyStatus,
    deleteIds,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
