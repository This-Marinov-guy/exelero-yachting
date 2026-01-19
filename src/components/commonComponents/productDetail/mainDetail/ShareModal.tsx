import CloseBtn from "@/components/commonComponents/CloseBtn";
import { SocialLinks } from "@/data/demo/common";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setShareModal } from "@/redux/reducers/LayoutSlice";
import Link from "next/link";
import { useState } from "react";
import { Button, Input, Modal, ModalBody, ModalHeader } from "reactstrap";

const ShareModal = () => {
  const { shareModal } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState("");

  const toggle = () => dispatch(setShareModal());
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inputValue);
      setInputValue(inputValue);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  return (
    <>
      <Modal fade centered modalClassName='theme-modal' isOpen={shareModal} toggle={toggle}>
        <ModalHeader toggle={toggle} close={<CloseBtn toggle={toggle} />} />
        <ModalBody>
          <h4 className='modal-title'>Share It</h4>
          <ul className='modal-share-list'>
            {SocialLinks.map((link, index) => (
              <li key={index}>
                <Link href={link.url} target='_blank'>
                  <i className={link.iconClass}></i>
                </Link>
              </li>
            ))}
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
