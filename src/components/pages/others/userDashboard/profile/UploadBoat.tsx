"use client";
import { useState, useEffect, useRef } from "react";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Button, Card, CardBody, CardTitle, Modal, ModalBody, ModalHeader } from "reactstrap";
import CommonInput from "@/components/commonComponents/CommonInput";
import CloseBtn from "@/components/commonComponents/CloseBtn";
import DualUnitInput from "@/components/commonComponents/DualUnitInput";
import dynamic from "next/dynamic";
import DOMPurify from "dompurify";

// Dynamically import RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(
  () => import("@/components/commonComponents/RichTextEditor"),
  { ssr: false }
);
import Image from "next/image";
import Dropzone from "react-dropzone";
import { X, Star, ImagePlus, GripVertical, Info, FileText, Trash2, ChevronDown, Plus, BookImage } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { BoatCeDesignCategoryData, BoatKeelTypeData, BoatMaterialData } from "@/data/boat";
import {
    updateFormField,
    setMainImageIndex,
    setBrochureFileName,
    setBrochureUrl,
    addUploadedBrochures,
    removeUploadedBrochure,
    setUploadedBrochures,
    setUploadFolderName,
    addUploadedImage,
    removeUploadedImage,
    reorderUploadedImages,
    setUploadedImages,
    resetForm,
    ImageMetadata,
    UploadedImage,
    UploadedBrochure,
} from "@/redux/reducers/BoatUploadSlice";

// Helper function to resize image to max dimensions
const resizeImage = (file: File, maxWidth: number = 1500, maxHeight: number = 1500): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new window.Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Could not get canvas context"));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error("Failed to create blob"));
                        }
                    },
                    file.type,
                    0.9
                );
            };
            img.onerror = reject;
            if (e.target?.result) {
                img.src = e.target.result as string;
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const slugifyBoatListing = (title: string, buildYear: string) => {
    const normalizedTitle = title.trim();
    const normalizedBuildYear = buildYear.trim();
    const escapedBuildYear = normalizedBuildYear.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const slugSource = escapedBuildYear
        ? normalizedTitle.replace(new RegExp(escapedBuildYear, "g"), " ")
        : normalizedTitle;
    const base = slugSource
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return base || `boat-${Date.now()}`;
};

const generateUniqueBoatSlug = async (
    supabase: ReturnType<typeof getSupabaseBrowserClient>,
    title: string,
    buildYear: string
) => {
    const baseSlug = slugifyBoatListing(title, buildYear);
    const { data, error } = await supabase
        .from("boats")
        .select("slug")
        .or(`slug.eq.${baseSlug},slug.like.${baseSlug}-%`);

    if (error) {
        throw new Error(`Failed to generate listing slug: ${error.message}`);
    }

    const existingSlugs = new Set((data || []).map((row: { slug: string | null }) => row.slug).filter(Boolean));
    if (!existingSlugs.has(baseSlug)) return baseSlug;

    let suffix = 2;
    while (existingSlugs.has(`${baseSlug}-${suffix}`)) {
        suffix += 1;
    }

    return `${baseSlug}-${suffix}`;
};

type BrokerData = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    dealer: string | null;
    boat_id: string | null;
};

type SortableUploadedImageCardProps = {
    uploadedImage: UploadedImage;
    itemId: string;
    index: number;
    isUploading: boolean;
    isMain: boolean;
    isCover: boolean;
    onRemove: (index: number) => void;
    onSetMain: (index: number) => void;
    onSetCover: (index: number) => void;
};

const SortableUploadedImageCard = ({
    uploadedImage,
    itemId,
    index,
    isUploading,
    isMain,
    isCover,
    onRemove,
    onSetMain,
    onSetCover,
}: SortableUploadedImageCardProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: itemId,
        disabled: isUploading,
    });
    const isVideo = uploadedImage.mediaType === "video";

    return (
        <div
            ref={setNodeRef}
            className="col-md-3 col-sm-4 col-6"
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.45 : 1,
                zIndex: isDragging ? 20 : "auto",
            }}
        >
            <div
                className="position-relative"
                style={{
                    aspectRatio: "1",
                    width: "100%",
                    maxWidth: "200px",
                    maxHeight: "200px",
                    overflow: "hidden",
                    borderRadius: "8px",
                    border: isMain ? "3px solid rgba(var(--theme-color), 1)" : "2px solid transparent",
                    boxShadow: isMain ? "0 0 0 2px rgba(var(--theme-color), 0.2)" : "none",
                    transition: "box-shadow 0.3s ease, border-color 0.3s ease",
                    margin: "0 auto",
                }}
            >
                {isVideo ? (
                    <video
                        src={uploadedImage.url}
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="metadata"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                ) : (
                    <Image
                        src={uploadedImage.url}
                        alt={`Preview ${index + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                    />
                )}

                {isUploading && (
                    <div
                        className="position-absolute top-50 start-50 translate-middle"
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                            color: "#fff",
                            padding: "8px",
                            borderRadius: "4px",
                            zIndex: 10,
                        }}
                    >
                        <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Uploading...</span>
                        </div>
                    </div>
                )}

                <div className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1" style={{ zIndex: 10 }}>
                    {isVideo && (
                        <div
                            style={{
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                                color: "#fff",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: "600",
                            }}
                        >
                            Video
                        </div>
                    )}
                    {isMain && (
                        <div
                            style={{
                                backgroundColor: "rgba(var(--theme-color), 1)",
                                color: "#fff",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: "600",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                            }}
                        >
                            <Star className="h-4 w-4" fill="currentColor" /> Main
                        </div>
                    )}
                    {isCover && (
                        <div
                            style={{
                                backgroundColor: "#198754",
                                color: "#fff",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: "600",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                            }}
                        >
                            <BookImage className="h-4 w-4" /> Cover
                        </div>
                    )}
                </div>

                {!isUploading && (
                    <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(index);
                        }}
                        style={{ zIndex: 100 }}
                        aria-label={`Remove media ${index + 1}`}
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}

                {!isUploading && (!isMain || !isCover) && (
                    <div className="position-absolute bottom-0 start-0 m-1 d-flex gap-1" style={{ zIndex: 10 }}>
                        {!isMain && (
                            <button
                                type="button"
                                className="btn btn-sm btn-warning"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSetMain(index);
                                }}
                                title="Set as main media"
                                aria-label={`Set media ${index + 1} as main media`}
                            >
                                <Star className="h-4 w-4" />
                            </button>
                        )}
                        {!isCover && (
                            <button
                                type="button"
                                className="btn btn-sm"
                                style={{ backgroundColor: "#198754", borderColor: "#198754", color: "#fff" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSetCover(index);
                                }}
                                title="Set as cover media"
                                aria-label={`Set media ${index + 1} as cover media`}
                            >
                                <BookImage className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                )}

                {!isUploading && (
                    <button
                        type="button"
                        className="position-absolute bottom-0 end-0 m-1 border-0"
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            color: "#fff",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            zIndex: 10,
                            cursor: isDragging ? "grabbing" : "grab",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                        }}
                        {...attributes}
                        {...listeners}
                        aria-label={`Drag image ${index + 1} to reorder`}
                    >
                        <GripVertical className="h-4 w-4" /> {index + 1}
                    </button>
                )}
            </div>
        </div>
    );
};

const UploadBoat = () => {
    const dispatch = useAppDispatch();
    const {
        formData,
        uploadedImages,
        uploadedBrochures,
        uploadFolderName,
        mainImageIndex,
        brochureFileName,
        brochureUrl
    } = useAppSelector((state) => state.boatUpload);

    const [isLocked, setIsLocked] = useState(true);
    const [loading, setLoading] = useState(true);
    const [brokerDataList, setBrokerDataList] = useState<BrokerData[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImages, setUploadingImages] = useState<Set<number>>(new Set());
    const [uploadingBrochures, setUploadingBrochures] = useState<Set<number>>(new Set());
    const [dealerDropdownOpen, setDealerDropdownOpen] = useState(false);
    const [addDealerModalOpen, setAddDealerModalOpen] = useState(false);
    const [savingDealer, setSavingDealer] = useState(false);
    const [newDealerData, setNewDealerData] = useState({ name: "", email: "", phone: "", dealer: "" });
    const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());
    const [coverImageIndex, setCoverImageIndex] = useState<number>(0);
    const [draftId, setDraftId] = useState<string | null>(null);
    const [savingDraft, setSavingDraft] = useState(false);
    const [videoLink, setVideoLink] = useState("");
    const dealerDropdownRef = useRef<HTMLDivElement | null>(null);
    const imageDragSensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const selectedDealer = brokerDataList.find((d) => d.id === formData.dealer_id);
    const getMediaId = (item: UploadedImage) => item.filePath || `${item.mediaType || "image"}-${item.url}`;

    const stripHtml = (value: string) =>
        value
            .replace(/<[^>]*>/g, "")
            .replace(/&nbsp;/g, " ")
            .trim();

    const hasRequiredValue = (value: unknown) => {
        if (typeof value !== "string") return value !== null && value !== undefined;
        return stripHtml(value).length > 0;
    };

    const clearInvalidField = (field: keyof typeof formData) => {
        setInvalidFields((current) => {
            if (!current.has(field)) return current;
            const next = new Set(current);
            next.delete(field);
            return next;
        });
    };

    const fieldErrorClass = (field: keyof typeof formData) =>
        invalidFields.has(field) ? "upload-field-invalid" : "";

    // Generate unique folder name: timestamp-userId-random
    const generateFolderName = async (): Promise<string> => {
        const supabase = getSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id || "anonymous";
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 9);
        return `temp-${timestamp}-${userId.substring(0, 8)}-${random}`;
    };

    // Helper function to update form fields
    const handleFieldChange = (field: keyof typeof formData, value: string | boolean) => {
        dispatch(updateFormField({ field, value }));
        if (typeof value !== "string" || hasRequiredValue(value)) {
            clearInvalidField(field);
        }
    };

    useEffect(() => {
        const checkDealerInfo = async () => {
            const supabase = getSupabaseBrowserClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.user) {
                setIsLocked(true);
                setLoading(false);
                return;
            }

      // Fetch broker_data entries that don't have a boat yet (boat_id is null)
      // These are available dealers that can be linked to a new boat
      // First, check if user has any broker_data (for lock status)
      const { data: allBrokers, error: allBrokersError } = await supabase
        .from("broker_data")
        .select("id")
        .eq("user_id", session.user.id);

      if (allBrokersError) {
        console.error("Error fetching broker data:", allBrokersError);
        setIsLocked(true);
        setLoading(false);
        return;
      }

      // Check lock status based on whether user has any broker_data
      setIsLocked(!allBrokers || allBrokers.length === 0);

      // Fetch all broker_data entries for this user
      const { data, error } = await supabase
        .from("broker_data")
        .select("id, name, email, phone, dealer, boat_id")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching broker data:", error);
      }

      setBrokerDataList(data || []);
      setLoading(false);
      return data || [];
        };

        checkDealerInfo();

        const handleDealerDataChanged = () => { checkDealerInfo(); };
        const handleClickOutside = (e: MouseEvent) => {
            if (dealerDropdownRef.current && !dealerDropdownRef.current.contains(e.target as Node)) {
                setDealerDropdownOpen(false);
            }
        };

        window.addEventListener("dealerDataChanged", handleDealerDataChanged);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("dealerDataChanged", handleDealerDataChanged);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Load uploaded images from folder on mount if folder exists
    useEffect(() => {
        const loadUploadedImages = async () => {
            if (!uploadFolderName) return;

            const supabase = getSupabaseBrowserClient();
            const bucketName = "boat_images";

            try {
                // List all files in the folder
                const { data: files, error } = await supabase.storage
                    .from(bucketName)
                    .list(uploadFolderName, {
                        limit: 100,
                        sortBy: { column: "name", order: "asc" },
                    });

                if (error) {
                    console.error("Error loading images from folder:", error);
                    return;
                }

                if (!files || files.length === 0) return;

                // Filter media files and create uploaded media array
                const imageFiles = files.filter(
                    (file) => file.name.match(/\.(jpg|jpeg|png|webp|mp4|webm|mov|m4v)$/i) && !file.name.startsWith("brochure-")
                );

                const loadedImages: UploadedImage[] = imageFiles.map((file, index) => {
                    const filePath = `${uploadFolderName}/${file.name}`;
                    const { data: urlData } = supabase.storage
                        .from(bucketName)
                        .getPublicUrl(filePath);

                    return {
                        url: urlData.publicUrl,
                        order: index,
                        name: file.name,
                        filePath,
                        mediaType: file.name.match(/\.(mp4|webm|mov|m4v)$/i) ? "video" : "image",
                        sourceType: "upload",
                    };
                });

                if (loadedImages.length > 0) {
                    dispatch(setUploadedImages(loadedImages));
                    if (mainImageIndex === 0 && loadedImages.length > 0) {
                        dispatch(setMainImageIndex(0));
                    }
                }
            } catch (error) {
                console.error("Error loading uploaded images:", error);
            }
        };

        loadUploadedImages();
    }, [uploadFolderName, dispatch, mainImageIndex]);

    const handleImageDrop = async (acceptedFiles: File[]) => {
        if (uploadedImages.length + acceptedFiles.length > 15) {
            toast.error("Maximum 15 media items allowed");
            return;
        }

        const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        const videoTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-m4v"];
        const allowedTypes = [...imageTypes, ...videoTypes];
        const invalidFiles = acceptedFiles.filter(file => !allowedTypes.includes(file.type));

        if (invalidFiles.length > 0) {
            toast.error("Invalid file type. Please upload JPEG, PNG, WebP, MP4, WebM, MOV, or M4V files only.");
            return;
        }

        const supabase = getSupabaseBrowserClient();
        const bucketName = "boat_images";

        // Generate folder name if this is the first image
        let folderName = uploadFolderName;
        if (!folderName) {
            folderName = await generateFolderName();
            dispatch(setUploadFolderName(folderName));
        }

        // Process and upload each image immediately
        const uploadPromises = acceptedFiles.map(async (file, fileIndex) => {
            const order = uploadedImages.length + fileIndex;
            setUploadingImages((prev) => new Set(prev).add(order));

            try {
                const isVideo = videoTypes.includes(file.type);
                const uploadFile = isVideo
                    ? file
                    : new File([await resizeImage(file, 1500, 1500)], file.name, { type: file.type });

                const fileExt = file.name.split(".").pop();
                const fileName = `${Date.now()}-${order}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
                const filePath = `${folderName}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from(bucketName)
                    .upload(filePath, uploadFile, {
                        cacheControl: "3600",
                        upsert: false,
                    });

                if (uploadError) throw uploadError;

                // Get public URL
                const { data: urlData } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(filePath);

                if (!urlData?.publicUrl) throw new Error("Failed to get image URL");

                // Add to Redux
                const uploadedImage: UploadedImage = {
                    url: urlData.publicUrl,
                    order,
                    name: file.name,
                    filePath,
                    mediaType: isVideo ? "video" : "image",
                    sourceType: "upload",
                };

                dispatch(addUploadedImage(uploadedImage));

                // If this is the first image, set it as main
                if (uploadedImages.length === 0 && fileIndex === 0) {
                    dispatch(setMainImageIndex(0));
                }

                toast.success(`Uploaded: ${file.name}`);
            } catch (error: any) {
                console.error(`Error uploading image ${file.name}:`, error);
                toast.error(`Failed to upload ${file.name}: ${error?.message || "Unknown error"}`);
            } finally {
                setUploadingImages((prev) => {
                    const next = new Set(prev);
                    next.delete(order);
                    return next;
                });
            }
        });

        await Promise.all(uploadPromises);
    };

    const removeImage = async (index: number) => {
        const imageToRemove = uploadedImages[index];
        if (!imageToRemove) return;

        const supabase = getSupabaseBrowserClient();
        const bucketName = "boat_images";

        try {
            if (imageToRemove.filePath) {
                const { error: deleteError } = await supabase.storage
                    .from(bucketName)
                    .remove([imageToRemove.filePath]);

                if (deleteError) {
                    console.error("Error deleting media from storage:", deleteError);
                    toast.error("Failed to delete media from storage");
                    return;
                }
            }

            // Update Redux
            dispatch(removeUploadedImage(index));
            setCoverImageIndex((current) => {
                if (uploadedImages.length <= 1) return 0;
                if (current === index) return 0;
                if (current > index) return current - 1;
                return current;
            });
            toast.success("Media removed");
        } catch (error: any) {
            console.error("Error removing media:", error);
            toast.error("Failed to remove media");
        }
    };

    const handleImageDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over || active.id === over.id) return;

        const fromIndex = uploadedImages.findIndex((image) => getMediaId(image) === active.id);
        const toIndex = uploadedImages.findIndex((image) => getMediaId(image) === over.id);

        if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;

        dispatch(reorderUploadedImages({ fromIndex, toIndex }));
        setCoverImageIndex((current) => {
            if (current === fromIndex) return toIndex;
            if (fromIndex < current && toIndex >= current) return current - 1;
            if (fromIndex > current && toIndex <= current) return current + 1;
            return current;
        });
        toast.success("Media order updated");
    };

    const validateVideoUrl = (url: string) =>
        new Promise<void>((resolve, reject) => {
            const video = document.createElement("video");
            const timeout = window.setTimeout(() => {
                video.src = "";
                reject(new Error("Could not load video metadata"));
            }, 8000);

            video.preload = "metadata";
            video.muted = true;
            video.playsInline = true;
            video.onloadedmetadata = () => {
                window.clearTimeout(timeout);
                resolve();
            };
            video.onerror = () => {
                window.clearTimeout(timeout);
                reject(new Error("The video link could not be loaded"));
            };
            video.src = url;
        });

    const handleAddVideoLink = async () => {
        const url = videoLink.trim();
        if (!url) return;

        try {
            const parsed = new URL(url);
            if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Please enter a valid video URL");
            if (uploadedImages.length >= 15) throw new Error("Maximum 15 media items allowed");

            await validateVideoUrl(url);

            dispatch(addUploadedImage({
                url,
                order: uploadedImages.length,
                name: parsed.pathname.split("/").pop() || "Linked video",
                filePath: "",
                mediaType: "video",
                sourceType: "link",
            }));
            setVideoLink("");
            toast.success("Video link added");
        } catch (error: any) {
            toast.error(error?.message || "Could not add video link");
        }
    };

    const setAsMainImage = (index: number) => {
        if (uploadedImages[index] && !uploadingImages.has(index)) {
            dispatch(setMainImageIndex(index));
            toast.success("Main media updated");
        }
    };

    const handleBrochureDrop = async (files: File[]) => {
        if (!files.length) return;
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        const maxSize = 10 * 1024 * 1024; // 10MB
        const validFiles = files.filter((file) => {
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

        if (!validFiles.length) return;

        const supabase = getSupabaseBrowserClient();
        const bucketName = "boat_images";

        // Generate folder name if needed
        let folderName = uploadFolderName;
        if (!folderName) {
            folderName = await generateFolderName();
            dispatch(setUploadFolderName(folderName));
        }

        const startOrder = uploadedBrochures.length;
        validFiles.forEach((_, index) => {
            setUploadingBrochures((prev) => new Set(prev).add(startOrder + index));
        });

        try {
            const uploaded: UploadedBrochure[] = [];

            for (let index = 0; index < validFiles.length; index++) {
                const file = validFiles[index];
                const fileExt = file.name.split(".").pop();
                const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
                const fileName = `brochure-${Date.now()}-${index}-${safeName || `file.${fileExt}`}`;
                const filePath = `${folderName}/brochures/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from(bucketName)
                    .upload(filePath, file, {
                        cacheControl: "3600",
                        upsert: false,
                    });

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(filePath);

                if (urlData?.publicUrl) {
                    uploaded.push({
                        url: urlData.publicUrl,
                        order: startOrder + uploaded.length,
                        name: file.name,
                        filePath,
                    });
                }
            }

            if (uploaded.length) {
                dispatch(addUploadedBrochures(uploaded));
                toast.success(`${uploaded.length} brochure${uploaded.length === 1 ? "" : "s"} uploaded successfully`);
            }
        } catch (error: any) {
            console.error("Error uploading brochure:", error);
            toast.error(`Failed to upload brochure: ${error?.message || "Unknown error"}`);
        } finally {
            validFiles.forEach((_, index) => {
                setUploadingBrochures((prev) => {
                    const next = new Set(prev);
                    next.delete(startOrder + index);
                    return next;
                });
            });
        }
    };

    const removeBrochure = async (index: number) => {
        const brochure = uploadedBrochures[index];
        if (!brochure) {
            toast.error("No brochure to remove");
            return;
        }

        const supabase = getSupabaseBrowserClient();
        const bucketName = "boat_images";

        try {
            const filePath = brochure.filePath || brochure.url.split(`/${bucketName}/`)[1]?.split("?")[0] || "";
            if (filePath) {
                const { error: deleteError } = await supabase.storage
                    .from(bucketName)
                    .remove([filePath]);

                if (deleteError) {
                    console.error("Error deleting brochure from storage:", deleteError);
                    toast.error("Failed to delete brochure from storage");
                    return;
                }
            }

            dispatch(removeUploadedBrochure(index));
            toast.success("Brochure removed successfully");
        } catch (error: any) {
            console.error("Error removing brochure:", error);
            toast.error(`Failed to remove brochure: ${error?.message || "Unknown error"}`);
        }
    };

    const openAddDealerModal = () => {
        setDealerDropdownOpen(false);
        setNewDealerData({ name: "", email: "", phone: "", dealer: "" });
        setAddDealerModalOpen(true);
    };

    const closeAddDealerModal = () => {
        if (savingDealer) return;
        setAddDealerModalOpen(false);
        setNewDealerData({ name: "", email: "", phone: "", dealer: "" });
    };

    const handleAddDealerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDealerData.name.trim() || !newDealerData.email.trim()) {
            toast.error("Name and email are required");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(newDealerData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        setSavingDealer(true);
        const supabase = getSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
            toast.error("You must be signed in to add a dealer");
            setSavingDealer(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from("broker_data")
                .insert({
                    boat_id: null,
                    user_id: session.user.id,
                    name: newDealerData.name.trim(),
                    email: newDealerData.email.trim(),
                    phone: newDealerData.phone.trim() || null,
                    dealer: newDealerData.dealer.trim() || null,
                })
                .select("id, name, email, phone, dealer, boat_id")
                .single();
            if (error) throw error;
            if (data?.id) handleFieldChange("dealer_id", data.id);
            window.dispatchEvent(new CustomEvent("dealerDataChanged"));
            setAddDealerModalOpen(false);
            setNewDealerData({ name: "", email: "", phone: "", dealer: "" });
            toast.success("Dealer added successfully");
        } catch (error: any) {
            toast.error(error?.message || "Failed to add dealer");
        } finally {
            setSavingDealer(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        const requiredFields = [
            { field: "dealer_id", label: "Dealer" },
            { field: "type", label: "Type" },
            { field: "condition", label: "Condition" },
            { field: "keel_type", label: "Keel type" },
            { field: "ce_design_category", label: "CE Design Category" },
            { field: "material", label: "Material" },
            { field: "title", label: "Title" },
            { field: "manufacturer", label: "Manufacturer" },
            { field: "build_year", label: "Build Year" },
            { field: "location", label: "Location" },
            { field: "description", label: "Description" },
            { field: "hull_length", label: "Hull Length" },
            { field: "beam", label: "Beam" },
            { field: "draft", label: "Draft" },
            { field: "displacement", label: "Displacement" },
            { field: "engine_power", label: "Engine Power" },
        ] satisfies Array<{ field: keyof typeof formData; label: string }>;

        const invalidRequiredFields = requiredFields.filter(({ field }) => !hasRequiredValue(formData[field]));

        if (invalidRequiredFields.length > 0) {
            setInvalidFields(new Set(invalidRequiredFields.map(({ field }) => field)));
            toast.error(`Please complete: ${invalidRequiredFields.map(({ label }) => label).join(", ")}`);
            return;
        }

        setInvalidFields(new Set());

        setSubmitting(true);
        const supabase = getSupabaseBrowserClient();

        try {
            // Get current user ID
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user?.id) {
                toast.error("You must be logged in to upload a boat");
                setSubmitting(false);
                return;
            }
            const userId = session.user.id;

            // Sanitize rich text editor fields to prevent XSS attacks
            const sanitizeHTML = (html: string): string => {
                if (!html || typeof html !== "string") return "";
                // Configure DOMPurify to allow safe HTML formatting
                return DOMPurify.sanitize(html, {
                    ALLOWED_TAGS: [
                        "p", "br", "strong", "em", "u", "s", "h1", "h2", "h3",
                        "ul", "ol", "li", "a", "span", "div"
                    ],
                    ALLOWED_ATTR: ["href", "target", "rel", "style", "class", "color"],
                    ALLOW_DATA_ATTR: false,
                    KEEP_CONTENT: true,
                });
            };

            const sanitizedDescription = sanitizeHTML(formData.description.trim());
            const sanitizedAdditionalDetails = formData.additional_details.trim()
                ? sanitizeHTML(formData.additional_details.trim())
                : null;
            const primaryBrochure = uploadedBrochures[0]?.url || brochureUrl || null;
            const selectedDealer = brokerDataList.find(d => d.id === formData.dealer_id);
            if (!selectedDealer) {
                throw new Error("Selected dealer not found");
            }
            const slug = await generateUniqueBoatSlug(supabase, formData.title.trim(), formData.build_year.trim());

            // Step 1: Create boat entry with user_id
            const { data: boatData, error: boatError } = await supabase
                .from("boats")
                .insert({ user_id: userId, slug, dealer_id: selectedDealer.id })
                .select()
                .single();

            if (boatError) {
                console.error("Error creating boat:", boatError);
                throw new Error(`Failed to create boat: ${boatError.message}`);
            }
            if (!boatData) {
                throw new Error("Failed to create boat: No data returned");
            }

            // Step 2: Create boat_data entry (all fields except brochure and additional_details are required)
            const boatDataPayload: any = {
                boat_id: boatData.id,
                type: formData.type.trim(),
                condition: formData.condition.trim(),
                keel_type: formData.keel_type.trim(),
                ce_design_category: formData.ce_design_category.trim(),
                material: formData.material.trim(),
                title: formData.title.trim(),
                manufacturer: formData.manufacturer.trim(),
                build_number: formData.build_number.trim() || null,
                build_year: formData.build_year.trim(),
                location: formData.location.trim(),
                price: formData.price.trim() ? parseInt(formData.price, 10) : null,
                vat_included: formData.vat_included,
                description: sanitizedDescription,
                hull_length: parseFloat(formData.hull_length),
                waterline_length: formData.waterline_length.trim() ? parseFloat(formData.waterline_length) : null,
                beam: parseFloat(formData.beam),
                draft: parseFloat(formData.draft),
                ballast: formData.ballast.trim() ? parseInt(formData.ballast) : null,
                displacement: parseInt(formData.displacement),
                engine_power: parseFloat(formData.engine_power),
                fuel_tank: formData.fuel_tank.trim() ? parseInt(formData.fuel_tank) : null,
                water_tank: formData.water_tank.trim() ? parseInt(formData.water_tank) : null,
                brochure: primaryBrochure,
                brochures: uploadedBrochures,
                additional_details: sanitizedAdditionalDetails,
            };

            const { error: boatDataError } = await supabase
                .from("boat_data")
                .insert(boatDataPayload);

            if (boatDataError) {
                console.error("Error creating boat data:", boatDataError);
                throw new Error(`Failed to save boat data: ${boatDataError.message}`);
            }

            // Step 3: Update existing broker_data entry to link it to the boat
            // Update the existing broker_data entry with the boat_id
            const { error: brokerDataError } = await supabase
                .from("broker_data")
                .update({
                    boat_id: boatData.id,
                })
                .eq("id", selectedDealer.id);

            if (brokerDataError) {
                console.error("Error updating broker data:", brokerDataError);
                throw new Error(`Failed to link dealer to boat: ${brokerDataError.message}`);
            }

            // Step 4: Move temp folder to permanent boat_id folder (optional enhancement)
            // For now, we'll keep the temp folder and just create records
            // Optionally, we could move files: await moveFolderToBoatFolder(uploadFolderName, boatData.id);

            // Step 5: Create boat_images records (images are already uploaded)
            if (uploadedImages.length > 0) {
                const imageRecords = uploadedImages.map((img, index) => ({
                    boat_id: boatData.id,
                    link: img.url,
                    media_type: img.mediaType || "image",
                    display_order: img.order,
                    is_cover: index === coverImageIndex,
                }));

                const { error: imagesError } = await supabase
                    .from("boat_images")
                    .insert(imageRecords);

                if (imagesError) {
                    console.error("Error creating boat images records:", imagesError);
                    throw new Error(`Failed to save boat images: ${imagesError.message}`);
                }
            }

            toast.success("Boat uploaded successfully!");
            window.dispatchEvent(new CustomEvent("boatsListingRefresh"));

            // Reset form (Redux will handle localStorage cleanup)
            dispatch(resetForm());
            setCoverImageIndex(0);
        } catch (error: any) {
            console.error("Error uploading boat:", error);
            toast.error(error?.message || "Failed to upload boat. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveDraft = async () => {
        setSavingDraft(true);
        const supabase = getSupabaseBrowserClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
            toast.error("Must be logged in to save a draft");
            setSavingDraft(false);
            return;
        }

        const primaryBrochure = uploadedBrochures[0]?.url || brochureUrl || null;
        const payload = {
            user_id: session.user.id,
            title: formData.title || null,
            type: formData.type || null,
            condition: formData.condition || null,
            keel_type: formData.keel_type || null,
            ce_design_category: formData.ce_design_category || null,
            material: formData.material || null,
            manufacturer: formData.manufacturer || null,
            build_number: formData.build_number || null,
            build_year: formData.build_year || null,
            location: formData.location || null,
            price: formData.price ? parseInt(formData.price) : null,
            vat_included: formData.vat_included,
            description: formData.description || null,
            hull_length: formData.hull_length ? parseFloat(formData.hull_length) : null,
            waterline_length: formData.waterline_length ? parseFloat(formData.waterline_length) : null,
            beam: formData.beam ? parseFloat(formData.beam) : null,
            draft: formData.draft ? parseFloat(formData.draft) : null,
            ballast: formData.ballast ? parseInt(formData.ballast) : null,
            displacement: formData.displacement ? parseInt(formData.displacement) : null,
            engine_power: formData.engine_power ? parseFloat(formData.engine_power) : null,
            fuel_tank: formData.fuel_tank ? parseInt(formData.fuel_tank) : null,
            water_tank: formData.water_tank ? parseInt(formData.water_tank) : null,
            brochure: primaryBrochure,
            brochure_file_name: uploadedBrochures[0]?.name || brochureFileName || null,
            brochures: uploadedBrochures,
            additional_details: formData.additional_details || null,
            dealer_id: formData.dealer_id || null,
            upload_folder_name: uploadFolderName || null,
            images: uploadedImages,
            main_image_index: mainImageIndex,
            updated_at: new Date().toISOString(),
        };

        const { data, error } = draftId
            ? await supabase.from("boat_drafts").update(payload).eq("id", draftId).select("id").single()
            : await supabase.from("boat_drafts").insert(payload).select("id").single();

        if (error) {
            toast.error("Failed to save draft");
            setSavingDraft(false);
            return;
        }
        if (data?.id) setDraftId(data.id);
        toast.success("Draft saved");
        window.dispatchEvent(new CustomEvent("draftSaved"));
        setSavingDraft(false);
    };

    // Listen for loadDraft custom events dispatched by BoatDraftsList
    useEffect(() => {
        const handleLoadDraft = (e: Event) => {
            const draft = (e as CustomEvent).detail;
            if (!draft) return;

            dispatch(resetForm());

            const fields: Array<keyof typeof formData> = [
                "title", "type", "condition", "keel_type", "ce_design_category", "material", "manufacturer", "build_number", "build_year",
                "location", "price", "description", "hull_length", "waterline_length",
                "beam", "draft", "ballast", "displacement", "engine_power",
                "fuel_tank", "water_tank", "additional_details", "dealer_id",
            ];
            fields.forEach((field) => {
                const val = draft[field];
                if (val !== null && val !== undefined) {
                    dispatch(updateFormField({ field, value: String(val) }));
                }
            });
            if (typeof draft.vat_included === "boolean") {
                dispatch(updateFormField({ field: "vat_included", value: draft.vat_included }));
            }

            if (Array.isArray(draft.images)) {
                dispatch(setUploadedImages(draft.images));
            }
            if (typeof draft.main_image_index === "number") {
                dispatch(setMainImageIndex(draft.main_image_index));
            }
            if (draft.upload_folder_name) {
                dispatch(setUploadFolderName(draft.upload_folder_name));
            }
            if (draft.brochure) {
                dispatch(setBrochureUrl(draft.brochure));
            }
            if (draft.brochure_file_name) {
                dispatch(setBrochureFileName(draft.brochure_file_name));
            }
            if (Array.isArray(draft.brochures) && draft.brochures.length > 0) {
                dispatch(setUploadedBrochures(draft.brochures));
            } else if (draft.brochure) {
                dispatch(setUploadedBrochures([{
                    url: draft.brochure,
                    order: 0,
                    name: draft.brochure_file_name || "Brochure",
                    filePath: "",
                }]));
            }

            setDraftId(draft.id);

            const section = document.getElementById("upload-boat-section");
            if (section) section.scrollIntoView({ behavior: "smooth" });
        };

        window.addEventListener("loadDraft", handleLoadDraft);
        return () => window.removeEventListener("loadDraft", handleLoadDraft);
    }, [dispatch]);

    if (loading) {
        return (
            <div className="locked-section">
                <div className="locked-content">
                    <h4 className="dashboard-title">Upload Boat</h4>
                    <p className="text-muted">Loading...</p>
                </div>
            </div>
        );
    }

    if (isLocked) {
        return (
            <div className="locked-section">
                <div className="locked-content">
                    <h4 className="dashboard-title">Upload Boat</h4>
                    <p className="text-muted">This section is locked. Please save your dealer information first.</p>
                </div>
            </div>
        );
    }

    return (
        <div id="upload-boat-section" className="upload-boat-section">
            <h4 className="dashboard-title mb-4">Upload Boat</h4>

            <Card className="dealer-form-card">
                <CardBody>
                    <CardTitle tag="h5">Boat Information</CardTitle>
                    <form onSubmit={handleSubmit} className="dealer-form" noValidate>
                        {/* Dealer Selection */}
                        <div className="mb-3">
                            <label className="form-label">Dealer *</label>
                            <div className="dealer-custom-select" ref={dealerDropdownRef}>
                                <button
                                    type="button"
                                    className={`dealer-select-trigger ${dealerDropdownOpen ? "open" : ""} ${fieldErrorClass("dealer_id")}`}
                                    onClick={() => setDealerDropdownOpen((o) => !o)}
                                    aria-haspopup="listbox"
                                    aria-expanded={dealerDropdownOpen}
                                >
                                    <span className={selectedDealer ? "dealer-select-value" : "dealer-select-placeholder text-muted"}>
                                        {selectedDealer
                                            ? `${selectedDealer.name}${selectedDealer.dealer ? ` - ${selectedDealer.dealer}` : ""}`
                                            : "Select a dealer"}
                                    </span>
                                    <ChevronDown size={16} className={`ms-2 transition-transform ${dealerDropdownOpen ? "rotate-180" : ""}`} aria-hidden />
                                </button>

                                {dealerDropdownOpen && (
                                    <div className="dealer-select-menu" role="listbox">
                                        {brokerDataList.length > 0 ? (
                                            brokerDataList.map((dealer) => (
                                                <button
                                                    key={dealer.id}
                                                    type="button"
                                                    className={`dealer-select-option ${formData.dealer_id === dealer.id ? "selected" : ""}`}
                                                    onClick={() => { handleFieldChange("dealer_id", dealer.id); setDealerDropdownOpen(false); }}
                                                    role="option"
                                                    aria-selected={formData.dealer_id === dealer.id}
                                                >
                                                    <span>{dealer.name}</span>
                                                    {dealer.dealer && <small className="text-muted">{dealer.dealer}</small>}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="dealer-select-empty text-muted">No dealers yet</div>
                                        )}
                                        <button
                                            type="button"
                                            className="dealer-select-option dealer-select-add"
                                            onClick={openAddDealerModal}
                                        >
                                            <Plus size={14} aria-hidden /> Add Dealer
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Type *</label>
                                <select
                                    className={`form-control ${fieldErrorClass("type")}`}
                                    value={formData.type}
                                    onChange={(e) => handleFieldChange("type", e.target.value)}
                                    required
                                >
                                    <option value="">Select a type</option>
                                    <option value="racer">Racer</option>
                                    <option value="sport-cruiser">Sport-Cruiser</option>
                                    <option value="cruiser">Cruiser</option>
                                    <option value="power-boat">Power Boat</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Condition *</label>
                                <select
                                    className={`form-control ${fieldErrorClass("condition")}`}
                                    value={formData.condition}
                                    onChange={(e) => handleFieldChange("condition", e.target.value)}
                                    required
                                >
                                    <option value="">Select condition</option>
                                    <option value="new">New</option>
                                    <option value="pre-owned">Pre-owned</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Keel type *</label>
                                <select
                                    className={`form-control ${fieldErrorClass("keel_type")}`}
                                    value={formData.keel_type}
                                    onChange={(e) => handleFieldChange("keel_type", e.target.value)}
                                    required
                                >
                                    {BoatKeelTypeData.map((option) => (
                                        <option key={option.id} value={option.type}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">CE Design Category *</label>
                                <select
                                    className={`form-control ${fieldErrorClass("ce_design_category")}`}
                                    value={formData.ce_design_category}
                                    onChange={(e) => handleFieldChange("ce_design_category", e.target.value)}
                                    required
                                >
                                    {BoatCeDesignCategoryData.map((option) => (
                                        <option key={option.id} value={option.type}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Material *</label>
                                <select
                                    className={`form-control ${fieldErrorClass("material")}`}
                                    value={formData.material}
                                    onChange={(e) => handleFieldChange("material", e.target.value)}
                                    required
                                >
                                    {BoatMaterialData.map((option) => (
                                        <option key={option.id} value={option.type}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="mb-3">
                            <label className="form-label">Title *</label>
                            <CommonInput
                                inputType="text"
                                value={formData.title}
                                inputClass={fieldErrorClass("title")}
                                onChange={(e) => handleFieldChange("title", e.target.value)}
                                required
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Manufacturer *</label>
                                <CommonInput
                                    inputType="text"
                                    value={formData.manufacturer}
                                    inputClass={fieldErrorClass("manufacturer")}
                                    onChange={(e) => handleFieldChange("manufacturer", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Build Number</label>
                                <CommonInput
                                    inputType="text"
                                    value={formData.build_number}
                                    onChange={(e) => handleFieldChange("build_number", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Build Year *</label>
                                <CommonInput
                                    inputType="text"
                                    value={formData.build_year}
                                    inputClass={fieldErrorClass("build_year")}
                                    onChange={(e) => handleFieldChange("build_year", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Location *</label>
                                <CommonInput
                                    inputType="text"
                                    value={formData.location}
                                    inputClass={fieldErrorClass("location")}
                                    onChange={(e) => handleFieldChange("location", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Price</label>
                                <CommonInput
                                    inputType="number"
                                    value={formData.price}
                                    leftText="€"
                                    onChange={(e) => handleFieldChange("price", e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="form-check mt-4">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={formData.vat_included}
                                        onChange={(e) => handleFieldChange("vat_included", e.target.checked)}
                                        id="vat_included"
                                    />
                                    <label className="form-check-label" htmlFor="vat_included">
                                        VAT Included
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Description *</label>
                            <div className={fieldErrorClass("description")}>
                                <RichTextEditor
                                    value={formData.description}
                                    onChange={(value) => handleFieldChange("description", value)}
                                    rows={4}
                                />
                            </div>
                        </div>

                        {/* Dimensions */}
                        <h5 className="mt-4 mb-3">Dimensions</h5>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <DualUnitInput
                                    label="Hull Length *"
                                    value={formData.hull_length}
                                    onChange={(value: string) => handleFieldChange("hull_length", value)}
                                    metricUnit="m"
                                    imperialUnit="ft"
                                    metricToImperial={(m: number) => m * 3.28084}
                                    formatImperial={(ft: number) => {
                                        const feet = Math.floor(ft);
                                        const inches = Math.round((ft - feet) * 12);
                                        return inches > 0 ? `${feet}'${inches}"` : `${feet}'`;
                                    }}
                                    type="number"
                                    step="0.01"
                                    className={`form-control ${fieldErrorClass("hull_length")}`}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <DualUnitInput
                                    label="Waterline Length"
                                    value={formData.waterline_length}
                                    onChange={(value: string) => handleFieldChange("waterline_length", value)}
                                    metricUnit="m"
                                    imperialUnit="ft"
                                    metricToImperial={(m: number) => m * 3.28084}
                                    formatImperial={(ft: number) => {
                                        const feet = Math.floor(ft);
                                        const inches = Math.round((ft - feet) * 12);
                                        return inches > 0 ? `${feet}'${inches}"` : `${feet}'`;
                                    }}
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <DualUnitInput
                                    label="Beam (max) *"
                                    value={formData.beam}
                                    onChange={(value: string) => handleFieldChange("beam", value)}
                                    metricUnit="m"
                                    imperialUnit="ft"
                                    metricToImperial={(m: number) => m * 3.28084}
                                    formatImperial={(ft: number) => {
                                        const feet = Math.floor(ft);
                                        const inches = Math.round((ft - feet) * 12);
                                        return inches > 0 ? `${feet}'${inches}"` : `${feet}'`;
                                    }}
                                    type="number"
                                    step="0.01"
                                    className={`form-control ${fieldErrorClass("beam")}`}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <DualUnitInput
                                    label="Draft *"
                                    value={formData.draft}
                                    onChange={(value: string) => handleFieldChange("draft", value)}
                                    metricUnit="m"
                                    imperialUnit="ft"
                                    metricToImperial={(m: number) => m * 3.28084}
                                    formatImperial={(ft: number) => {
                                        const feet = Math.floor(ft);
                                        const inches = Math.round((ft - feet) * 12);
                                        return inches > 0 ? `${feet}'${inches}"` : `${feet}'`;
                                    }}
                                    type="number"
                                    step="0.01"
                                    className={`form-control ${fieldErrorClass("draft")}`}
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <DualUnitInput
                                    label="Ballast - Std"
                                    value={formData.ballast}
                                    onChange={(value: string) => handleFieldChange("ballast", value)}
                                    metricUnit="kg"
                                    imperialUnit="lbs"
                                    metricToImperial={(kg: number) => kg * 2.20462}
                                    formatImperial={(lbs: number) => Math.round(lbs).toLocaleString()}
                                    type="number"
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <DualUnitInput
                                    label="Displacement - Light *"
                                    value={formData.displacement}
                                    onChange={(value: string) => handleFieldChange("displacement", value)}
                                    metricUnit="kg"
                                    imperialUnit="lbs"
                                    metricToImperial={(kg: number) => kg * 2.20462}
                                    formatImperial={(lbs: number) => Math.round(lbs).toLocaleString()}
                                    type="number"
                                    className={`form-control ${fieldErrorClass("displacement")}`}
                                    required
                                />
                            </div>
                        </div>

                        {/* Engine & Tanks */}
                        <h5 className="mt-4 mb-3">Engine & Tanks</h5>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <DualUnitInput
                                    label="Engine Power *"
                                    value={formData.engine_power}
                                    onChange={(value: string) => handleFieldChange("engine_power", value)}
                                    metricUnit="kW"
                                    imperialUnit="hp"
                                    metricToImperial={(kw: number) => kw * 1.34102}
                                    formatImperial={(hp: number) => Math.round(hp).toString()}
                                    type="number"
                                    step="0.01"
                                    className={`form-control ${fieldErrorClass("engine_power")}`}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <DualUnitInput
                                    label="Fuel Tank - Std"
                                    value={formData.fuel_tank}
                                    onChange={(value: string) => handleFieldChange("fuel_tank", value)}
                                    metricUnit="ltr"
                                    imperialUnit="gal (US)"
                                    metricToImperial={(ltr: number) => ltr * 0.264172}
                                    formatImperial={(gal: number) => Math.round(gal).toString()}
                                    type="number"
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <DualUnitInput
                                    label="Water Tank - Std"
                                    value={formData.water_tank}
                                    onChange={(value: string) => handleFieldChange("water_tank", value)}
                                    metricUnit="ltr"
                                    imperialUnit="gal (US)"
                                    metricToImperial={(ltr: number) => ltr * 0.264172}
                                    formatImperial={(gal: number) => Math.round(gal).toString()}
                                    type="number"
                                    className="form-control"
                                />
                            </div>
                        </div>

                        {/* Additional Information */}
                        <h5 className="mt-4 mb-3">Additional Information</h5>

                        {/* Media Upload Dropzone */}
                        <div className="mb-4">
                            <label className="form-label">Boat Photos & Videos (up to 15 media items)</label>

                            <Dropzone
                                onDrop={handleImageDrop}
                                accept={{
                                    "image/jpeg": [".jpg", ".jpeg"],
                                    "image/png": [".png"],
                                    "image/webp": [".webp"],
                                    "video/mp4": [".mp4"],
                                    "video/webm": [".webm"],
                                    "video/quicktime": [".mov"],
                                    "video/x-m4v": [".m4v"],
                                }}
                                maxFiles={15 - uploadedImages.length}
                                disabled={uploadedImages.length >= 15}
                            >
                                {({ getRootProps, getInputProps, isDragActive }) => (
                                    <div
                                        {...getRootProps()}
                                        className={`dropzone-container mb-3 ${isDragActive ? "drag-active" : ""} ${uploadedImages.length >= 15 ? "disabled" : ""}`}
                                        style={{
                                            border: "2px dashed",
                                            borderColor: isDragActive ? "rgba(var(--theme-color), 1)" : "rgba(var(--border-color), 1)",
                                            borderRadius: "8px",
                                            padding: "40px",
                                            textAlign: "center",
                                            cursor: uploadedImages.length >= 15 ? "not-allowed" : "pointer",
                                            backgroundColor: isDragActive ? "rgba(var(--theme-color), 0.05)" : "transparent",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        <input {...getInputProps()} />
                                        <ImagePlus style={{ fontSize: "48px", color: "rgba(var(--theme-color), 1)", marginBottom: "16px" }} />
                                        <h5 style={{ marginBottom: "8px", color: "rgba(var(--title-color), 1)" }}>
                                            {isDragActive ? "Drop media here" : uploadedImages.length >= 15 ? "Maximum 15 media items reached" : "Drag & drop photos/videos here, or click to select"}
                                        </h5>
                                        <p className="text-muted mb-0">
                                            {uploadedImages.length >= 15 ? "" : "Supports JPEG, PNG, WebP, MP4, WebM, MOV, M4V"}
                                        </p>
                                    </div>
                                )}
                            </Dropzone>

                            <div className="row g-2 align-items-end mb-3">
                                <div className="col-md-9">
                                    <label className="form-label">Add video link</label>
                                    <CommonInput
                                        inputType="url"
                                        value={videoLink}
                                        placeholder="https://example.com/video.mp4"
                                        onChange={(e) => setVideoLink(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Button
                                        type="button"
                                        className="btn-solid w-100"
                                        onClick={handleAddVideoLink}
                                        disabled={!videoLink.trim() || uploadedImages.length >= 15}
                                    >
                                        Add Video
                                    </Button>
                                </div>
                            </div>

                            {uploadedImages.length > 0 && (
                                <>
                                    <DndContext
                                        sensors={imageDragSensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleImageDragEnd}
                                    >
                                        <SortableContext
                                            items={uploadedImages.map(getMediaId)}
                                            strategy={rectSortingStrategy}
                                        >
                                            <div className="row g-3 mb-3">
                                                {uploadedImages.map((uploadedImage, index) => (
                                                    <SortableUploadedImageCard
                                                        key={getMediaId(uploadedImage)}
                                                        uploadedImage={uploadedImage}
                                                        itemId={getMediaId(uploadedImage)}
                                                        index={index}
                                                        isUploading={uploadingImages.has(index)}
                                                        isMain={mainImageIndex === index}
                                                        isCover={coverImageIndex === index}
                                                        onRemove={removeImage}
                                                        onSetMain={setAsMainImage}
                                                        onSetCover={setCoverImageIndex}
                                                    />
                                                ))}
                                            </div>
                                        </SortableContext>
                                    </DndContext>

                                    <div className="row g-1 small" style={{ color: "#6c757d" }}>
                                        <div className="col-6 col-sm-auto d-flex align-items-center gap-1">
                                            {uploadedImages.length} / 15 media items selected
                                        </div>
                                        <div className="col-6 col-sm-auto ms-sm-auto d-flex align-items-center gap-1">
                                            <Info className="h-4 w-4" /> Drag to reorder
                                        </div>
                                        <div className="col-6 col-sm-auto d-flex align-items-center gap-1">
                                            <Star className="h-4 w-4" style={{ color: "#ffc107" }} /> Set main
                                        </div>
                                        <div className="col-6 col-sm-auto d-flex align-items-center gap-1">
                                            <BookImage className="h-4 w-4" style={{ color: "#198754" }} /> Set cover
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Brochure Upload */}
                        <div className="mb-3">
                            <label className="form-label">Brochures (PDF or DOC/DOCX)</label>
                            <Dropzone
                                onDrop={handleBrochureDrop}
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
                                        className={`dropzone-container mb-3 ${isDragActive ? "drag-active" : ""}`}
                                        style={{
                                            border: "2px dashed",
                                            borderColor: isDragActive ? "rgba(var(--theme-color), 1)" : "rgba(var(--border-color), 1)",
                                            borderRadius: "8px",
                                            padding: "28px",
                                            textAlign: "center",
                                            cursor: "pointer",
                                            backgroundColor: isDragActive ? "rgba(var(--theme-color), 0.05)" : "transparent",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        <input {...getInputProps()} />
                                        <FileText style={{ width: "36px", height: "36px", color: "rgba(var(--theme-color), 1)", marginBottom: "12px" }} />
                                        <h5 style={{ marginBottom: "8px", color: "rgba(var(--title-color), 1)" }}>
                                            {isDragActive ? "Drop brochures here" : "Drag & drop brochures here, or click to select"}
                                        </h5>
                                        <p className="text-muted mb-0">Supports PDF, DOC, DOCX up to 10MB each</p>
                                    </div>
                                )}
                            </Dropzone>
                            {uploadedBrochures.length > 0 && (
                                <div className="d-flex flex-column gap-2">
                                    {uploadedBrochures.map((brochure, index) => (
                                        <div key={`${brochure.url}-${index}`} className="d-flex align-items-center justify-content-between gap-2 p-2 border rounded">
                                            <span className="text-muted d-inline-flex align-items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                {brochure.name}
                                                {index === 0 && <span className="badge bg-primary">Primary</span>}
                                                {uploadingBrochures.has(index) && <span className="spinner-border spinner-border-sm" role="status" aria-hidden />}
                                            </span>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => removeBrochure(index)}
                                                disabled={uploadingBrochures.has(index)}
                                            >
                                                <Trash2 className="h-4 w-4" /> Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


                        <div className="mb-3">
                            <label className="form-label">Additional Details</label>
                            <RichTextEditor
                                value={formData.additional_details}
                                onChange={(value) => handleFieldChange("additional_details", value)}
                                rows={6}
                            />
                            <small className="text-muted mt-2 d-block">
                                Use the toolbar above to format your text with styles, lists, links, and more.
                            </small>
                        </div>

                        <div className="d-flex gap-2 mt-4">
                            <Button type="submit" className="btn-solid" disabled={submitting || savingDraft}>
                                {submitting ? "Uploading..." : "Upload Boat"}
                            </Button>
                            <Button type="button" style={{ background: "#f9c72c", borderColor: "#f9c72c", color: "#000", fontWeight: 600 }} onClick={handleSaveDraft} disabled={submitting || savingDraft}>
                                {savingDraft ? "Saving..." : "Save as Draft"}
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>

            <Modal fade centered className="theme-modal" isOpen={addDealerModalOpen} toggle={closeAddDealerModal}>
                <ModalHeader toggle={closeAddDealerModal} close={<CloseBtn toggle={closeAddDealerModal} />} />
                <ModalBody>
                    <h4 className="modal-title mb-3">Add Dealer</h4>
                    <form className="dealer-form" onSubmit={handleAddDealerSubmit}>
                        <div className="mb-3">
                            <CommonInput
                                inputType="text"
                                placeholder="Name *"
                                value={newDealerData.name}
                                onChange={(e) => setNewDealerData({ ...newDealerData, name: e.target.value })}
                                required
                                disabled={savingDealer}
                            />
                        </div>
                        <div className="mb-3">
                            <CommonInput
                                inputType="email"
                                placeholder="Email *"
                                value={newDealerData.email}
                                onChange={(e) => setNewDealerData({ ...newDealerData, email: e.target.value })}
                                required
                                disabled={savingDealer}
                            />
                        </div>
                        <div className="mb-3">
                            <CommonInput
                                inputType="tel"
                                placeholder="Phone"
                                value={newDealerData.phone}
                                onChange={(e) => setNewDealerData({ ...newDealerData, phone: e.target.value })}
                                disabled={savingDealer}
                            />
                        </div>
                        <div className="mb-3">
                            <CommonInput
                                inputType="text"
                                placeholder="Dealer / Company"
                                value={newDealerData.dealer}
                                onChange={(e) => setNewDealerData({ ...newDealerData, dealer: e.target.value })}
                                disabled={savingDealer}
                            />
                        </div>
                        <div className="d-flex gap-2">
                            <Button type="submit" className="btn-solid" disabled={savingDealer}>
                                {savingDealer ? "Saving..." : "Save Dealer"}
                            </Button>
                            <Button type="button" className="btn-outline" onClick={closeAddDealerModal} disabled={savingDealer}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default UploadBoat;
