import RightJobsBox from "@/components/commonComponents/productDetail/detailSidebar/RightJobsBox";
import Link from "next/link";
import { Button, Col } from "reactstrap";

const JobRightSideBar = () => {
  return (
    <Col xl={3} lg={4}>
      <div className='job-right-sidebar'>
        <RightJobsBox title={'Jobs you might be interested in'} type='both-side'/>
        <div className='share-friends'>
          <h6>Have a friend who’ll be good for this job?</h6>
          <Link href='https://web.whatsapp.com/' target='_blank' className='btn-solid'>
            <i className='ri-whatsapp-line' />
            Share with a Friend
          </Link>
        </div>
        <div className='sidebar-banner'>
          <h2>10M+ Users are on the Exelero app</h2>
          <Button className='btn-solid'>Download Now</Button>
        </div>
      </div>
    </Col>
  );
};

export default JobRightSideBar;
