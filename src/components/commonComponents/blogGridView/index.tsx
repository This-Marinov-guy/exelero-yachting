import React, { FC, useEffect } from "react";
import Breadcrumbs from "../breadcrumb";
import { RouteList } from "@/utils/RouteList";
import { Col, Container, Row } from "reactstrap";
import BlogSidebar from "./blogSidebar";
import BlogDetailBox from "./blogDetailBox";
import { useAppDispatch } from "@/redux/hooks";
import { setCardToShow } from "@/redux/reducers/LayoutSlice";
import { BlogGridViewType } from "@/types/CommonComponents";
import BlogTopSlider from "@/components/pages/blog/blogPage/blogTopSlider/blogSlider";

const BlogGridView: FC<BlogGridViewType> = ({ cardShow, side, gridSize, type, sectionClass, topSlider }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCardToShow(cardShow || 9));
  }, [cardShow, dispatch]);
  return (
    <>
      <Breadcrumbs title='Blog' url={RouteList.Home.CarDemo1} mainClass='page-breadcrumbs-section' />
      <section className={`${sectionClass ? sectionClass : ""} blog-grid-section section-b-space`}>
        <Container>
          {topSlider && <BlogTopSlider />}
          <Row className='custom-row gy-lg-0 gy-4'>
            {side !== "no" && (
              <Col lg={3} className={`${side !== "right" ? "order-lg-0" : ""} order-1`}>
                <BlogSidebar />
              </Col>
            )}
            <div className={side === "no" ? "col-lg-12" : "col-lg-9"}>
              {type === "load-more" ? (
                <div className="featured-wrapper">
                  <BlogDetailBox type={type} gridSize={gridSize} />
                </div>
              ) : (
                <BlogDetailBox type={type} gridSize={gridSize} />
              )}
            </div>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default BlogGridView;
