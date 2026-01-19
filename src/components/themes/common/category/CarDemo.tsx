import { FC } from "react";
import { Container } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import Image from "next/image";
import { CategoriesTitle, ExploreByCategory, ImagePath } from "@/constants";
import { useAppSelector } from "@/redux/hooks";
import CommonHeader from "../CommonHeader";
import { CategoriesContentData, CategoriesSettingData } from "@/data/demo/demo1";
import { RouteList } from "@/utils/RouteList";
import RatioImage from "@/utils/RatioImage";
import { dynamicNumber } from "@/utils";

interface CarDemoCategoriesProps {
  variant: "carDemo-1" | "carDemo-2";
}

const CarDemoCategories: FC<CarDemoCategoriesProps> = ({ variant }) => {
  const { categoryItem } = useAppSelector((state) => state.product);

  const isDemo1 = variant === "carDemo-1";
  const filteredCategories = isDemo1
    ? categoryItem.filter((e) => dynamicNumber(7).includes(e.id))
    : categoryItem.filter(({ id }) => id >= 8 && id <= 13);

  return (
    <section className={isDemo1 ? 'car-categories-section bg-color section-t-lg-space' : 'car2-category-section section-t-lg-space section-b-lg-space'}>
      <Container>
        <CommonHeader
          title={isDemo1 ? CategoriesTitle : ExploreByCategory}
          content={CategoriesContentData}
          headClass="title-style-2"
          animation={isDemo1}
        />

        <div className={!isDemo1 ? 'arrow-style-2 position-relative' : undefined}>
          <Swiper
            {...CategoriesSettingData}
            className={isDemo1 ? 'car-categories-slider' : 'car2-category-slider ratio3_2'}
          >
            {filteredCategories.map((car, index) => (
              <SwiperSlide key={index}>
                {isDemo1 ? (
                  <div className='categories-box'>
                    <Link href={RouteList.Car.Listing.CarLeftList} className='categories-img'>
                      <Image
                        width={200}
                        height={82}
                        src={`${ImagePath}/${car.categoryImage}`}
                        alt={`car-${index + 1}`}
                        className='img-fluid'
                        unoptimized
                      />
                    </Link>
                    <div className='categories-board'>
                      <span>{car.label}</span>
                    </div>
                  </div>
                ) : (
                  <div className='category-box'>
                    <Link href={RouteList.Car.Grid.Car3Grid} className='category-img'>
                      <RatioImage
                        src={`${ImagePath}/${car.categoryImage}`}
                        alt={`car-${index + 1}`}
                        className='img-fluid bg-img'
                      />
                    </Link>
                    <Link href={RouteList.Car.Grid.Car3Grid} className='category-title'>
                      {car.label}
                    </Link>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation buttons for carDemo-2 */}
          {!isDemo1 && (
            <>
              <div className='swiper-button-next car2-category-next' />
              <div className='swiper-button-prev car2-category-prev' />
            </>
          )}
        </div>
      </Container>
    </section>
  );
};

export default CarDemoCategories;