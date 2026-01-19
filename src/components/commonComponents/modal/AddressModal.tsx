import { Address, SaveChanges } from "@/constants";
import { AddressInfo } from "@/data/pages/Others";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setAddressModal } from "@/redux/reducers/LayoutSlice";
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import CloseBtn from "../CloseBtn";
import CommonInput from "../CommonInput";

const AddressModal = () => {
  const { addressModal } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();

  const toggle = () => dispatch(setAddressModal());
  return (
    <Modal fade centered size='lg' modalClassName='theme-modal' isOpen={addressModal} toggle={toggle}>
      <ModalHeader toggle={toggle} close={<CloseBtn toggle={toggle} />} />
      <ModalBody>
        <h4 className='modal-title'>{Address}</h4>
        <Row className='gy-sm-4 gy-3'>
          {AddressInfo.map((data, index) => (
            <CommonInput label={data.label} placeholder={data.value} ColClass='col-lg-6' key={index} review />
          ))}
          <Col xs='12'>
            <div className='review-input text-end'>
              <Button className='btn-solid' onClick={toggle}>
                {SaveChanges}
              </Button>
            </div>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default AddressModal;
