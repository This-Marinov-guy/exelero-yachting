import { AmazingDeals } from "@/constants";
import { DealChart } from "@/data/pages/Others";
import ReactApexChart from "react-apexcharts";
import { Col } from "reactstrap";

const AmazingDeal = () => {
  return (
    <Col xl={5}>
      <div className='white-card'>
        <h4 className='dashboard-inner-title'>{AmazingDeals}</h4>
        <div className='dealChart'>
          <ReactApexChart type='bar' options={DealChart} series={DealChart.series} height={230} />
        </div>
      </div>
    </Col>
  );
};

export default AmazingDeal;
