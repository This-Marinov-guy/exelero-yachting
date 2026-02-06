"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UncontrolledTooltip } from "reactstrap";
import { Edit, Eye, Trash2 } from "lucide-react";

type CharterRequest = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  charter_type: string;
  date_from: string;
  date_to: string;
  group_size: number;
  status: string;
};

const CharterRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<CharterRequest[]>([]);
  const [deleting, setDeleting] = useState<Set<string>>(new Set());

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
    const summary = `Type: ${request.charter_type}
Dates: ${request.date_from} → ${request.date_to}
Group size: ${request.group_size}
Status: ${request.status}`;
    toast.info(summary.replace(/\n/g, " | "));
  };

  const handleEdit = (request: CharterRequest) => {
    toast.info("Edit charter request coming soon");
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
                        <Tooltip target={`charter-edit-${request.id}`} placement="top">Edit</Tooltip>
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
    </div>
  );
};

export default CharterRequests;

