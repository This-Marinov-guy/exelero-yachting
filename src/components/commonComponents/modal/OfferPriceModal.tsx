import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setOfferPriceModal } from "@/redux/reducers/LayoutSlice";
import { Button, Col, Input, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import CloseBtn from "../CloseBtn";
import { Review, SendRequest } from "@/constants";

const OfferPriceModal = () => {
  const dispatch = useAppDispatch();
  const { offerPriceModal } = useAppSelector((state) => state.layout);
  const toggle = () => dispatch(setOfferPriceModal());
  return (
    <Modal centered fade modalClassName='theme-modal' isOpen={offerPriceModal} toggle={toggle}>
      <div className='modal-content'>
        <ModalHeader toggle={toggle} close={<CloseBtn toggle={toggle} />} />
        <ModalBody>
          <h3 className='car-title'>{Review}</h3>
          <Row className='gy-3'>
            <Col xs={12}>
              <div className='review-input'>
                <Input type='text' placeholder='Enter Your Name' />
              </div>
            </Col>
            <Col xs={12}>
              <div className='review-input'>
                <Input type='text' placeholder='Your Phone' />
              </div>
            </Col>
            <Col xs={12}>
              <div className='review-input'>
                <Input type='text' placeholder='Enter Your Email' />                 
              </div>
            </Col>
            <Col xs={12}>
              <div className='review-input'>
                <Input type='text' placeholder='Trade Price' />
              </div>
            </Col>
            <Col xs={12}>
              <div className='review-input'>
                <Button className='btn-solid'>{SendRequest}</Button>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </div>
    </Modal>
  );
};

export default OfferPriceModal;
