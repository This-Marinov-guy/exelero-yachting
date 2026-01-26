"use client";
import { ImagePath } from "@/constants";
import { Edit } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { toast } from "sonner";

// Helper function to resize image to max 400x400
const resizeImage = (file: File, maxWidth: number = 400, maxHeight: number = 400): Promise<Blob> => {
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

const UserProfile = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchUserData = async () => {
    const supabase = getSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      setUserId(session.user.id);
      setUserEmail(session.user.email || null);
      
      // Get name from user_metadata (set during signup) or use email prefix
      const fullName = session.user.user_metadata?.full_name || 
                      session.user.user_metadata?.name ||
                      session.user.email?.split("@")[0] || 
                      "User";
      setUserName(fullName);
      
      // Fetch profile image from profile_image table
      const { data: profileImageData, error: profileError } = await supabase
        .from("profile_image")
        .select("image_url")
        .eq("user_id", session.user.id)
        .single();

      if (!profileError && profileImageData) {
        setAvatarUrl(profileImageData.image_url);
      } else {
        // Fallback to default image
        setAvatarUrl(null);
      }
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();

    // Listen for auth state changes
    const supabase = getSupabaseBrowserClient();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setUserEmail(session.user.email || null);
        const fullName = session.user.user_metadata?.full_name || 
                        session.user.user_metadata?.name ||
                        session.user.email?.split("@")[0] || 
                        "User";
        setUserName(fullName);
        fetchUserData();
      } else {
        setUserEmail(null);
        setUserName(null);
        setAvatarUrl(null);
        setUserId(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation: File type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
      return;
    }

    // Validation: File size (max 5MB before resize)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size too large. Please upload an image smaller than 5MB.");
      return;
    }

    if (!userId) {
      toast.error("You must be signed in to upload a profile image.");
      return;
    }

    setUploading(true);
    try {
      const supabase = getSupabaseBrowserClient();

      // Resize image to max 400x400
      const resizedBlob = await resizeImage(file, 400, 400);
      const resizedFile = new File([resizedBlob], file.name, { type: file.type });

      // Upload to Supabase storage
      // Bucket name: profile_images
      // Path structure: {user_id}/filename (bucket name is not part of the path)
      const bucketName = "profile_images";
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Delete old image if exists (before uploading new one)
      const { data: oldImageData } = await supabase
        .from("profile_image")
        .select("image_url")
        .eq("user_id", userId)
        .single();

      if (oldImageData?.image_url) {
        // Extract file path from URL and delete from storage
        try {
          const urlParts = oldImageData.image_url.split(`/${bucketName}/`);
          if (urlParts[1]) {
            const oldPath = urlParts[1].split("?")[0]; // Remove query params
            await supabase.storage
              .from(bucketName)
              .remove([oldPath]);
          }
        } catch (err) {
          // Ignore errors when deleting old image
          console.warn("Could not delete old image:", err);
        }
      }

      // Upload new image (use upsert to replace if exists)
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, resizedFile, {
          cacheControl: "3600",
          upsert: true, // Replace if exists
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error("Failed to get public URL");
      }

      // Save or update profile_image record
      const { error: dbError } = await supabase
        .from("profile_image")
        .upsert(
          {
            user_id: userId,
            image_url: urlData.publicUrl,
          },
          {
            onConflict: "user_id",
          }
        );

      if (dbError) throw dbError;

      setAvatarUrl(urlData.publicUrl);
      toast.success("Profile image uploaded successfully!");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error?.message || "Failed to upload profile image. Please try again.");
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className='main-sidebar-content'>
        <div className='profile-img'>
          <div style={{ width: 138, height: 138, borderRadius: "50%", background: "rgba(var(--border-color), 0.3)" }} />
        </div>
        <div className='profile-content'>
          <h4>Loading...</h4>
        </div>
      </div>
    );
  }

  const displayName = userName || "User";
  const displayEmail = userEmail || "No email";
  const profileImage = avatarUrl || `${ImagePath}/car/person/2.jpg`;

  return (
    <div className='main-sidebar-content'>
      <div className='profile-img'>
        <Image 
          height={138} 
          width={138} 
          src={profileImage} 
          alt={displayName} 
          className='img-fluid' 
          style={{ width: '100px', height: '100px', objectFit: 'cover', border: '3px solid #1dbae7' }}
          unoptimized 
        />
        <button
          type="button"
          className="profile-edit-btn"
          onClick={handleEditClick}
          disabled={uploading}
          aria-label="Edit profile image"
        >
          {uploading ? (
            <div className="upload-spinner" />
          ) : (
            <Edit className="iconsax" size={18} />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
      </div>
      <div className='profile-content'>
        <h4>{displayName}</h4>
        <h6>{displayEmail}</h6>
      </div>
    </div>
  );
};

export default UserProfile;
