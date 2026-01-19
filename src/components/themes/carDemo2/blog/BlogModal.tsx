import { Close } from "@/constants";
import { BlogModalProps } from "@/types/HomeDemo";
import { CloseCircle } from "iconsax-react";
import { FC } from "react";
import { Button, Modal, ModalBody } from "reactstrap";

const BlogModal: FC<BlogModalProps> = ({ toggleClick, videoCall }) => {
  return (
    <Modal isOpen={videoCall} fade toggle={toggleClick} className='theme-modal modal-lg modal-dialog-centered'>
      <div className='modal-header'>
        <Button close onClick={toggleClick}>
          {Close}
          <CloseCircle size={31} color="black" />
        </Button>
      </div>
      <ModalBody>
        <iframe src='https://www.youtube.com/embed/y9j-BL5ocW8' allowFullScreen />
      </ModalBody>
    </Modal>
  );
};

export default BlogModal;
