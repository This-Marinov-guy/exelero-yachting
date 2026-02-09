"use client";
import CloseBtn from "@/components/commonComponents/CloseBtn";
import { SocialLinks } from "@/data/demo/common";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setShareModal, setShareData } from "@/redux/reducers/LayoutSlice";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button, Input, Modal, ModalBody, ModalHeader } from "reactstrap";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

const ShareModal = () => {
  const { shareModal, shareData } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (shareModal && typeof window !== "undefined") {
      const currentUrl = `${window.location.origin}${pathname}`;
      setInputValue(currentUrl);
    }
  }, [shareModal, pathname]);

  const toggle = () => {
    dispatch(setShareData(null));
    dispatch(setShareModal());
  };

  const shareTitle = shareData?.title || (typeof document !== "undefined" ? document.title : "Check out this boat");
  const shareText = shareData?.description
    ? `${shareTitle} - ${shareData.description}`
    : shareTitle;
  const shareBody = shareData?.description
    ? `${shareText}\n\n${inputValue}`
    : inputValue;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inputValue);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy link");
    }
  };

  const isExternalImage = (src: string) =>
    src.startsWith("http://") || src.startsWith("https://");

  return (
    <>
      <Modal fade centered modalClassName='theme-modal' isOpen={shareModal} toggle={toggle}>
        <ModalHeader toggle={toggle} close={<CloseBtn toggle={toggle} />} />
        <ModalBody>
          <h4 className='modal-title'>Share It</h4>
          {shareData?.imageUrl && (
            <div className="share-modal-preview mb-3">
              <div
                className="share-modal-image-wrap"
                style={{
                  position: "relative",
                  width: "100%",
                  maxHeight: 200,
                  aspectRatio: "16/9",
                  borderRadius: 8,
                  overflow: "hidden",
                  backgroundColor: "var(--border-color, #eee)",
                }}
              >
                <Image
                  src={shareData.imageUrl}
                  alt={shareData.title}
                  fill
                  style={{ objectFit: "contain" }}
                  unoptimized={isExternalImage(shareData.imageUrl)}
                  sizes="(max-width: 480px) 100vw, 400px"
                />
              </div>
              {shareData.title && (
                <p className="small text-muted mt-2 mb-0" style={{ fontWeight: 500 }}>
                  {shareData.title}
                </p>
              )}
              {shareData.description && (
                <p className="small text-muted mb-0">{shareData.description}</p>
              )}
            </div>
          )}
          <ul className='modal-share-list'>
            {SocialLinks.map((link, index) => {
              const shareUrl = (() => {
                if (!inputValue) return link.url;
                const encodedUrl = encodeURIComponent(inputValue);
                const encodedTitle = encodeURIComponent(shareTitle);
                const encodedText = encodeURIComponent(shareText);
                const encodedBody = encodeURIComponent(shareBody);
                switch (link.name) {
                  case "Facebook":
                    return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                  case "Twitter":
                    return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
                  case "LinkedIn":
                    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                  case "WhatsApp":
                    return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
                  case "Email":
                    return `mailto:?subject=${encodedTitle}&body=${encodedBody}`;
                  default:
                    return link.url;
                }
              })();
              const Icon = link.Icon;
              return (
                <li key={index}>
                  <Link href={shareUrl} target='_blank' rel='noopener noreferrer'>
                    <Icon size={18} />
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className='d-flex align-items-center position-relative copy-input'>
            <Input type='text' value={inputValue} onChange={(event) => setInputValue(event.target.value)} />
            <Button className='btn-solid position-absolute top-0 end-0' onClick={handleCopy}>
              Copy Link
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ShareModal;
