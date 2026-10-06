"use client";

import Image from "next/image";
import { ImagePlus, Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import styles from "./PartnerManager.module.scss";

interface PartnerImageUploadProps {
  id: string;
  label: string;
  hint: string;
  value: string | null;
  optional?: boolean;
  contain?: boolean;
  disabled: boolean;
  uploading: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export default function PartnerImageUpload({ id, label, hint, value, optional, contain, disabled, uploading, onUpload, onRemove }: PartnerImageUploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
    multiple: false,
    disabled,
    onDrop: (accepted, rejected) => {
      if (rejected.length) {
        const codes = rejected.flatMap(({ errors }) => errors.map(error => error.code));
        toast.error(codes.includes("too-many-files") ? "Choose one image at a time." : codes.includes("file-too-large") ? "This image is too large. Choose an image under 10 MB." : "Choose a JPEG, PNG or WebP image.");
        return;
      }
      if (accepted[0]) onUpload(accepted[0]);
    },
  });

  return <div className={styles.asset} aria-busy={uploading}>
    <label id={`${id}-label`} htmlFor={id}>{label}{optional && <span className={styles.optional}> (optional)</span>}</label>
    <p id={`${id}-hint`} className={styles.assetHint}>{hint}</p>
    <div {...getRootProps({
      role: "button",
      "aria-label": `${value ? "Replace" : "Upload"} ${label.toLowerCase()}`,
      "aria-describedby": `${id}-hint ${id}-formats`,
      "aria-disabled": disabled,
      className: `${styles.dropzone} ${value ? styles.hasImage : ""} ${isDragActive ? styles.dragActive : ""} ${isDragActive && isDragReject ? styles.dragReject : ""} ${disabled ? styles.dropzoneDisabled : ""}`,
    })}>
      <input {...getInputProps({ id, "aria-hidden": true, "aria-labelledby": `${id}-label`, "aria-describedby": `${id}-hint ${id}-formats` })} />
      {value && <div className={`${styles.assetPreview} ${contain ? styles.contain : ""}`}><Image src={value} alt={`${label} preview`} fill sizes="(max-width: 650px) 90vw, 360px" unoptimized /></div>}
      <div className={styles.dropzonePrompt}>
        {value ? <Upload size={20} aria-hidden="true" /> : <ImagePlus size={28} strokeWidth={1.5} aria-hidden="true" />}
        <strong>{uploading ? `Uploading ${label.toLowerCase()}…` : isDragActive && isDragReject ? "Use a JPEG, PNG or WebP image" : isDragActive ? "Drop your image here" : value ? "Drop an image to replace" : "Drop your image here"}</strong>
        {!uploading && <span>or <span className={styles.browse}>browse files</span></span>}
      </div>
    </div>
    <div className={styles.assetFooter}>
      <span id={`${id}-formats`}>JPEG, PNG or WebP · Max. 10 MB</span>
      {value && <button type="button" className={styles.removeImage} disabled={disabled} aria-label={`Remove ${label.toLowerCase()}`} onClick={onRemove}><X size={14} aria-hidden="true" />Remove</button>}
    </div>
    {uploading && <div className={styles.uploadProgress} role="status"><progress aria-label={`Uploading ${label.toLowerCase()}`} /><span>Keep this page open while the image uploads.</span></div>}
  </div>;
}
