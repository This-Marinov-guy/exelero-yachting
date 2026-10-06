"use client";
import { useUnsavedChanges } from "../useUnsavedChanges";
import { useState, useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Button, Card, CardBody, CardTitle, Modal, ModalBody, ModalHeader } from "reactstrap";
import CommonInput from "@/components/commonComponents/CommonInput";
import { Edit, Trash2, Plus } from "lucide-react";
import CloseBtn from "@/components/commonComponents/CloseBtn";
import Image from "next/image";
import AccountSkeleton from "../AccountSkeleton";

type BrokerData = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  dealer: string | null;
  image_url: string | null;
  boat_id: string;
};

type DealerInfoProps = {
  onDataChange?: () => void;
};

const DealerInfo = ({ onDataChange }: DealerInfoProps) => {
  const [brokerDataList, setBrokerDataList] = useState<BrokerData[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dealer: "",
  });

  const original = brokerDataList.find(item => item.id === editingId);
  const isDirty = showForm && (Boolean(imageFile) || (removeImage && Boolean(original?.image_url)) || (Object.keys(formData) as Array<keyof typeof formData>).some(key => formData[key] !== (original?.[key] || "")));
  useUnsavedChanges(isDirty || saving);
  useEffect(() => {
    if (!imageFile) { setImagePreview(null); return; }
    const preview = URL.createObjectURL(imageFile);
    setImagePreview(preview);
    return () => URL.revokeObjectURL(preview);
  }, [imageFile]);
  useEffect(() => {
    fetchBrokerData();
  }, []);

  const fetchBrokerData = async (showSkeleton = false) => {
    if (showSkeleton) setLoading(true);
    setLoadFailed(false);
    const supabase = getSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("broker_data")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load dealer information");
      setLoadFailed(true);
      setLoading(false);
      return;
    }

    setBrokerDataList(data || []);
    setShowForm(data && data.length === 0);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const supabase = getSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      toast.error("You must be signed in to save dealer information");
      return;
    }

    // Validation
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSaving(true);
    let uploadedPath: string | null = null;
    try {
      let nextImageUrl = removeImage ? null : imageUrl;
      if (imageFile) {
        const extension = imageFile.type === "image/jpeg" ? "jpg" : imageFile.type === "image/png" ? "png" : "webp";
        uploadedPath = `${session.user.id}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from("dealer-images").upload(uploadedPath, imageFile, { contentType: imageFile.type });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("dealer-images").getPublicUrl(uploadedPath);
        nextImageUrl = data.publicUrl;
      }
      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from("broker_data")
          .update({
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            dealer: formData.dealer || null,
            image_url: nextImageUrl,
          })
          .eq("id", editingId)
          .eq("user_id", session.user.id);

        if (error) throw error;
        toast.success("Dealer information updated successfully");
      } else {
        // Create new broker_data WITHOUT boat_id (broker exists independently)
        // boat_id will be set later when a boat is submitted
        const { error } = await supabase
          .from("broker_data")
          .insert({
            boat_id: null, // Will be set when boat is created
            user_id: session.user.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            dealer: formData.dealer || null,
            image_url: nextImageUrl,
          });

        if (error) throw error;
        toast.success("Dealer information saved successfully");
      }

      if ((imageFile || removeImage) && original?.image_url) {
        const oldPath = original.image_url.split("/dealer-images/")[1]?.split("?")[0];
        if (oldPath) {
          const { error: cleanupError } = await supabase.storage.from("dealer-images").remove([oldPath]);
          if (cleanupError) toast.error("Dealer saved, but the previous image could not be removed.");
        }
      }

      setFormData({ name: "", email: "", phone: "", dealer: "" });
      setImageFile(null);
      setImageUrl(null);
      setRemoveImage(false);
      setEditingId(null);
      setShowForm(false);
      await fetchBrokerData();
      onDataChange?.();

      // Dispatch custom event to notify sidebar to refresh lock status
      window.dispatchEvent(new CustomEvent("dealerDataChanged"));
    } catch (err: any) {
      if (uploadedPath) await supabase.storage.from("dealer-images").remove([uploadedPath]);
      toast.error(err?.message || "Failed to save dealer information");
    } finally { setSaving(false); }
  };

  const handleEdit = (item: BrokerData) => {
    setFormData({
      name: item.name,
      email: item.email,
      phone: item.phone || "",
      dealer: item.dealer || "",
    });
    setEditingId(item.id);
    setImageFile(null);
    setImageUrl(item.image_url);
    setRemoveImage(false);
    setShowForm(true);
  };

  const handleDeleteClick = (item: BrokerData) => {
    setItemToDelete({ id: item.id, name: item.name });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setDeleting(true);
    const supabase = getSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      toast.error("You must be signed in to delete dealer information");
      setDeleting(false);
      setDeleteModalOpen(false);
      setItemToDelete(null);
      return;
    }

    try {
      const { error } = await supabase
        .from("broker_data")
        .delete()
        .eq("id", itemToDelete.id)
        .eq("user_id", session.user.id);

      if (error) throw error;
      const deletedImage = brokerDataList.find(item => item.id === itemToDelete.id)?.image_url;
      const imagePath = deletedImage?.split("/dealer-images/")[1]?.split("?")[0];
      if (imagePath) {
        const { error: cleanupError } = await supabase.storage.from("dealer-images").remove([imagePath]);
        if (cleanupError) toast.error("Dealer deleted, but the image could not be removed.");
      }
      toast.success("Dealer information deleted successfully");
      await fetchBrokerData();
      onDataChange?.();
      setDeleteModalOpen(false);
      setItemToDelete(null);

      // Dispatch custom event to notify sidebar to refresh lock status
      window.dispatchEvent(new CustomEvent("dealerDataChanged"));
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete dealer information");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  if (loading) return <AccountSkeleton kind="dealers" />;

  if (loadFailed) return <div className="admin-empty"><h1 className="dashboard-title">Dealers</h1><p>The dealer list is unavailable.</p><button type="button" className="btn-border" onClick={() => void fetchBrokerData(true)}>Try again</button></div>;
  const visible = brokerDataList.filter(item => [item.name, item.dealer, item.email].some(value => value?.toLowerCase().includes(query.toLowerCase())));
  const displayImage = imageFile ? imagePreview : removeImage ? null : imageUrl;
  return (
    <div className="dealer-info-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="dashboard-title mb-0">Dealers</h1>
        {!showForm && brokerDataList.length > 0 && (
          <Button
            className="btn-solid"
            onClick={() => {
              setFormData({ name: "", email: "", phone: "", dealer: "" });
              setImageFile(null);
              setImageUrl(null);
              setRemoveImage(false);
              setEditingId(null);
              setShowForm(true);
            }}
          >
            <Plus className="iconsax" style={{ width: '16px', height: '16px' }} /> Add Dealer
          </Button>
        )}
      </div>

      <p className="admin-section-description">Manage the dealer and broker contact details used on your boat listings.</p>
      {!showForm && <div className="admin-toolbar"><label>Search dealers<input type="search" placeholder="Name, company or email" value={query} onChange={event => setQuery(event.target.value)} /></label></div>}
      {showForm ? (
        <Card className="dealer-form-card">
          <CardBody>
            <CardTitle tag="h5">{editingId ? "Edit Dealer Information" : "Add Dealer Information"}</CardTitle>
            <form onSubmit={handleSubmit} className="dealer-form"><fieldset disabled={saving} style={{ border: 0, padding: 0 }}>
              <div className="dealer-image-field mb-3">
                <div className="dealer-avatar" aria-hidden="true">
                  {displayImage ? <Image src={displayImage} alt="" width={88} height={88} unoptimized /> : <span>{formData.name.trim().slice(0, 2).toUpperCase() || "?"}</span>}
                </div>
                <div>
                  <label htmlFor="dealer-profile-image">Profile image (optional)</label>
                  <input id="dealer-profile-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => {
                    const file = event.target.files?.[0] || null;
                    event.target.value = "";
                    if (!file) return;
                    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { toast.error("Choose a JPEG, PNG or WebP image."); return; }
                    if (file.size > 5 * 1024 * 1024) { toast.error("Choose an image smaller than 5 MB."); return; }
                    setImageFile(file);
                    setRemoveImage(false);
                  }} />
                  <p className="text-muted mb-0">JPEG, PNG or WebP, up to 5 MB.</p>
                  {displayImage && <button type="button" className="dealer-remove-image" onClick={() => { setImageFile(null); setRemoveImage(Boolean(imageUrl)); }}>Remove image</button>}
                </div>
              </div>
              <div className="mb-3">
                <CommonInput
                  inputType="text"
                  label="Broker name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <CommonInput
                  inputType="email"
                  label="Email *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <CommonInput
                  inputType="tel"
                  label="Phone (optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <CommonInput
                  inputType="text"
                  label="Company / dealer (optional)"
                  value={formData.dealer}
                  onChange={(e) => setFormData({ ...formData, dealer: e.target.value })}
                />
              </div>
              <div className="d-flex gap-2">
                <Button type="submit" className="btn-solid">
                  {saving ? "Saving…" : editingId ? "Save changes" : "Add dealer"}
                </Button>
                <Button
                  type="button"
                  className="btn-outline"
                  onClick={() => {
                    if (isDirty && !confirm("Discard unsaved dealer changes?")) return;
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: "", email: "", phone: "", dealer: "" });
                    setImageFile(null);
                    setImageUrl(null);
                    setRemoveImage(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </fieldset></form>
          </CardBody>
        </Card>
      ) : brokerDataList.length > 0 ? (
        <div className="dealer-cards-grid">{!visible.length && <p className="admin-empty">No dealers match your search.</p>}
          {visible.map((item) => (
            <Card key={item.id} className="dealer-card mt-3">
              <CardBody>
                <div className="dealer-avatar mb-3" aria-hidden="true">
                  {item.image_url ? <Image src={item.image_url} alt="" width={64} height={64} unoptimized /> : <span>{item.name.trim().slice(0, 2).toUpperCase()}</span>}
                </div>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <CardTitle tag="h5">{item.name}</CardTitle>
                    <p className="mb-1 text-muted">{item.email}</p>
                    {item.phone && <p className="mb-1 text-muted">{item.phone}</p>}
                    {item.dealer && <p className="mb-0 text-muted">{item.dealer}</p>}
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn-icon-only"
                      onClick={() => handleEdit(item)}
                      aria-label={`Edit ${item.name}`}
                    >
                      <Edit className="iconsax" style={{ width: '16px', height: '16px' }} />
                    </button>
                    <button
                      type="button"
                      className="btn-icon-only btn-icon-danger"
                      onClick={() => handleDeleteClick(item)}
                      aria-label={`Delete ${item.name}`}
                    >
                      <Trash2 className="iconsax" style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}

        </div>
      ) : null}

      {/* Delete Confirmation Modal */}
      <Modal fade centered className='theme-modal' isOpen={deleteModalOpen} toggle={handleDeleteCancel}>
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <ModalHeader toggle={handleDeleteCancel} close={<CloseBtn toggle={handleDeleteCancel} />} />
            <ModalBody>
              <div className='delete-confirmation-content text-center'>
                <div className='mb-4'>
                  <Trash2 style={{ width: '48px', height: '48px', color: 'rgba(var(--error), 1)' }} />
                </div>
                <h4 className='mb-3'>Delete Dealer Information?</h4>
                <p className='mb-4 text-muted'>
                  Are you sure you want to delete <strong>{itemToDelete?.name}</strong>? This action cannot be undone.
                </p>
                <div className='d-flex align-items-center justify-content-center gap-2'>
                  <Button
                    className='btn-border'
                    onClick={handleDeleteCancel}
                    disabled={deleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    className='btn-solid danger'
                    onClick={handleDeleteConfirm}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </ModalBody>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DealerInfo;
