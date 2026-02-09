"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import { Edit, Eye, Trash2 } from "lucide-react";

type CharterRequest = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone?: string | null;
  charter_type: string;
  date_from: string;
  date_to: string;
  group_size: number;
  note?: string | null;
  status: string;
};

const CharterRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<CharterRequest[]>([]);
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [previewRequest, setPreviewRequest] = useState<CharterRequest | null>(null);
  const [editRequest, setEditRequest] = useState<CharterRequest | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      const supabase = getSupabaseBrowserClient();

      try {
        const { data, error } = await supabase
          .from("charter_requests")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching charter requests:", error);
          toast.error("Failed to load charter requests");
          return;
        }

        setRequests((data || []) as CharterRequest[]);
      } catch (err) {
        console.error("Error fetching charter requests:", err);
        toast.error("Failed to load charter requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this charter request? This action cannot be undone.")) return;

    setDeleting((prev) => new Set(prev).add(id));
    const supabase = getSupabaseBrowserClient();

    try {
      const { error } = await supabase.from("charter_requests").delete().eq("id", id);
      if (error) {
        console.error("Error deleting charter request:", error);
        toast.error("Failed to delete charter request");
        return;
      }

      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success("Charter request deleted");
    } catch (err) {
      console.error("Error deleting charter request:", err);
      toast.error("Failed to delete charter request");
    } finally {
      setDeleting((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handlePreview = (request: CharterRequest) => {
    setPreviewRequest(request);
  };

  const handleEdit = (request: CharterRequest) => {
    setEditRequest({ ...request });
  };

  const handleSaveEdit = async () => {
    if (!editRequest) return;
    setSaving(true);
    const supabase = getSupabaseBrowserClient();
    try {
      const { error } = await supabase
        .from("charter_requests")
        .update({
          name: editRequest.name,
          email: editRequest.email,
          phone: editRequest.phone || null,
          charter_type: editRequest.charter_type,
          date_from: editRequest.date_from,
          date_to: editRequest.date_to,
          group_size: Number(editRequest.group_size),
          note: editRequest.note || null,
          status: editRequest.status,
        })
        .eq("id", editRequest.id);
      if (error) throw error;
      setRequests((prev) => prev.map((r) => (r.id === editRequest.id ? editRequest : r)));
      toast.success("Charter request updated");
      setEditRequest(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="locked-section">
        <div className="locked-content">
          <h4 className="dashboard-title">Charter Requests</h4>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="boats-listing-section">
      <h4 className="dashboard-title mb-4">Charter Requests</h4>

      {requests.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <p className="text-muted text-lg">No charter requests yet.</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg border bg-card shadow-sm"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: "150px" }}>Created</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Status</TableHead>
                <TableHead style={{ width: "120px", textAlign: "right" }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {requests.map((request, index) => (
                  <motion.tr
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell className="capitalize">{request.charter_type.replace("_", " ")}</TableCell>
                    <TableCell>
                      {request.date_from} → {request.date_to}
                    </TableCell>
                    <TableCell>{request.group_size}</TableCell>
                    <TableCell className="capitalize">{request.status}</TableCell>
                    <TableCell style={{ width: "auto", minWidth: "140px", textAlign: "right" }} className="text-right">
                      <div className="profile-table-actions-icons d-flex align-items-center justify-content-end gap-1">
                        <button
                          type="button"
                          id={`charter-preview-${request.id}`}
                          onClick={() => handlePreview(request)}
                          className="profile-table-action-btn"
                          aria-label="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <UncontrolledTooltip target={`charter-preview-${request.id}`} placement="top">Preview</UncontrolledTooltip>
                        <button
                          type="button"
                          id={`charter-edit-${request.id}`}
                          onClick={() => handleEdit(request)}
                          className="profile-table-action-btn"
                          aria-label="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <UncontrolledTooltip target={`charter-edit-${request.id}`} placement="top">Edit</UncontrolledTooltip>
                        <button
                          type="button"
                          id={`charter-delete-${request.id}`}
                          onClick={() => handleDelete(request.id)}
                          disabled={deleting.has(request.id)}
                          className="profile-table-action-btn profile-table-action-btn-danger"
                          aria-label="Delete"
                        >
                          {deleting.has(request.id) ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                        <UncontrolledTooltip target={`charter-delete-${request.id}`} placement="top">Delete</UncontrolledTooltip>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </motion.div>
      )}

      {/* Preview modal */}
      <Modal isOpen={!!previewRequest} toggle={() => setPreviewRequest(null)} size="md">
        <ModalHeader toggle={() => setPreviewRequest(null)}>Charter request</ModalHeader>
        <ModalBody>
          {previewRequest && (
            <div className="small">
              <p><strong>Created:</strong> {new Date(previewRequest.created_at).toLocaleString()}</p>
              <p><strong>Name:</strong> {previewRequest.name}</p>
              <p><strong>Email:</strong> {previewRequest.email}</p>
              {previewRequest.phone && <p><strong>Phone:</strong> {previewRequest.phone}</p>}
              <p><strong>Type:</strong> {previewRequest.charter_type.replace("_", " ")}</p>
              <p><strong>Dates:</strong> {previewRequest.date_from} → {previewRequest.date_to}</p>
              <p><strong>Group size:</strong> {previewRequest.group_size}</p>
              <p><strong>Status:</strong> {previewRequest.status}</p>
              {previewRequest.note && <p><strong>Note:</strong><br />{previewRequest.note}</p>}
            </div>
          )}
        </ModalBody>
      </Modal>

      {/* Edit modal */}
      <Modal isOpen={!!editRequest} toggle={() => setEditRequest(null)} size="md">
        <ModalHeader toggle={() => setEditRequest(null)}>Edit charter request</ModalHeader>
        <ModalBody>
          {editRequest && (
            <div className="row g-2">
              <FormGroup className="col-md-6">
                <Label>Name</Label>
                <Input value={editRequest.name} onChange={(e) => setEditRequest((r) => r ? { ...r, name: e.target.value } : null)} />
              </FormGroup>
              <FormGroup className="col-md-6">
                <Label>Email</Label>
                <Input type="email" value={editRequest.email} onChange={(e) => setEditRequest((r) => r ? { ...r, email: e.target.value } : null)} />
              </FormGroup>
              <FormGroup className="col-12">
                <Label>Phone</Label>
                <Input value={editRequest.phone || ""} onChange={(e) => setEditRequest((r) => r ? { ...r, phone: e.target.value || null } : null)} />
              </FormGroup>
              <FormGroup className="col-md-6">
                <Label>Charter type</Label>
                <Input type="select" value={editRequest.charter_type} onChange={(e) => setEditRequest((r) => r ? { ...r, charter_type: e.target.value } : null)}>
                  <option value="cruiser">Cruiser</option>
                  <option value="power_boat">Power boat</option>
                  <option value="racer">Racer</option>
                  <option value="yacht">Yacht</option>
                </Input>
              </FormGroup>
              <FormGroup className="col-md-6">
                <Label>Status</Label>
                <Input type="select" value={editRequest.status} onChange={(e) => setEditRequest((r) => r ? { ...r, status: e.target.value } : null)}>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </Input>
              </FormGroup>
              <FormGroup className="col-md-4">
                <Label>Date from</Label>
                <Input type="date" value={editRequest.date_from} onChange={(e) => setEditRequest((r) => r ? { ...r, date_from: e.target.value } : null)} />
              </FormGroup>
              <FormGroup className="col-md-4">
                <Label>Date to</Label>
                <Input type="date" value={editRequest.date_to} onChange={(e) => setEditRequest((r) => r ? { ...r, date_to: e.target.value } : null)} />
              </FormGroup>
              <FormGroup className="col-md-4">
                <Label>Group size</Label>
                <Input type="number" min={1} value={editRequest.group_size} onChange={(e) => setEditRequest((r) => r ? { ...r, group_size: Number(e.target.value) || 1 } : null)} />
              </FormGroup>
              <FormGroup className="col-12">
                <Label>Note</Label>
                <Input type="textarea" rows={3} value={editRequest.note || ""} onChange={(e) => setEditRequest((r) => r ? { ...r, note: e.target.value || null } : null)} />
              </FormGroup>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setEditRequest(null)}>Cancel</Button>
          <Button color="primary" onClick={handleSaveEdit} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CharterRequests;

