import CloseBtn from "@/components/commonComponents/CloseBtn";
import FilterSidebar from "@/components/commonComponents/gridView/filter";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setMapModal } from "@/redux/reducers/LayoutSlice";
import { MapModalType } from "@/types/CommonComponents";
import { FC, Fragment } from "react";
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

const MapModal: FC<MapModalType> = ({ type }) => {
  const { mapModal } = useAppSelector((state) => state.layout);
  const { productItem } = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();

  const showProduct = productItem.filter((item) => item.type === type);

  const toggle = () => dispatch(setMapModal());

  return (
    <Fragment>
      <div className='mobile-space' />
      <Modal scrollable fade modalClassName='theme-modal search-modal map-modal' isOpen={mapModal} toggle={toggle}>
        <ModalHeader toggle={toggle} close={<CloseBtn toggle={toggle} />} />
        <ModalBody>
          <Row>
            <Col lg={3} className='d-lg-inline-block d-none'>
              <FilterSidebar value={showProduct} type={"property"} />
            </Col>
            <Col lg={9} className='map-section'>
              <div id='map'>
                <iframe src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20281.52037088709!2d56.051818439171534!3d25.89548611084295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ef67bc7d52f2459%3A0xa922da11fbe1044d!2zQWxqb29kIFJlc29ydCDYpdiz2KrYsdin2K3YqSDYp9mE2KzZiNiv!5e0!3m2!1sen!2sin!4v1731671548714!5m2!1sen!2sin' width={650} height={800} style={{ border: 0 }} allowFullScreen loading='lazy' referrerPolicy='no-referrer-when-downgrade' title='Google Maps Embed of Toronto' />
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default MapModal;
