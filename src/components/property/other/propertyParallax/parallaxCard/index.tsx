import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useEffect } from "react";
import RatioImage from "@/utils/RatioImage";
import { ImagePath } from "@/constants";
import Link from "next/link";
import { RouteList } from "@/utils/RouteList";
import { Location } from "iconsax-react";
import SvgIcon from "@/utils/SvgIcon";
import { fetchProductApiData } from "@/redux/reducers/ProductSlice";

const ParallaxCard = () => {
  const dispatch = useAppDispatch();
  const { productItem } = useAppSelector((state) => state.product);
  const showData = productItem.filter((item) => item.type === "property").slice(0, 5);

  useEffect(() => {
    dispatch(fetchProductApiData());
  }, [dispatch]);

  return (
    <section className='section-t-md-space section-b-md-space property-parallax property-inner-section'>
      {showData.map((data, index) => (
        <div className='featured-box featured-parallax' key={index}>
          <div className='parallax-img'>
            <RatioImage src={`${ImagePath}/property/dark-property/${(index ?? 0) + 1}.jpg`} alt='featured-img' className='bg-img' />
          </div>
          <div className='parallax-content'>
            <div className='featured-content'>
              <div className="featured-rating">
                <Link href={RouteList.Property.Detail.PropertySidebarLayout}>{data.title}</Link>
                <label><i className="ri-star-fill" />{data.rating}</label>
              </div>
              <p>{data.location}</p>
              <p><Location className="iconsax" />{data.location}</p>
              <ul className='featured-list'>
                {data?.features?.map((item, i) => {
                  return (
                    <li key={i}>
                      <SvgIcon iconId={`/property/sprite/${item.icon}`} />
                      <span>{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className='featured-price'>
              <h5>${data.price}</h5>
              <Link href={RouteList.Property.Detail.PropertySidebarLayout} className='btn-solid'>
                See More
              </Link>
            </div>
          </div>
        </div>
      )
      )}
    </section>
  );
};

export default ParallaxCard;