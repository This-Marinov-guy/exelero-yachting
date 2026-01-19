import CarProductBox1 from "@/components/commonComponents/productBox/CarProductBox1";
import Job1DetailBox from "@/components/commonComponents/productBox/Job1DetailBox";
import NotFound from "@/components/commonComponents/productBox/NotFound";
import Property1DetailBox from "@/components/commonComponents/productBox/Property1DetailBox";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProductApiData } from "@/redux/reducers/ProductSlice";
import React, { FC, Fragment, useEffect, useMemo } from "react";
import { Col, Container, Row } from "reactstrap";

const WishlistContent: FC<{ type?: string }> = ({ type }) => {
  const { productItem } = useAppSelector((state) => state.product);
  const showProperty = useMemo(
    () => productItem.filter((item) => item.type === type),
    [productItem, type]
  );
  
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchProductApiData());
  }, [dispatch]);
  
  return (
    <section className={`${type === "car" ? "car-shop-section car-product-section" : type === "job" ? "section-b-space" : ""} section-t-md-space section-b-md-space`}>
      <Container>
        <Row className={`gy-4 ${type === "car" ? "ratio_65" : type === "job" ? "g-4" : "ratio_landscape"} `}>
          {showProperty.length > 0 ? (
            showProperty.map((item, i) => {
              return (
                <Fragment key={i}>
                  {type === "car" ? (
                    <Col xxl={3} lg={4} sm={6} className='table-row' data-aos='fade-up' data-aos-duration={100 * (i + 1)}>
                      <CarProductBox1 data={item} wishlist index={i} carId={item.id} />
                    </Col>
                  ) : type === "job" ? (
                    <Col xl={4} md={6} className='table-row' data-aos='fade-up' data-aos-duration={100 * (i + 1)}>
                      <Job1DetailBox data={item} wishlist index={i} jobId={item.id} />
                    </Col>
                  ) : (
                    <Col xxl={3} lg={4} sm={6} className='table-row' data-aos='fade-up' data-aos-duration={100 * (i + 1)}>
                      <Property1DetailBox data={item} wishlist index={i} propertyId={item.id} />
                    </Col>
                  )}
                </Fragment>
              );
            })
          ) : (
            <NotFound word='No items found in Wishlist' />
          )}
        </Row>
      </Container>
    </section>
  );
};

export default WishlistContent;
