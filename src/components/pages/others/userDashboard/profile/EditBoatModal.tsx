"use client";

import { useState, useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import CommonInput from "@/components/commonComponents/CommonInput";
import DualUnitInput from "@/components/commonComponents/DualUnitInput";
import { BoatCeDesignCategoryData, BoatKeelTypeData, BoatMaterialData } from "@/data/boat";
import dynamic from "next/dynamic";
import DOMPurify from "dompurify";
import Image from "next/image";
import Dropzone from "react-dropzone";
import { X, Star, ImagePlus, ChevronLeft, ChevronRight, FileText, Trash2 } from "lucide-react";

const RichTextEditor = dynamic(
  () => import("@/components/commonComponents/RichTextEditor"),
  { ssr: false }
);

export type BoatDataRow = {
  id: string;
  boat_id: string;
  type?: string;
  condition?: string;
  keel_type?: string;
  ce_design_category?: string;
  material?: string;
  title: string;
  manufacturer: string;
  build_number: string;
  build_year: string;
  location: string;
  price: number | null;
  vat_included: boolean;
  description: string;
  hull_length: number;
  waterline_length: number | null;
  beam: number;
  draft: number;
  ballast: number | null;
  displacement: number;
  engine_power: number;
  fuel_tank: number | null;
  water_tank: number | null;
  brochure: string | null;
  brochures?: UploadedBrochure[];
  additional_details: string | null;
};

export type BoatImageRow = {
  id: string;
  boat_id: string;
  link: string;
  media_type?: "image" | "video";
  display_order: number;
};

type ImageItem = {
  id?: string;
  link: string;
  media_type?: "image" | "video";
  display_order: number;
  isNew?: boolean;
};

type UploadedBrochure = {
  url: string;
  order: number;
  name: string;
  filePath?: string;
};

type EditBoatModalProps = {
  boatId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
};

const emptyForm = {
  type: "",
  condition: "",
  keel_type: "Fin Keel",
  ce_design_category: "A - Ocean",
  material: "GRP",
  title: "",
  manufacturer: "",
  build_number: "",
  build_year: "",
  location: "",
  price: "",
  vat_included: false,
  description: "",
  hull_length: "",
  waterline_length: "",
  beam: "",
  draft: "",
  ballast: "",
  displacement: "",
  engine_power: "",
  fuel_tank: "",
  water_tank: "",
  brochure: "" as string | null,
  additional_details: "",
};

export default function EditBoatModal({ boatId, isOpen, onClose, onSaved }: EditBoatModalProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [brochures, setBrochures] = useState<UploadedBrochure[]>([]);
  const [uploadingImages, setUploadingImages] = useState<Set<number>>(new Set());
  const [uploadingBrochures, setUploadingBrochures] = useState<Set<number>>(new Set());
  const [videoLink, setVideoLink] = useState("");

  const setField = (field: string, value: string | number | boolean | null) => {
    setForm((prev) => ({ ...prev, [field]: value === null ? "" : value }));
  };

  useEffect(() => {
    if (!isOpen || !boatId) return;

    const fetchData = async () => {
      setLoading(true);
      const supabase = getSupabaseBrowserClient();

      try {
        const { data: boatDataRow, error: dataError } = await supabase
          .from("boat_data")
          .select("*")
          .eq("boat_id", boatId)
          .single();

        if (dataError || !boatDataRow) {
          toast.error("Failed to load boat data");
          onClose();
          return;
        }

        const row = boatDataRow as BoatDataRow;
        setForm({
          type: row.type ?? "",
          condition: row.condition ?? "",
          keel_type: row.keel_type ?? "Fin Keel",
          ce_design_category: row.ce_design_category ?? "A - Ocean",
          material: row.material ?? "GRP",
          title: row.title ?? "",
          manufacturer: row.manufacturer ?? "",
          build_number: row.build_number ?? "",
          build_year: row.build_year ?? "",
          location: row.location ?? "",
          price: String(row.price ?? ""),
          vat_included: row.vat_included ?? false,
          description: row.description ?? "",
          hull_length: String(row.hull_length ?? ""),
          waterline_length: String(row.waterline_length ?? ""),
          beam: String(row.beam ?? ""),
          draft: String(row.draft ?? ""),
          ballast: String(row.ballast ?? ""),
          displacement: String(row.displacement ?? ""),
          engine_power: String(row.engine_power ?? ""),
          fuel_tank: String(row.fuel_tank ?? ""),
          water_tank: String(row.water_tank ?? ""),
          brochure: row.brochure ?? "",
          additional_details: row.additional_details ?? "",
        });
        setBrochures(
          Array.isArray(row.brochures) && row.brochures.length > 0
            ? row.brochures.map((brochure, index) => ({ ...brochure, order: index }))
            : row.brochure
              ? [{ url: row.brochure, name: "Brochure", order: 0 }]
              : []
        );

        const { data: imagesData } = await supabase
          .from("boat_images")
          .select("id, link, media_type, display_order")
          .eq("boat_id", boatId)
          .order("display_order", { ascending: true });

        setImages(
          (imagesData || []).map((img: Pick<BoatImageRow, "id" | "link" | "media_type" | "display_order">) => ({
            id: img.id,
            link: img.link,
            media_type: img.media_type === "video" ? "video" : "image",
            display_order: img.display_order,
          }))
        );
      } catch (e) {
        console.error(e);
        toast.error("Failed to load boat");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [boatId, isOpen, onClose]);

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const next = [...images];
    const [removed] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, removed);
    setImages(next.map((img, i) => ({ ...img, display_order: i })));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index).map((img, i) => ({ ...img, display_order: i })));
  };

  const setMainImage = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    setImages(next.map((img, i) => ({ ...img, display_order: i })));
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > 15) {
      toast.error("Maximum 15 media items allowed");
      return;
    }
    const supabase = getSupabaseBrowserClient();
    const startOrder = images.length;
    const toAdd: ImageItem[] = [];

    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      const idx = startOrder + i;
      setUploadingImages((prev) => new Set(prev).add(idx));
      const isVideo = ["video/mp4", "video/webm", "video/quicktime", "video/x-m4v"].includes(file.type);

      const ext = file.name.split(".").pop() || "jpg";
      const path = `${boatId}/${Date.now()}-${i}.${ext}`;

      const { data, error } = await supabase.storage.from("boat_images").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

      setUploadingImages((prev) => {
        const next = new Set(prev);
        next.delete(idx);
        return next;
      });

      if (error) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }

      const { data: urlData } = supabase.storage.from("boat_images").getPublicUrl(data.path);
      toAdd.push({
        link: urlData.publicUrl,
        media_type: isVideo ? "video" : "image",
        display_order: startOrder + toAdd.length,
        isNew: true,
      });
    }

    setImages((prev) => [...prev, ...toAdd].map((img, i) => ({ ...img, display_order: i })));
  };

  const validateVideoUrl = (url: string) => {
    return new Promise<void>((resolve, reject) => {
      const video = document.createElement("video");
      const timeout = window.setTimeout(() => {
        cleanup();
        reject(new Error("Could not load that video URL. Please use a direct MP4, WebM, MOV, or M4V link."));
      }, 8000);
      const cleanup = () => {
        window.clearTimeout(timeout);
        video.removeAttribute("src");
        video.load();
      };
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        cleanup();
        resolve();
      };
      video.onerror = () => {
        cleanup();
        reject(new Error("Could not load that video URL. Please use a direct MP4, WebM, MOV, or M4V link."));
      };
      video.src = url;
    });
  };

  const addVideoLink = async () => {
    const url = videoLink.trim();
    if (!url) return;

    try {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Please enter a valid video URL");
      }
      if (images.length >= 15) {
        throw new Error("Maximum 15 media items allowed");
      }

      await validateVideoUrl(url);
      setImages((prev) => [
        ...prev,
        {
          link: url,
          media_type: "video",
          display_order: prev.length,
          isNew: true,
        },
      ]);
      setVideoLink("");
      toast.success("Video link added");
    } catch (error: any) {
      toast.error(error?.message || "Could not add video link");
    }
  };

  const onBrochureDrop = async (acceptedFiles: File[]) => {
    if (!boatId || acceptedFiles.length === 0) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 10 * 1024 * 1024;
    const files = acceptedFiles.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported brochure file.`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name} is larger than 10MB.`);
        return false;
      }
      return true;
    });

    if (!files.length) return;

    const supabase = getSupabaseBrowserClient();
    const startOrder = brochures.length;
    files.forEach((_, index) => {
      setUploadingBrochures((prev) => new Set(prev).add(startOrder + index));
    });

    try {
      const uploaded: UploadedBrochure[] = [];
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const path = `${boatId}/brochures/brochure-${Date.now()}-${index}-${safeName}`;

        const { data, error } = await supabase.storage.from("boat_images").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

        if (error) throw error;

        const { data: urlData } = supabase.storage.from("boat_images").getPublicUrl(data.path);
        uploaded.push({
          url: urlData.publicUrl,
          order: startOrder + uploaded.length,
          name: file.name,
          filePath: data.path,
        });
      }

      setBrochures((prev) => [...prev, ...uploaded].map((brochure, index) => ({ ...brochure, order: index })));
      toast.success(`${uploaded.length} brochure${uploaded.length === 1 ? "" : "s"} uploaded successfully`);
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload brochure");
    } finally {
      files.forEach((_, index) => {
        setUploadingBrochures((prev) => {
          const next = new Set(prev);
          next.delete(startOrder + index);
          return next;
        });
      });
    }
  };

  const removeBrochure = async (index: number) => {
    const brochure = brochures[index];
    if (!brochure) return;

    const supabase = getSupabaseBrowserClient();
    const filePath = brochure.filePath || brochure.url.split("/boat_images/")[1]?.split("?")[0] || "";
    if (filePath) {
      await supabase.storage.from("boat_images").remove([filePath]);
    }

    setBrochures((prev) => prev.filter((_, i) => i !== index).map((item, order) => ({ ...item, order })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boatId) return;

    const supabase = getSupabaseBrowserClient();
    setSaving(true);

    try {
      const sanitize = (html: string) =>
        html && typeof html === "string"
          ? DOMPurify.sanitize(html, { ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", "ul", "ol", "li", "a", "span", "div"], ALLOWED_ATTR: ["href", "target", "rel"] })
          : "";

      const payload: Record<string, unknown> = {
        condition: form.condition.trim(),
        keel_type: form.keel_type.trim(),
        ce_design_category: form.ce_design_category.trim(),
        material: form.material.trim(),
        title: form.title.trim(),
        manufacturer: form.manufacturer.trim(),
        build_number: form.build_number.trim() || null,
        build_year: form.build_year.trim(),
        location: form.location.trim(),
        price: form.price.trim() ? parseInt(form.price, 10) : null,
        vat_included: form.vat_included,
        description: sanitize(form.description),
        hull_length: parseFloat(form.hull_length) || 0,
        waterline_length: form.waterline_length.trim() ? parseFloat(form.waterline_length) : null,
        beam: parseFloat(form.beam) || 0,
        draft: parseFloat(form.draft) || 0,
        ballast: form.ballast.trim() ? parseInt(form.ballast, 10) : null,
        displacement: parseInt(form.displacement, 10) || 0,
        engine_power: parseFloat(form.engine_power) || 0,
        fuel_tank: form.fuel_tank.trim() ? parseInt(form.fuel_tank, 10) : null,
        water_tank: form.water_tank.trim() ? parseInt(form.water_tank, 10) : null,
        brochure: brochures[0]?.url || form.brochure?.trim() || null,
        brochures,
        additional_details: form.additional_details?.trim() ? sanitize(form.additional_details) : null,
      };

      if (form.type !== undefined && form.type !== "") {
        (payload as Record<string, unknown>).type = form.type.trim();
      }

      const { error: updateError } = await supabase.from("boat_data").update(payload).eq("boat_id", boatId);

      if (updateError) {
        toast.error(updateError.message || "Failed to update boat data");
        return;
      }

      const existingIds = images.filter((img) => img.id && !img.isNew).map((img) => img.id as string);
      const { data: existingRows } = await supabase.from("boat_images").select("id").eq("boat_id", boatId);

      const toDelete = (existingRows || []).filter((r: { id: string }) => !existingIds.includes(r.id)).map((r: { id: string }) => r.id);
      for (const id of toDelete) {
        await supabase.from("boat_images").delete().eq("id", id);
      }

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img.id && !img.isNew) {
          await supabase.from("boat_images").update({ display_order: i, media_type: img.media_type || "image" }).eq("id", img.id);
        } else {
          await supabase.from("boat_images").insert({
            boat_id: boatId,
            link: img.link,
            media_type: img.media_type || "image",
            display_order: i,
          });
        }
      }

      toast.success("Boat updated successfully");
      onSaved();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} size="xl" scrollable className="edit-boat-modal">
      <ModalHeader toggle={onClose}>Edit boat listing</ModalHeader>
      <ModalBody>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <form id="edit-boat-form" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-8">
                <FormGroup>
                  <Label>Type</Label>
                  <Input
                    type="select"
                    value={form.type}
                    onChange={(e) => setField("type", e.target.value)}
                    className="form-control"
                  >
                    <option value="">Select type</option>
                    <option value="racer">Racer</option>
                    <option value="sport-cruiser">Sport-Cruiser</option>
                    <option value="cruiser">Cruiser</option>
                    <option value="power-boat">Power Boat</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Condition *</Label>
                  <Input
                    type="select"
                    value={form.condition}
                    onChange={(e) => setField("condition", e.target.value)}
                    className="form-control"
                    required
                  >
                    <option value="">Select condition</option>
                    <option value="new">New</option>
                    <option value="pre-owned">Pre-owned</option>
                  </Input>
                </FormGroup>
                <div className="row">
                  <div className="col-md-4">
                    <FormGroup>
                      <Label>Keel type *</Label>
                      <Input
                        type="select"
                        value={form.keel_type}
                        onChange={(e) => setField("keel_type", e.target.value)}
                        className="form-control"
                        required
                      >
                        {BoatKeelTypeData.map((option) => (
                          <option key={option.id} value={option.type}>{option.label}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </div>
                  <div className="col-md-4">
                    <FormGroup>
                      <Label>CE Design Category *</Label>
                      <Input
                        type="select"
                        value={form.ce_design_category}
                        onChange={(e) => setField("ce_design_category", e.target.value)}
                        className="form-control"
                        required
                      >
                        {BoatCeDesignCategoryData.map((option) => (
                          <option key={option.id} value={option.type}>{option.label}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </div>
                  <div className="col-md-4">
                    <FormGroup>
                      <Label>Material *</Label>
                      <Input
                        type="select"
                        value={form.material}
                        onChange={(e) => setField("material", e.target.value)}
                        className="form-control"
                        required
                      >
                        {BoatMaterialData.map((option) => (
                          <option key={option.id} value={option.type}>{option.label}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </div>
                </div>
                <FormGroup>
                  <Label>Title *</Label>
                  <CommonInput inputType="text" value={form.title} onChange={(e) => setField("title", e.target.value)} required />
                </FormGroup>
                <div className="row">
                  <div className="col-md-6">
                    <FormGroup>
                      <Label>Manufacturer *</Label>
                      <CommonInput inputType="text" value={form.manufacturer} onChange={(e) => setField("manufacturer", e.target.value)} required />
                    </FormGroup>
                  </div>
                  <div className="col-md-6">
                    <FormGroup>
                      <Label>Build number</Label>
                      <CommonInput inputType="text" value={form.build_number} onChange={(e) => setField("build_number", e.target.value)} />
                    </FormGroup>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <FormGroup>
                      <Label>Build year *</Label>
                      <CommonInput inputType="text" value={form.build_year} onChange={(e) => setField("build_year", e.target.value)} required />
                    </FormGroup>
                  </div>
                  <div className="col-md-6">
                    <FormGroup>
                      <Label>Location *</Label>
                      <CommonInput inputType="text" value={form.location} onChange={(e) => setField("location", e.target.value)} required />
                    </FormGroup>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <FormGroup>
                      <Label>Price (€)</Label>
                      <CommonInput inputType="number" value={form.price} onChange={(e) => setField("price", e.target.value)} />
                    </FormGroup>
                  </div>
                  <div className="col-md-6">
                    <FormGroup className="pt-4">
                      <div className="form-check">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="edit-vat"
                          checked={form.vat_included}
                          onChange={(e) => setField("vat_included", e.target.checked)}
                        />
                        <Label className="form-check-label" htmlFor="edit-vat">VAT included</Label>
                      </div>
                    </FormGroup>
                  </div>
                </div>
                <FormGroup>
                  <Label>Description *</Label>
                  <RichTextEditor value={form.description} onChange={(v) => setField("description", v)} rows={4} />
                </FormGroup>
                <h6 className="mt-3 mb-2">Dimensions</h6>
                <div className="row">
                  <div className="col-md-6">
                    <DualUnitInput
                      label="Hull length (m) *"
                      value={form.hull_length}
                      onChange={(v) => setField("hull_length", v)}
                      metricUnit="m"
                      imperialUnit="ft"
                      metricToImperial={(m) => m * 3.28084}
                      formatImperial={(ft) => `${Math.floor(ft)}'`}
                      type="number"
                      step="0.01"
                    />
                  </div>
                  <div className="col-md-6">
                    <DualUnitInput
                      label="Waterline length (m)"
                      value={form.waterline_length}
                      onChange={(v) => setField("waterline_length", v)}
                      metricUnit="m"
                      imperialUnit="ft"
                      metricToImperial={(m) => m * 3.28084}
                      formatImperial={(ft) => `${Math.floor(ft)}'`}
                      type="number"
                      step="0.01"
                      required={false}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <DualUnitInput
                      label="Beam (m) *"
                      value={form.beam}
                      onChange={(v) => setField("beam", v)}
                      metricUnit="m"
                      imperialUnit="ft"
                      metricToImperial={(m) => m * 3.28084}
                      formatImperial={(ft) => `${Math.floor(ft)}'`}
                      type="number"
                      step="0.01"
                    />
                  </div>
                  <div className="col-md-6">
                    <DualUnitInput
                      label="Draft (m) *"
                      value={form.draft}
                      onChange={(v) => setField("draft", v)}
                      metricUnit="m"
                      imperialUnit="ft"
                      metricToImperial={(m) => m * 3.28084}
                      formatImperial={(ft) => `${Math.floor(ft)}'`}
                      type="number"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <DualUnitInput
                      label="Ballast (kg)"
                      value={form.ballast}
                      onChange={(v) => setField("ballast", v)}
                      metricUnit="kg"
                      imperialUnit="lbs"
                      metricToImperial={(k) => k * 2.20462}
                      formatImperial={(lbs) => Math.round(lbs).toString()}
                      type="number"
                      required={false}
                    />
                  </div>
                  <div className="col-md-6">
                    <DualUnitInput
                      label="Displacement (kg) *"
                      value={form.displacement}
                      onChange={(v) => setField("displacement", v)}
                      metricUnit="kg"
                      imperialUnit="lbs"
                      metricToImperial={(k) => k * 2.20462}
                      formatImperial={(lbs) => Math.round(lbs).toString()}
                      type="number"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <DualUnitInput
                      label="Engine power (kW) *"
                      value={form.engine_power}
                      onChange={(v) => setField("engine_power", v)}
                      metricUnit="kW"
                      imperialUnit="hp"
                      metricToImperial={(k) => k * 1.34102}
                      formatImperial={(hp) => Math.round(hp).toString()}
                      type="number"
                      step="0.01"
                    />
                  </div>
                  <div className="col-md-6">
                    <DualUnitInput
                      label="Fuel tank (L)"
                      value={form.fuel_tank}
                      onChange={(v) => setField("fuel_tank", v)}
                      metricUnit="ltr"
                      imperialUnit="gal"
                      metricToImperial={(l) => l * 0.264172}
                      formatImperial={(g) => Math.round(g).toString()}
                      type="number"
                      required={false}
                    />
                  </div>
                </div>
                <FormGroup>
                  <DualUnitInput
                    label="Water tank (L)"
                    value={form.water_tank}
                    onChange={(v) => setField("water_tank", v)}
                    metricUnit="ltr"
                    imperialUnit="gal"
                    metricToImperial={(l) => l * 0.264172}
                    formatImperial={(g) => Math.round(g).toString()}
                    type="number"
                    required={false}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Brochures</Label>
                  <Dropzone
                    onDrop={onBrochureDrop}
                    accept={{
                      "application/pdf": [".pdf"],
                      "application/msword": [".doc"],
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
                    }}
                    multiple
                    maxSize={10 * 1024 * 1024}
                  >
                    {({ getRootProps, getInputProps, isDragActive }) => (
                      <div
                        {...getRootProps()}
                        className="border border-dashed rounded p-3 text-center mb-3"
                        style={{
                          borderColor: isDragActive ? "var(--theme-color, #0d6efd)" : "#dee2e6",
                          cursor: "pointer",
                          background: isDragActive ? "rgba(13, 110, 253, 0.05)" : "transparent",
                        }}
                      >
                        <input {...getInputProps()} />
                        <FileText className="fs-2 text-muted" style={{ width: "1.5rem", height: "1.5rem" }} />
                        <p className="mb-0 small text-muted">Drop or click to add PDF, DOC, DOCX brochures</p>
                      </div>
                    )}
                  </Dropzone>
                  <div className="d-flex flex-column gap-2 mb-2">
                    {brochures.map((brochure, index) => (
                      <div key={`${brochure.url}-${index}`} className="d-flex align-items-center justify-content-between gap-2 border rounded p-2">
                        <span className="small text-muted d-inline-flex align-items-center gap-2">
                          <FileText style={{ width: "1rem", height: "1rem" }} />
                          {brochure.name}
                          {index === 0 && <span className="badge bg-primary">Primary</span>}
                          {uploadingBrochures.has(index) && <span className="spinner-border spinner-border-sm" role="status" aria-hidden />}
                        </span>
                        <Button color="outline-danger" size="sm" type="button" onClick={() => removeBrochure(index)}>
                          <Trash2 style={{ width: "1rem", height: "1rem" }} /> Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  <CommonInput inputType="text" value={form.brochure || ""} onChange={(e) => setField("brochure", e.target.value)} placeholder="Optional brochure URL fallback" />
                </FormGroup>
                <FormGroup>
                  <Label>Additional details</Label>
                  <RichTextEditor value={form.additional_details || ""} onChange={(v) => setField("additional_details", v)} rows={3} />
                </FormGroup>
              </div>

              <div className="col-lg-4">
                <Label className="d-block mb-2">Media ({images.length} / 15)</Label>
                <Dropzone
                  onDrop={onDrop}
                  accept={{
                    "image/jpeg": [".jpg", ".jpeg"],
                    "image/png": [".png"],
                    "image/webp": [".webp"],
                    "video/mp4": [".mp4"],
                    "video/webm": [".webm"],
                    "video/quicktime": [".mov"],
                    "video/x-m4v": [".m4v"],
                  }}
                  maxFiles={15 - images.length}
                  disabled={images.length >= 15}
                >
                  {({ getRootProps, getInputProps, isDragActive }) => (
                    <div
                      {...getRootProps()}
                      className="border border-dashed rounded p-3 text-center mb-3"
                      style={{
                        borderColor: isDragActive ? "var(--theme-color, #0d6efd)" : "#dee2e6",
                        cursor: images.length >= 15 ? "not-allowed" : "pointer",
                        background: isDragActive ? "rgba(13, 110, 253, 0.05)" : "transparent",
                      }}
                    >
                      <input {...getInputProps()} />
                      <ImagePlus className="fs-2 text-muted" style={{ width: "1.5rem", height: "1.5rem" }} />
                      <p className="mb-0 small text-muted">
                        {images.length >= 15 ? "Max 15 media items" : "Drop or click to add photos/videos"}
                      </p>
                    </div>
                  )}
                </Dropzone>
                <div className="d-flex gap-2 mb-3">
                  <CommonInput
                    inputType="url"
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                    placeholder="https://example.com/video.mp4"
                  />
                  <Button type="button" color="primary" onClick={addVideoLink} disabled={!videoLink.trim() || images.length >= 15}>
                    Add
                  </Button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {images.map((img, index) => (
                    <div
                      key={img.id || img.link}
                      className="position-relative rounded overflow-hidden"
                      style={{ width: 80, height: 80 }}
                    >
                      {img.media_type === "video" ? (
                        <>
                          <video
                            src={img.link}
                            muted
                            loop
                            autoPlay
                            playsInline
                            preload="metadata"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          <span className="position-absolute top-0 start-0 badge bg-dark m-1">Video</span>
                        </>
                      ) : (
                        <Image src={img.link} alt="" fill style={{ objectFit: "cover" }} />
                      )}
                      {index === 0 && (
                        <span className="position-absolute top-0 start-0 badge bg-primary m-1">Main</span>
                      )}
                      {uploadingImages.has(index) && (
                        <span className="position-absolute top-50 start-50 translate-middle spinner-border spinner-border-sm text-light" />
                      )}
                      <div className="position-absolute bottom-0 start-0 end-0 d-flex justify-content-between p-1 bg-dark bg-opacity-75">
                        <button type="button" className="btn btn-sm btn-outline-light py-0 px-1" onClick={() => setMainImage(index)} disabled={index === 0} title="Set as main">
                          <Star className="h-4 w-4" />
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-danger py-0 px-1" onClick={() => removeImage(index)} title="Remove">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      {index > 0 && (
                        <button type="button" className="position-absolute top-0 end-0 btn btn-sm btn-outline-light py-0 px-1 m-1" onClick={() => moveImage(index, index - 1)} title="Move left">
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                      )}
                      {index < images.length - 1 && (
                        <button type="button" className="position-absolute top-0 start-0 btn btn-sm btn-outline-light py-0 px-1 m-1" onClick={() => moveImage(index, index + 1)} title="Move right">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        )}
      </ModalBody>
      {!loading && (
        <ModalFooter>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" type="submit" form="edit-boat-form" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
}
