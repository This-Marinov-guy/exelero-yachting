import { Cancel, FloorPlansTitle, Href, ImagePath, InteriorInspirations } from "@/constants";
import { ModalSwiperSlider } from "@/data/pages/Others";
import { AmenitiesSliderData } from "@/data/property";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setMoreDetailModal } from "@/redux/reducers/LayoutSlice";
import RatioImage from "@/utils/RatioImage";
import Link from "next/link";
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import CloseBtn from "../CloseBtn";
import OverViewSection from "@/components/commonComponents/productDetail/detailBody/detailBodyItem/Overview";

const MoreDetailModal = () => {
  const { moreDetailModal } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();
  const toggle = () => dispatch(setMoreDetailModal());

  return (
    <Modal fade centered size='xl' modalClassName='theme-modal' className='property-detail-section' isOpen={moreDetailModal} toggle={toggle}>
      <ModalHeader toggle={toggle} close={<CloseBtn toggle={toggle} />} />
      <ModalBody className="detail-body">
        <OverViewSection type="use_dashboard" label />
        <Row className="gy-sm-0 gy-3">
          <Col sm={8}>
            <h4 className='modal-title'>{InteriorInspirations}</h4>
            <Swiper className='modal-swiper-slider ratio_square' {...ModalSwiperSlider}>
              {AmenitiesSliderData.map((item, index) => (
                <SwiperSlide key={index}>
                  <Link scroll={false} href={Href}>
                    <RatioImage src={`${ImagePath}/property/${item.image}.jpg`} alt='modal-img' className='bg-img' />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </Col>
          <Col sm={4}>
            <h4 className='modal-title'>{FloorPlansTitle}</h4>
            <div className='floor-plan'>
              <RatioImage src={`${ImagePath}/property/detail/floor.png`} alt='floor-plan' className='img-fluid' />
            </div>
          </Col>
        </Row>
        <div className='d-flex align-items-center justify-content-end gap-2 mt-4'>
          <Button className='btn-solid'>{Cancel}</Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default MoreDetailModal;
