import { FC } from "react";
import { Container, Row, Col } from "reactstrap";
import { ImagePath } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";
import { RouteList } from "@/utils/RouteList";

interface PropertyCategoriesProps {
  variant: "property-1" | "property-2";
}

const PropertyCategories: FC<PropertyCategoriesProps> = ({ variant }) => {
  const { categoryItem } = useAppSelector((state) => state.product);

  const filteredCategories = variant === "property-1"
    ? categoryItem.filter(({ id }) => id >= 29 && id <= 33)
    : categoryItem.filter(({ id }) => id >= 34 && id <= 37);

  return (
    <section className={variant === "property-1" ? "property-categories-section section-b-space" : "section-t-lg-space property2-categories-section"}>
      <Container>
        <div className={`title-style-1 ${variant === "property-2" ? "title-style-6" : ""}`}>
          <h2>Categories</h2>
        </div>
        <Row className={`${variant === "property-1" ? "row-cols-xl-5 row-cols-sm-3 row-cols-2" : "gy-md-4"} justify-content-center gy-xl-0 g-3`}>
          {filteredCategories.map((item, i) => (
            <Col key={i} lg={variant === "property-1" ? undefined : 3} xs={variant === "property-1" ? undefined : 6}>
              <Link href={variant === "property-1" ? RouteList.Property.Grid.Property2Grid : RouteList.Property.Grid.Property3Grid} className="categories-box">
                <Image
                  width={variant === "property-1" ? 262 : 332}
                  height={variant === "property-1" ? 373 : 387}
                  src={`${ImagePath}/${item.categoryImage}`}
                  alt={item.label}
                  className="img-fluid"
                  unoptimized
                />
                {variant === "property-2" ? (
                  <div className="categories-info">
                    <h4>{item.label}</h4>
                    <h6>{item.propertyList}</h6>
                  </div>
                ) : (
                  <div className="categories-box-border">
                    <div className="icon-name">
                      <h5>{item.label}</h5>
                    </div>
                  </div>
                )}
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default PropertyCategories;
