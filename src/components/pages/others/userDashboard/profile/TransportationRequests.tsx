"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react";

type TransportationRequest = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  date_start: string;
  deadline_date: string;
  start_point: string | null;
  end_point: string | null;
  status: string;
};

const TransportationRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<TransportationRequest[]>([]);
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

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
    const summary = `Route: ${request.start_point || "N/A"} → ${request.end_point || "N/A"}
Dates: ${request.date_start} → ${request.deadline_date}
Status: ${request.status}`;
    toast.info(summary.replace(/\n/g, " | "));
  };

  const handleEdit = (request: TransportationRequest) => {
    toast.info("Edit transportation request coming soon");
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
                    <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>
                      {(request.start_point || "N/A") + " → " + (request.end_point || "N/A")}
                    </TableCell>
                    <TableCell>
                      {request.date_start} → {request.deadline_date}
                    </TableCell>
                    <TableCell className="capitalize">{request.status}</TableCell>
                    <TableCell style={{ width: "120px", textAlign: "right" }} className="text-right">
                      <Dropdown
                        isOpen={openDropdowns.has(request.id)}
                        toggle={() => {
                          const next = new Set(openDropdowns);
                          next.has(request.id) ? next.delete(request.id) : next.add(request.id);
                          setOpenDropdowns(next);
                        }}
                        direction="end"
                        className="boats-listing-dropdown-wrapper"
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <DropdownToggle
                          tag="button"
                          className="btn btn-sm btn-ghost p-0"
                          style={{
                            width: "32px",
                            height: "32px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="visually-hidden">Open menu</span>
                        </DropdownToggle>
                        <DropdownMenu className="boats-listing-dropdown">
                          <DropdownItem
                            onClick={() => {
                              setOpenDropdowns(new Set());
                              handlePreview(request);
                            }}
                            className="boats-listing-dropdown-item"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Preview</span>
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              setOpenDropdowns(new Set());
                              handleEdit(request);
                            }}
                            className="boats-listing-dropdown-item"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem
                            onClick={() => {
                              setOpenDropdowns(new Set());
                              handleDelete(request.id);
                            }}
                            disabled={deleting.has(request.id)}
                            className="boats-listing-dropdown-item boats-listing-dropdown-item-danger"
                          >
                            {deleting.has(request.id) ? (
                              <span className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </span>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span>Delete</span>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
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

export default TransportationRequests;

