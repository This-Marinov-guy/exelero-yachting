import { SVGPath } from "@/constants";
import { SaleData } from "@/data/pages/Others";
import Image from "next/image";
import { Col } from "reactstrap";

const SalesData = () => {
  return (
    <Col xs={12}>
      <ul className='sales-layout-list'>
        {SaleData.map((sale) => (
          <li key={sale.id} className={sale.visibleOnLargeScreensOnly ? "d-xl-block d-md-none d-block" : ""}>
            <div className='sale-flex'>
              <div>
                <span>{sale.name}</span>
                <h4>{sale.price}</h4>
                <h6>
                  <Image height={80} width={80} src={`${SVGPath}/${sale.trendIcon}`} alt={sale.trendPositive ? "positive-trend" : "negative-trend"} className='img-fluid' />
                  {sale.trendText}
                </h6>
              </div>
              <div className='sale-img'>
                <Image height={80} width={80} src={`${SVGPath}/${sale.mainImage}`} alt={`${sale.name} sales`} className='img-fluid' />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Col>
  );
};

export default SalesData;
