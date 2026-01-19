import OfferPriceModal from "@/components/commonComponents/modal/OfferPriceModal";
import TestDriverModal from "@/components/commonComponents/modal/TestDriverModal";
import SimilarSidebar from "@/components/job/detail/jobDetail4/similarSidebar";
import { useAppDispatch } from "@/redux/hooks";
import { setOfferPriceModal, setTestDriverModal } from "@/redux/reducers/LayoutSlice";
import { DetailBodyItemType } from "@/types/Product";
import { FC, Fragment } from "react";
import { Button, Col } from "reactstrap";
import ApplyThisJob from "../detailBody/detailBodyItem/ApplyThisJob";
import Friends from "../detailBody/detailBodyItem/Friends";
import KeyJobDetail from "../detailBody/detailBodyItem/KeyJobDetail";
import Apply from "./Apply";
import ContactDetail from "./ContactDetail";
import FeaturedProperty from "./FeaturedProperty";
import RequestExplore from "./RequestExplore";
import RightJobsBox from "./RightJobsBox";

const DetailSidebar: FC<DetailBodyItemType> = ({ type, detailType }) => {
  const dispatch = useAppDispatch();

  return (
    <div className={`${type === "car" ? "car-detail-sidebar" : type === "job" ? "detail-right-sidebar" : "detail-sidebar"}`}>
      {type === "car" ? (
        <Fragment>
          <div className='sidebar-box'>
            <Button className='btn-solid' onClick={() => dispatch(setTestDriverModal())}>
              <i className='ri-steering-2-line' /> Schedule test driver
            </Button>
            <Button className='btn-border' onClick={() => dispatch(setOfferPriceModal())}>
              <i className='ri-price-tag-3-line' /> Make an offer price
            </Button>
          </div>
          <div className={`sidebar-box`}>
            <div className='detail-sub-sidebar'>
              <ContactDetail type={type} />
              <RequestExplore type={type} />
            </div>
          </div>
          <div className={` sidebar-box `}>
            <FeaturedProperty type={type} />
          </div>
          <TestDriverModal />
          <OfferPriceModal />
        </Fragment>
      ) : type === "job" ? (
        <Fragment>
          {detailType === "detail-3" ? (
            <KeyJobDetail />
          ) : detailType === "detail-4" ? (
            <SimilarSidebar />
          ) : (
            <Fragment>
              {detailType === "detail-2" || detailType === "detail-5" ? <ApplyThisJob /> : <Apply />}
              <RightJobsBox title='Other Opportunities' />
              {detailType === "detail-2" || (detailType === "detail-5" && <Friends />)}
            </Fragment>
          )}
        </Fragment>
      ) : (
        <div className='detail-sidebar'>
          <div className='detail-sub-sidebar'>
            <ContactDetail />
            <RequestExplore />
          </div>
          <FeaturedProperty type={'property'} />
        </div>
      )}
    </div>
  );
};

export default DetailSidebar;
