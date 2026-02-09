"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input } from "reactstrap";
import { UncontrolledTooltip } from "reactstrap";
import { Edit, Eye, Trash2 } from "lucide-react";
import { formatAccountDate } from "@/lib/utils";

type TransportationRequest = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone?: string | null;
  date_start: string;
  deadline_date: string;
  start_point: string | null;
  end_point: string | null;
  boat_weight_kg?: number | null;
  boat_length_m?: number | null;
  boat_beam_m?: number | null;
  boat_draft_m?: number | null;
  boat_height_m?: number | null;
  note?: string | null;
  status: string;
};

const TransportationRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<TransportationRequest[]>([]);
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [previewRequest, setPreviewRequest] = useState<TransportationRequest | null>(null);
  const [editRequest, setEditRequest] = useState<TransportationRequest | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      const supabase = getSupabaseBrowserClient();

      try {
        const { data, error } = await supabase
          .from("transportation_requests")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching transportation requests:", error);
          toast.error("Failed to load transportation requests");
          return;
        }

        setRequests((data || []) as TransportationRequest[]);
      } catch (err) {
        console.error("Error fetching transportation requests:", err);
        toast.error("Failed to load transportation requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transportation request? This action cannot be undone.")) return;

    setDeleting((prev) => new Set(prev).add(id));
    const supabase = getSupabaseBrowserClient();

    try {
      const { error } = await supabase.from("transportation_requests").delete().eq("id", id);
      if (error) {
        console.error("Error deleting transportation request:", error);
        toast.error("Failed to delete transportation request");
        return;
      }

      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success("Transportation request deleted");
    } catch (err) {
      console.error("Error deleting transportation request:", err);
      toast.error("Failed to delete transportation request");
    } finally {
      setDeleting((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handlePreview = (request: TransportationRequest) => {
    setPreviewRequest(request);
  };

  const handleEdit = (request: TransportationRequest) => {
    setEditRequest({ ...request });
  };

  const handleSaveEdit = async () => {
    if (!editRequest) return;
    setSaving(true);
    const supabase = getSupabaseBrowserClient();
    try {
      const { error } = await supabase
        .from("transportation_requests")
        .update({
          name: editRequest.name,
          email: editRequest.email,
          phone: editRequest.phone || null,
          date_start: editRequest.date_start,
          deadline_date: editRequest.deadline_date,
          start_point: editRequest.start_point || null,
          end_point: editRequest.end_point || null,
          boat_weight_kg: editRequest.boat_weight_kg != null ? Number(editRequest.boat_weight_kg) : null,
          boat_length_m: editRequest.boat_length_m != null ? Number(editRequest.boat_length_m) : null,
          boat_beam_m: editRequest.boat_beam_m != null ? Number(editRequest.boat_beam_m) : null,
          boat_draft_m: editRequest.boat_draft_m != null ? Number(editRequest.boat_draft_m) : null,
          boat_height_m: editRequest.boat_height_m != null ? Number(editRequest.boat_height_m) : null,
          note: editRequest.note || null,
          status: editRequest.status,
        })
        .eq("id", editRequest.id);
      if (error) throw error;
      setRequests((prev) => prev.map((r) => (r.id === editRequest.id ? editRequest : r)));
      toast.success("Transportation request updated");
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
          <h4 className="dashboard-title">Transportation Requests</h4>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="boats-listing-section">
      <h4 className="dashboard-title mb-4">Transportation Requests</h4>

      {requests.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <p className="text-muted text-lg">No transportation requests yet.</p>
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
                <TableHead>Route</TableHead>
                <TableHead>Dates</TableHead>
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
                    <TableCell>{formatAccountDate(request.created_at)}</TableCell>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>
                      {(request.start_point || "N/A") + " → " + (request.end_point || "N/A")}
                    </TableCell>
                    <TableCell>
                      {formatAccountDate(request.date_start)} → {formatAccountDate(request.deadline_date)}
                    </TableCell>
                    <TableCell className="capitalize">{request.status}</TableCell>
                    <TableCell style={{ width: "auto", minWidth: "140px", textAlign: "right" }} className="text-right">
                      <div className="profile-table-actions-icons d-flex align-items-center justify-content-end gap-1">
                        <button
                          type="button"
                          id={`transport-preview-${request.id}`}
                          onClick={() => handlePreview(request)}
                          className="profile-table-action-btn"
                          aria-label="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <UncontrolledTooltip target={`transport-preview-${request.id}`} placement="top">Preview</UncontrolledTooltip>
                        <button
                          type="button"
                          id={`transport-edit-${request.id}`}
                          onClick={() => handleEdit(request)}
                          className="profile-table-action-btn"
                          aria-label="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <UncontrolledTooltip target={`transport-edit-${request.id}`} placement="top">Edit</UncontrolledTooltip>
                        <button
                          type="button"
                          id={`transport-delete-${request.id}`}
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
                        <UncontrolledTooltip target={`transport-delete-${request.id}`} placement="top">Delete</UncontrolledTooltip>
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
        <ModalHeader toggle={() => setPreviewRequest(null)}>Transportation request</ModalHeader>
        <ModalBody>
          {previewRequest && (
            <div className="small">
              <p><strong>Created:</strong> {formatAccountDate(previewRequest.created_at)}</p>
              <p><strong>Name:</strong> {previewRequest.name}</p>
              <p><strong>Email:</strong> {previewRequest.email}</p>
              {previewRequest.phone && <p><strong>Phone:</strong> {previewRequest.phone}</p>}
              <p><strong>Dates:</strong> {formatAccountDate(previewRequest.date_start)} → {formatAccountDate(previewRequest.deadline_date)}</p>
              <p><strong>From:</strong> {previewRequest.start_point || "—"}</p>
              <p><strong>To:</strong> {previewRequest.end_point || "—"}</p>
              {(previewRequest.boat_weight_kg != null || previewRequest.boat_length_m != null) && (
                <p><strong>Boat:</strong>{" "}
                  {[previewRequest.boat_weight_kg != null && `${previewRequest.boat_weight_kg} kg`, previewRequest.boat_length_m != null && `${previewRequest.boat_length_m} m`, previewRequest.boat_beam_m != null && `beam ${previewRequest.boat_beam_m} m`, previewRequest.boat_draft_m != null && `draft ${previewRequest.boat_draft_m} m`, previewRequest.boat_height_m != null && `height ${previewRequest.boat_height_m} m`].filter(Boolean).join(", ") || "—"}
                </p>
              )}
              <p><strong>Status:</strong> {previewRequest.status}</p>
              {previewRequest.note && <p><strong>Note:</strong><br />{previewRequest.note}</p>}
            </div>
          )}
        </ModalBody>
      </Modal>

      {/* Edit modal */}
      <Modal isOpen={!!editRequest} toggle={() => setEditRequest(null)} size="lg">
        <ModalHeader toggle={() => setEditRequest(null)}>Edit transportation request</ModalHeader>
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
                <Label>Date start</Label>
                <Input type="date" value={editRequest.date_start} onChange={(e) => setEditRequest((r) => r ? { ...r, date_start: e.target.value } : null)} />
              </FormGroup>
              <FormGroup className="col-md-6">
                <Label>Deadline date</Label>
                <Input type="date" value={editRequest.deadline_date} onChange={(e) => setEditRequest((r) => r ? { ...r, deadline_date: e.target.value } : null)} />
              </FormGroup>
              <FormGroup className="col-md-6">
                <Label>Start point</Label>
                <Input value={editRequest.start_point || ""} onChange={(e) => setEditRequest((r) => r ? { ...r, start_point: e.target.value || null } : null)} />
              </FormGroup>
              <FormGroup className="col-md-6">
                <Label>End point</Label>
                <Input value={editRequest.end_point || ""} onChange={(e) => setEditRequest((r) => r ? { ...r, end_point: e.target.value || null } : null)} />
              </FormGroup>
              <FormGroup className="col-md-4">
                <Label>Boat weight (kg)</Label>
                <Input type="number" value={editRequest.boat_weight_kg ?? ""} onChange={(e) => setEditRequest((r) => r ? { ...r, boat_weight_kg: e.target.value === "" ? null : Number(e.target.value) } : null)} />
              </FormGroup>
              <FormGroup className="col-md-4">
                <Label>Boat length (m)</Label>
                <Input type="number" step="0.01" value={editRequest.boat_length_m ?? ""} onChange={(e) => setEditRequest((r) => r ? { ...r, boat_length_m: e.target.value === "" ? null : Number(e.target.value) } : null)} />
              </FormGroup>
              <FormGroup className="col-md-4">
                <Label>Boat beam (m)</Label>
                <Input type="number" step="0.01" value={editRequest.boat_beam_m ?? ""} onChange={(e) => setEditRequest((r) => r ? { ...r, boat_beam_m: e.target.value === "" ? null : Number(e.target.value) } : null)} />
              </FormGroup>
              <FormGroup className="col-md-4">
                <Label>Boat draft (m)</Label>
                <Input type="number" step="0.01" value={editRequest.boat_draft_m ?? ""} onChange={(e) => setEditRequest((r) => r ? { ...r, boat_draft_m: e.target.value === "" ? null : Number(e.target.value) } : null)} />
              </FormGroup>
              <FormGroup className="col-md-4">
                <Label>Boat height (m)</Label>
                <Input type="number" step="0.01" value={editRequest.boat_height_m ?? ""} onChange={(e) => setEditRequest((r) => r ? { ...r, boat_height_m: e.target.value === "" ? null : Number(e.target.value) } : null)} />
              </FormGroup>
              <FormGroup className="col-md-4">
                <Label>Status</Label>
                <Input type="select" value={editRequest.status} onChange={(e) => setEditRequest((r) => r ? { ...r, status: e.target.value } : null)}>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </Input>
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

export default TransportationRequests;

