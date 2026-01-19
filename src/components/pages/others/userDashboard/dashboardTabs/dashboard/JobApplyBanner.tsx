import { JobApplyBannerTitle } from "@/constants";
import { Options_Earning, WhiteCardData } from "@/data/pages/Others";
import ReactApexChart from "react-apexcharts";
import { Col } from "reactstrap";

const JobApplyBanner = () => {
  return (
    <Col xl={5}>
      <div className='white-card'>
        <h4 className='dashboard-inner-title'>{JobApplyBannerTitle}</h4>
        <ul className='applied-buttons'>
          {WhiteCardData.map((item, i) => {
            return (
              <li key={i}>
                <button className='applied-btn' type='button'>
                  {item}d
                </button>
              </li>
            );
          })}
        </ul>
        <ReactApexChart type='line' options={Options_Earning} series={Options_Earning.series} height={158} />
      </div>
    </Col>
  );
};

export default JobApplyBanner;
