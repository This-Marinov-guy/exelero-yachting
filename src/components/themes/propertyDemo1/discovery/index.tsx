import { ImagePath } from "@/constants";
import { DiscoveryData, DiscoverySlider } from "@/data/demo/propertyDemo1";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";
import { Container } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";

const Discovery = () => {
  return (
    <section className='section-b-space property-discovery-section'>
      <Container>
        <div className='title-style-1 dark-title'>
          <h2>Prospects For Discovery</h2>
        </div>
        <Swiper {...DiscoverySlider} className='discovery-slider'>
          <div className='swiper-wrapper'>
            {DiscoveryData.map((item, i) => {
              return (
                <SwiperSlide key={i}>
                  <Link href={RouteList.Property.Grid.Property3Grid} className='discovery-img'>
                    <Image width={251} height={768} src={`${ImagePath}/property/discovery/${item.image}.jpg`} alt='discovery-img' className='img-fluid' unoptimized/>
                    <div className='discovery-content'>
                      <h5>{item.country}</h5>
                      <ul>
                        <li>
                          <span>{item.sale} Sale</span>
                        </li>
                        <li>
                          <span>{item.rent} Rent</span>
                        </li>
                      </ul>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </div>
        </Swiper>
      </Container>
    </section>
  );
};

export default Discovery;
