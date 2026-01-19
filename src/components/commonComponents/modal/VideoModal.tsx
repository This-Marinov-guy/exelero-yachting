import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setVideoModal } from "@/redux/reducers/LayoutSlice";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import CloseBtn from "../CloseBtn";

const VideoModal = () => {
  const { videoModal } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();
  const toggle = () => dispatch(setVideoModal());

  return (
    <Modal size="lg" centered fade modalClassName='theme-modal video-modal' isOpen={videoModal} toggle={toggle}>
        <div className='modal-content'>
          <ModalHeader toggle={toggle} close={<CloseBtn toggle={toggle} />} />
          <ModalBody>
            <iframe src='https://www.youtube.com/embed/y9j-BL5ocW8' allowFullScreen />
          </ModalBody>
        </div>
    </Modal>
  );
};

export default VideoModal;
