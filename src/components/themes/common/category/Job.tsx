import { FC, useRef } from "react";
import { Container, Row, Col } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import { Swiper as SwiperType } from "swiper";
import { useAppSelector } from "@/redux/hooks";
import CommonHeader from "../CommonHeader";
import { BrowseByCategory, JobCategoryTitle, SVGPath } from "@/constants";
import { JobCategoryContentData } from "@/data/demo/jobDemo1";
import { BrowseByCategoryContent, CategoriesSwiperData } from "@/data/demo/jobDemo2";
import { RouteList } from "@/utils/RouteList";

interface JobCategoriesProps {
  variant: "job-1" | "job-2";
}

const JobCategories: FC<JobCategoriesProps> = ({ variant }) => {
  const { categoryItem } = useAppSelector((state) => state.product);
  const swiperRef = useRef<SwiperType | null>(null);

  const filteredCategories = categoryItem.filter(({ id }) => id >= 14 && id <= 21);

  return (
    <section className={variant === "job-1" ? "job-category-section section-b-space" : "category-dark-section bg-transparent job-category-section"}>
      <Container>
        <CommonHeader
          title={variant === "job-1" ? JobCategoryTitle : BrowseByCategory}
          content={variant === "job-1" ? JobCategoryContentData : BrowseByCategoryContent}
          headClass={variant === "job-1" ? "title-style-3 text-center" : "title-style-4"}
        />
        {variant === "job-1" ? (
          <Row className="gy-4">
            {filteredCategories.map((category) => (
              <Col xl={3} lg={4} sm={6} key={category.id}>
                <div className="category-box">
                  <Image width={54} height={74} src={`${SVGPath}/job/job-box/dots-category.svg`} alt="dots" className="img-fluid dot-img" />
                  <div className="category-icon">
                    <Image width={42} height={42} src={`${SVGPath}/${category.categoryImage}`} alt={category.label} className="img-fluid" />
                  </div>
                  <div className="category-title">
                    <Link href={RouteList.Job.Grid.JobGrid2}><h5>{category.label}</h5></Link>
                    <span>{category.jobList}</span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="job-arrow position-relative">
            <Swiper {...CategoriesSwiperData} className="dark-category-slider" onInit={(swiper) => (swiperRef.current = swiper)}>
              {filteredCategories.map((category) => (
                <SwiperSlide key={category.id}>
                  <div className="category-box">
                    <div className="category-icon">
                      <Image width={36} height={36} src={`${SVGPath}/${category.categoryImage}`} alt={category.label} className="img-fluid" />
                    </div>
                    <div className="category-title">
                      <Link href={RouteList.Job.Grid.JobGrid2}><h5>{category.label}</h5></Link>
                      <span>{category.jobList}</span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </Container>
    </section>
  );
};

export default JobCategories;
