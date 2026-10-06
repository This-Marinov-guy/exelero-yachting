
"use client";

import { FC, useState } from "react";
import { ProductType } from "@/types/Product";
import { Modal, ModalBody } from "reactstrap";
import { VideoPlayer, VideoPoster } from "@/components/commonComponents/VideoMedia";

interface BoatDetailImagesProps {
  boat: ProductType;
}

const BoatDetailImages: FC<BoatDetailImagesProps> = ({ boat }) => {
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const media = boat.media?.[0] || (boat.image?.[0] ? { url: boat.image[0], type: "image" as const } : null);

  if (!media) {
    return null;
  }

  return (
    <>
      <div className="detail-images boat-detail-preview">
        {media.type === "video" ? (
          <button
            type="button"
            className="p-0 border-0 w-100 h-100 bg-transparent"
            onClick={() => setPreviewVideo(media.url)}
            aria-label={`Preview video for ${boat.title}`}
          >
            <VideoPoster
              url={media.url}
              title={`${boat.title} video preview`}
              className="boat-detail-preview-image"
            />
          </button>
        ) : (
          <img
            src={media.url}
            alt={boat.title}
            className="boat-detail-preview-image"
          />
        )}
      </div>
      <Modal isOpen={Boolean(previewVideo)} toggle={() => setPreviewVideo(null)} centered size="lg">
        <ModalBody className="p-0 bg-dark">
          {previewVideo && (
            <VideoPlayer
              url={previewVideo}
              title={`${boat.title} video`}
              style={{ width: "100%", maxHeight: "80vh", display: "block", background: "#000" }}
            />
          )}
        </ModalBody>
      </Modal>
    </>
  );
};

export default BoatDetailImages;
