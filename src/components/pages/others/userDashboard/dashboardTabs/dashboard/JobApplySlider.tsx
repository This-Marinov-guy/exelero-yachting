import Job6DetailBox from "@/components/commonComponents/productBox/Job6DetailBox";
import { UserJobSwiper } from "@/data/pages/Others";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProductApiData } from "@/redux/reducers/ProductSlice";
import { useEffect } from "react";
import { Col } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";

const JobApplySlider = () => {
  const { productItem } = useAppSelector((state) => state.product);
  const showProperty = productItem.filter((item) => item.type === "job");
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchProductApiData());
  }, [dispatch]);

  return (
    <Col xl={7}>
      <Swiper className='user-job-swiper job-hire-section' {...UserJobSwiper}>
        {showProperty.map((item, i) => {
          return (
            <SwiperSlide key={i}>
              <Job6DetailBox data={item} userDashboard />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Col>
  );
};

export default JobApplySlider;
