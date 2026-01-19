import Property2DetailBox from "@/components/commonComponents/productBox/Property2DetailBox";
import { useAppSelector } from "@/redux/hooks";
import { FeaturedType } from "@/types/HomeDemo";
import { RouteList } from "@/utils/RouteList";
import { FC } from "react";
import { Col, Container, Row } from "reactstrap";
import CommonHeader from "../../common/CommonHeader";

const FeaturedProperty: FC<FeaturedType> = ({ title, label, data }) => {
  const { productItem } = useAppSelector((state) => state.product);

  return (
    <section className='section-t-lg-space property2-featured-section section-b-lg-space'>
      <Container>
        <CommonHeader title={title} url={RouteList.Property.Grid.Property3Grid} headClass='title-style-1 title-style-6' subClass='horizontal-title' view />
        <Row className='gy-xl-0 gy-md-4 g-3 justify-content-center'>
          {productItem
            .filter(({ id }) => data.includes(id))
            .map((item, i) => {
              return (
                <Col xl={4} md={6} key={i} data-aos='fade-up' data-aos-duration={500 * (i + 1)}>
                  <Property2DetailBox data={item} label={label} index={i} />
                </Col>
              );
            })}
        </Row>
      </Container>
    </section>
  );
};

export default FeaturedProperty;
