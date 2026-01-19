import MoreDetailModal from "@/components/commonComponents/modal/MoreDetailModal";
import { ImagePath, MoreDetails, MoreDetailsTitle } from "@/constants";
import { setMoreDetailModal } from "@/redux/reducers/LayoutSlice";
import RatioImage from "@/utils/RatioImage";
import { useDispatch } from "react-redux";
import { Button, Col } from "reactstrap";

const SaleBanner = () => {
  const dispatch = useDispatch();
  return (
    <Col md={8}>
      <div className='white-card property-card'>
        <div className='card-title'>
          <h5>{MoreDetailsTitle}</h5>
          <Button className='btn-solid' onClick={() => dispatch(setMoreDetailModal())}>
            {MoreDetails}
          </Button>
        </div>
        <RatioImage src={`${ImagePath}/other/user-dashboard/home-card.png`} alt='home-card' className='img-fluid' />
      </div>
      <MoreDetailModal />
    </Col>
  );
};

export default SaleBanner;
