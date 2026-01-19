import DetailImages from "@/components/commonComponents/productDetail/detailImages/DetailImages";
import { PropertyDetailType } from "@/types/Product";
import { FC, Fragment } from "react";
import { Container } from "reactstrap";
import CarSlider from "@/components/themes/carDemo1/carHomeSection/CarSlider";
import CarThumbnailSet from "../details/carThumbnailSlider/carThumbnail";
import BreadcrumbMainDetail from "./BreadcrumbMainDetail";

const CarBreadcrumb: FC<PropertyDetailType> = ({ detailImages, mainClass, type, multiple, modern }) => {
  return (
    <Fragment>
      {type === "car-thumbnail" ? (
        <CarThumbnailSet />
      ) : (
        <div className={`car-breadcrumbs-section ${mainClass ? mainClass : ""}`}>
          <Container>
            {detailImages && (
              <div className='car-detail-image'>
                <DetailImages type={type} multiple={multiple} />
              </div>
            )}
            {modern && <CarSlider />}
            <BreadcrumbMainDetail />
          </Container>
        </div>
      )}
    </Fragment>
  );
};

export default CarBreadcrumb;
