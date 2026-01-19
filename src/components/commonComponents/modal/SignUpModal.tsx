import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import CloseBtn from "../CloseBtn";
import SignUpMain from "@/components/pages/others/common/SignUpMain";
import { setSignUpModal } from "@/redux/reducers/LayoutSlice";

const SignUpModal = () => {
  const { signUpModal } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();
  const toggle = () => dispatch(setSignUpModal());

  return (
    <Modal centered fade modalClassName="theme-modal" isOpen={signUpModal} toggle={toggle}>
      <ModalHeader toggle={toggle} close={<CloseBtn toggle={toggle} />} />
      <ModalBody>
        <SignUpMain />
      </ModalBody>
    </Modal>
  );
};

export default SignUpModal;
